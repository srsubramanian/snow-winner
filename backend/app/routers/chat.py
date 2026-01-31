import os
import json
import boto3
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from botocore.exceptions import NoCredentialsError, ClientError
from app.mock_data import MOCK_TICKETS

router = APIRouter(prefix="/api", tags=["chat"])


def get_bedrock_region() -> str:
    """Get AWS region for Bedrock (defaults to us-east-1)."""
    return os.getenv("AWS_DEFAULT_REGION") or os.getenv("AWS_REGION") or "us-east-1"


def get_bedrock_profile() -> str | None:
    """Get AWS profile for Bedrock (None uses default credential chain)."""
    return os.getenv("AWS_PROFILE") or os.getenv("BEDROCK_PROFILE")


def get_bedrock_model() -> str:
    """Get Bedrock model ID from environment or use default.

    Note: Claude models may require use case forms and inference profiles.
    Amazon Nova Pro is used as default for broad compatibility.
    For Claude, use inference profile format: us.anthropic.claude-3-5-sonnet-20241022-v2:0
    """
    return os.getenv("BEDROCK_MODEL_ID", "us.amazon.nova-pro-v1:0")


def create_bedrock_client():
    """Create a boto3 bedrock-runtime client using configured credentials."""
    profile = get_bedrock_profile()
    region = get_bedrock_region()

    session_kwargs = {"region_name": region}
    if profile:
        session_kwargs["profile_name"] = profile

    boto_session = boto3.Session(**session_kwargs)
    return boto_session.client("bedrock-runtime")


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]


class ChatResponse(BaseModel):
    response: str


def get_tickets_context() -> str:
    """Generate a context string with current ticket data."""
    tickets_summary = []
    for t in MOCK_TICKETS:
        failed_rules = [r.rule for r in t.validationResults if not r.passed]
        tickets_summary.append({
            "id": t.id,
            "number": t.number,
            "shortDescription": t.shortDescription,
            "assignedTo": t.assignedTo,
            "requestedBy": t.requestedBy,
            "priority": t.priority,
            "status": t.status,
            "complianceStatus": t.complianceStatus,
            "scheduledStartDate": t.scheduledStartDate,
            "failedValidations": failed_rules,
            "hasApprovalChain": t.approvalChain is not None and len(t.approvalChain) > 0,
            "hasTestingEvidence": t.testingEvidence is not None,
            "hasRollbackPlan": t.rollbackPlan is not None,
            "hasChangeWindow": t.changeWindow is not None,
        })
    return json.dumps(tickets_summary, indent=2)


SYSTEM_PROMPT = """You are a helpful assistant for a ServiceNow Change Ticket Compliance Dashboard.
You help controls team members review change tickets, understand compliance issues, and provide guidance on how to fix them.

You have access to the following ticket data:

{tickets_data}

Key concepts:
- Each ticket has a compliance status: "compliant" (green), "warning" (yellow), or "non-compliant" (red)
- Tickets are validated against 5 rules:
  1. Required Fields - All mandatory fields must be filled
  2. Approval Chain - Must have at least one approver assigned
  3. Testing Evidence - Must have test results or evidence attached
  4. Rollback Plan - Must document rollback procedure
  5. Change Window - Must specify a valid change window

Compliance status logic:
- Green (Compliant): All 5 rules pass
- Yellow (Warning): 1-2 rules fail (warnings only, no errors)
- Red (Non-compliant): 3+ rules fail OR any critical error (Required Fields, Approval Chain, or Rollback Plan)

You can help users:
- Find tickets by various criteria (assignee, priority, status, compliance)
- Explain why a ticket is non-compliant
- Suggest how to fix compliance issues
- Provide summaries and statistics
- Answer questions about specific tickets

Formatting guidelines:
- Always respond in Markdown format for better readability
- Use tables when presenting multiple tickets or comparing data (e.g., | Ticket | Status | Priority |)
- Use bullet points for lists of items or issues
- Use **bold** for ticket numbers and important terms
- Use headings (##, ###) to organize longer responses
- Use code blocks for technical details if needed
- Be concise but helpful
- Always reference ticket numbers (CHG...) when discussing specific tickets"""


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Process a chat message and return AI response using AWS Bedrock."""
    try:
        # Build the system prompt with current ticket data
        system_prompt = SYSTEM_PROMPT.format(tickets_data=get_tickets_context())

        # Convert messages to Bedrock Converse API format
        messages = [
            {"role": msg.role, "content": [{"text": msg.content}]}
            for msg in request.messages
        ]

        # Create Bedrock client
        bedrock_client = create_bedrock_client()
        model_id = get_bedrock_model()

        # Call Bedrock Converse API
        response = bedrock_client.converse(
            modelId=model_id,
            system=[{"text": system_prompt}],
            messages=messages,
            inferenceConfig={
                "maxTokens": 1024,
                "temperature": 0.0,
            }
        )

        # Extract text response from Bedrock response
        output = response.get("output", {})
        message = output.get("message", {})
        content = message.get("content", [])

        # Extract text from content blocks
        response_text = ""
        for block in content:
            if "text" in block:
                response_text += block["text"]

        if not response_text:
            response_text = "I couldn't generate a response. Please try again."

        return ChatResponse(response=response_text)

    except NoCredentialsError:
        raise HTTPException(
            status_code=500,
            detail="AWS credentials not found. Run 'aws configure' or set up IAM role/profile."
        )
    except ClientError as e:
        error_code = e.response.get('Error', {}).get('Code', '')
        error_message = e.response.get('Error', {}).get('Message', str(e))

        if error_code in ('UnauthorizedOperation', 'AccessDeniedException'):
            raise HTTPException(
                status_code=500,
                detail=f"AWS credentials found but no access to Bedrock. Check IAM permissions. Error: {error_message}"
            )
        elif error_code == 'ValidationException':
            raise HTTPException(
                status_code=500,
                detail=f"Bedrock validation error. Ensure model is enabled in AWS Console. Error: {error_message}"
            )
        else:
            raise HTTPException(status_code=500, detail=f"Bedrock error: {error_message}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")
