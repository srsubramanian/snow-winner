# ServiceNow Change Ticket Compliance Dashboard

A web application for the controls team to review ServiceNow change tickets pending approval, surface compliance issues, and show how to fix them.

## Tech Stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS + Shadcn/ui
- **Backend:** Python + FastAPI + AWS Bedrock (Claude)
- **Data:** Mock APIs with pre-canned responses

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- AWS credentials with Bedrock access (for chat feature)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure AWS credentials (choose one method):
# 1. Use AWS CLI: aws configure
# 2. Set environment variables:
export AWS_DEFAULT_REGION=us-east-1
export AWS_PROFILE=default  # Optional: use a specific profile

# Optional: Override the default model
export BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0

uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at http://localhost:5173

## Features

- **Dashboard:** View list of change tickets with compliance status
- **Filters:** Filter by status, priority, compliance level, and assignee
- **Sorting:** Sort by date, priority, or compliance status
- **Detail View:** Validation checklist showing pass/fail for each rule
- **Compliance Badges:** Green/yellow/red indicators for ticket health
- **Chat Assistant:** Natural language interface to query tickets using AWS Bedrock (Claude)

## Chat Assistant

The Chat Assistant allows you to interact with ticket data using natural language. Examples:

- "Show me all non-compliant tickets"
- "Which tickets are assigned to Mike Johnson?"
- "Why is CHG0012348 non-compliant?"
- "What tickets are scheduled for this week?"
- "How many tickets are pending approval?"

The assistant uses AWS Bedrock to understand your queries and provides relevant information from the ticket database.

### AWS Bedrock Configuration

| Environment Variable | Description | Default |
|---------------------|-------------|---------|
| `AWS_DEFAULT_REGION` | AWS region for Bedrock | `us-east-1` |
| `AWS_PROFILE` | AWS credentials profile | default chain |
| `BEDROCK_MODEL_ID` | Bedrock model to use | `us.amazon.nova-pro-v1:0` |

**Amazon Models (no additional setup required):**
- `us.amazon.nova-pro-v1:0` (default, recommended)
- `us.amazon.nova-lite-v1:0` (faster, cheaper)
- `us.amazon.nova-micro-v1:0` (fastest, cheapest)

**Claude Models (require use case form submission):**
- `us.anthropic.claude-3-5-sonnet-20241022-v2:0`
- `us.anthropic.claude-3-5-haiku-20241022-v1:0`
- `us.anthropic.claude-3-haiku-20240307-v1:0`

**Note:** Claude models require completing the use case form in AWS Console → Bedrock → Model access.

## Validation Rules

1. **Required Fields** - All mandatory fields must be filled
2. **Approval Chain** - Must have at least one approver assigned
3. **Testing Evidence** - Must have test results or evidence attached
4. **Change Window** - Must specify a valid change window
5. **Rollback Plan** - Must document rollback procedure

## Compliance Status Logic

- **Green (Compliant):** All 5 rules pass
- **Yellow (Warning):** 1-2 rules fail (warnings only)
- **Red (Non-compliant):** 3+ rules fail or any critical error

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets` | List all tickets (with filters) |
| GET | `/api/tickets/{id}` | Get single ticket detail |
| GET | `/api/stats` | Dashboard summary stats |
| POST | `/api/chat` | Chat with AI assistant (Bedrock) |
