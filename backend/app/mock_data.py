from app.models import ChangeTicket, ValidationResult


def validate_ticket(ticket_data: dict) -> tuple[str, list[ValidationResult]]:
    """Validate a ticket and return compliance status and validation results."""
    results = []

    # Rule 1: Required Fields
    required_filled = all([
        ticket_data.get("shortDescription"),
        ticket_data.get("description"),
        ticket_data.get("requestedBy"),
        ticket_data.get("assignedTo"),
        ticket_data.get("scheduledStartDate"),
        ticket_data.get("scheduledEndDate"),
    ])
    results.append(ValidationResult(
        rule="Required Fields",
        passed=required_filled,
        severity="error",
        message="All mandatory fields are filled" if required_filled else "Missing required fields",
        suggestion="" if required_filled else "Fill in all mandatory fields: description, requestedBy, assignedTo, scheduled dates"
    ))

    # Rule 2: Approval Chain
    has_approvers = bool(ticket_data.get("approvalChain") and len(ticket_data["approvalChain"]) > 0)
    results.append(ValidationResult(
        rule="Approval Chain",
        passed=has_approvers,
        severity="error",
        message="Approval chain is configured" if has_approvers else "No approvers assigned",
        suggestion="" if has_approvers else "Add at least one approver to the approval chain"
    ))

    # Rule 3: Testing Evidence
    has_testing = bool(ticket_data.get("testingEvidence"))
    results.append(ValidationResult(
        rule="Testing Evidence",
        passed=has_testing,
        severity="warning",
        message="Testing evidence attached" if has_testing else "No testing evidence found",
        suggestion="" if has_testing else "Attach test results, screenshots, or documentation proving the change was tested"
    ))

    # Rule 4: Change Window
    has_window = bool(ticket_data.get("changeWindow"))
    results.append(ValidationResult(
        rule="Change Window",
        passed=has_window,
        severity="warning",
        message="Change window specified" if has_window else "No change window defined",
        suggestion="" if has_window else "Specify an approved change window (e.g., 'Saturday 2:00 AM - 6:00 AM EST')"
    ))

    # Rule 5: Rollback Plan
    has_rollback = bool(ticket_data.get("rollbackPlan"))
    results.append(ValidationResult(
        rule="Rollback Plan",
        passed=has_rollback,
        severity="error",
        message="Rollback plan documented" if has_rollback else "No rollback plan provided",
        suggestion="" if has_rollback else "Document a step-by-step rollback procedure in case the change fails"
    ))

    # Calculate compliance status
    failed_count = sum(1 for r in results if not r.passed)
    error_count = sum(1 for r in results if not r.passed and r.severity == "error")

    if failed_count == 0:
        compliance_status = "compliant"
    elif error_count > 0 or failed_count >= 3:
        compliance_status = "non-compliant"
    else:
        compliance_status = "warning"

    return compliance_status, results


# Pre-canned ticket data
RAW_TICKETS = [
    {
        "id": "1",
        "number": "CHG0012345",
        "shortDescription": "Database schema migration for user service",
        "description": "Migrate user database schema to support new authentication fields. This includes adding columns for MFA settings, session tokens, and audit logging.",
        "requestedBy": "Sarah Chen",
        "assignedTo": "Mike Johnson",
        "priority": "High",
        "status": "Pending Approval",
        "createdAt": "2025-01-28T09:00:00Z",
        "scheduledStartDate": "2025-02-01T02:00:00Z",
        "scheduledEndDate": "2025-02-01T06:00:00Z",
        "approvalChain": ["David Kim", "Lisa Wang"],
        "testingEvidence": "Unit tests passed, integration tests completed in staging environment. See attached test report.",
        "rollbackPlan": "1. Stop application servers\n2. Restore database from pre-migration backup\n3. Restart application servers\n4. Verify user authentication works",
        "changeWindow": "Saturday 2:00 AM - 6:00 AM EST"
    },
    {
        "id": "2",
        "number": "CHG0012346",
        "shortDescription": "API gateway version upgrade",
        "description": "Upgrade API gateway from v2.3 to v3.0 to support new rate limiting features and improved logging.",
        "requestedBy": "Alex Rivera",
        "assignedTo": "Jennifer Lee",
        "priority": "Critical",
        "status": "Pending Approval",
        "createdAt": "2025-01-27T14:30:00Z",
        "scheduledStartDate": "2025-02-02T03:00:00Z",
        "scheduledEndDate": "2025-02-02T05:00:00Z",
        "approvalChain": ["David Kim"],
        "testingEvidence": None,
        "rollbackPlan": "Revert to previous gateway version using blue-green deployment switch",
        "changeWindow": "Sunday 3:00 AM - 5:00 AM EST"
    },
    {
        "id": "3",
        "number": "CHG0012347",
        "shortDescription": "Security patch deployment - CVE-2025-1234",
        "description": "Emergency security patch for critical vulnerability CVE-2025-1234 affecting the payment processing module.",
        "requestedBy": "Security Team",
        "assignedTo": "Mike Johnson",
        "priority": "Critical",
        "status": "Pending Approval",
        "createdAt": "2025-01-29T08:00:00Z",
        "scheduledStartDate": "2025-01-29T22:00:00Z",
        "scheduledEndDate": "2025-01-30T00:00:00Z",
        "approvalChain": ["David Kim", "Lisa Wang", "CISO Office"],
        "testingEvidence": "Patch tested in isolated security lab. Vulnerability scan confirms fix. See security assessment report.",
        "rollbackPlan": "1. Disable affected endpoints\n2. Rollback patch via deployment pipeline\n3. Re-enable endpoints\n4. Apply temporary WAF rules",
        "changeWindow": "Emergency - Approved off-hours"
    },
    {
        "id": "4",
        "number": "CHG0012348",
        "shortDescription": "Redis cache cluster expansion",
        "description": "Add two additional Redis nodes to the production cache cluster to handle increased traffic from the holiday promotion.",
        "requestedBy": "Tom Bradley",
        "assignedTo": "Emily Zhang",
        "priority": "Medium",
        "status": "Pending Approval",
        "createdAt": "2025-01-26T11:00:00Z",
        "scheduledStartDate": "2025-02-03T04:00:00Z",
        "scheduledEndDate": "2025-02-03T06:00:00Z",
        "approvalChain": None,
        "testingEvidence": "Load tested with 2x expected traffic. Performance metrics attached.",
        "rollbackPlan": None,
        "changeWindow": "Monday 4:00 AM - 6:00 AM EST"
    },
    {
        "id": "5",
        "number": "CHG0012349",
        "shortDescription": "SSL certificate renewal",
        "description": "Renew and deploy SSL certificates for *.example.com before expiration on Feb 15.",
        "requestedBy": "Jennifer Lee",
        "assignedTo": "Alex Rivera",
        "priority": "High",
        "status": "Pending Approval",
        "createdAt": "2025-01-25T16:00:00Z",
        "scheduledStartDate": "2025-02-05T01:00:00Z",
        "scheduledEndDate": "2025-02-05T02:00:00Z",
        "approvalChain": ["David Kim"],
        "testingEvidence": "Certificate validated in staging. Browser compatibility verified.",
        "rollbackPlan": "Keep old certificates as backup. Switch back if issues detected.",
        "changeWindow": None
    },
    {
        "id": "6",
        "number": "CHG0012350",
        "shortDescription": "Kubernetes cluster node upgrade",
        "description": "Upgrade Kubernetes worker nodes from v1.28 to v1.29 with rolling update strategy.",
        "requestedBy": "Platform Team",
        "assignedTo": "Mike Johnson",
        "priority": "Medium",
        "status": "In Review",
        "createdAt": "2025-01-24T10:00:00Z",
        "scheduledStartDate": "2025-02-08T02:00:00Z",
        "scheduledEndDate": "2025-02-08T08:00:00Z",
        "approvalChain": ["Lisa Wang", "Platform Lead"],
        "testingEvidence": "Tested upgrade path in dev and staging clusters. All workloads compatible.",
        "rollbackPlan": "Rolling back affected nodes using cordon/drain/replace procedure",
        "changeWindow": "Saturday 2:00 AM - 8:00 AM EST"
    },
    {
        "id": "7",
        "number": "CHG0012351",
        "shortDescription": "Add monitoring dashboards",
        "description": "Deploy new Grafana dashboards for the order processing service.",
        "requestedBy": "Operations Team",
        "assignedTo": "Emily Zhang",
        "priority": "Low",
        "status": "Pending Approval",
        "createdAt": "2025-01-23T09:30:00Z",
        "scheduledStartDate": "2025-02-10T10:00:00Z",
        "scheduledEndDate": "2025-02-10T11:00:00Z",
        "approvalChain": ["Tom Bradley"],
        "testingEvidence": "Dashboards tested in staging Grafana instance",
        "rollbackPlan": "Delete dashboard configurations via Grafana API",
        "changeWindow": "Monday 10:00 AM - 11:00 AM EST"
    },
    {
        "id": "8",
        "number": "CHG0012352",
        "shortDescription": "Network firewall rule update",
        "description": "Update firewall rules to allow traffic from new partner integration IP ranges.",
        "requestedBy": "Partnership Team",
        "assignedTo": "Jennifer Lee",
        "priority": "High",
        "status": "Pending Approval",
        "createdAt": "2025-01-28T13:00:00Z",
        "scheduledStartDate": "2025-02-01T14:00:00Z",
        "scheduledEndDate": "2025-02-01T15:00:00Z",
        "approvalChain": None,
        "testingEvidence": None,
        "rollbackPlan": None,
        "changeWindow": None
    },
    {
        "id": "9",
        "number": "CHG0012353",
        "shortDescription": "Database connection pool tuning",
        "description": "Increase database connection pool size from 50 to 100 connections per service instance.",
        "requestedBy": "DBA Team",
        "assignedTo": "Alex Rivera",
        "priority": "Medium",
        "status": "Approved",
        "createdAt": "2025-01-22T08:00:00Z",
        "scheduledStartDate": "2025-01-30T03:00:00Z",
        "scheduledEndDate": "2025-01-30T04:00:00Z",
        "approvalChain": ["David Kim", "DBA Lead"],
        "testingEvidence": "Load tested with increased pool size. No connection timeouts observed.",
        "rollbackPlan": "Revert configuration and restart affected services",
        "changeWindow": "Thursday 3:00 AM - 4:00 AM EST"
    },
    {
        "id": "10",
        "number": "CHG0012354",
        "shortDescription": "Deploy new search microservice",
        "description": "Deploy Elasticsearch-based search microservice to replace legacy search functionality.",
        "requestedBy": "Product Team",
        "assignedTo": "Tom Bradley",
        "priority": "High",
        "status": "Pending Approval",
        "createdAt": "2025-01-27T15:00:00Z",
        "scheduledStartDate": "2025-02-03T02:00:00Z",
        "scheduledEndDate": "2025-02-03T06:00:00Z",
        "approvalChain": ["Lisa Wang"],
        "testingEvidence": None,
        "rollbackPlan": "Feature flag to switch back to legacy search endpoint",
        "changeWindow": "Monday 2:00 AM - 6:00 AM EST"
    },
    {
        "id": "11",
        "number": "CHG0012355",
        "shortDescription": "CDN configuration update",
        "description": "Update CDN caching rules for static assets to improve page load times.",
        "requestedBy": "Frontend Team",
        "assignedTo": "Emily Zhang",
        "priority": "Low",
        "status": "Pending Approval",
        "createdAt": "2025-01-26T14:00:00Z",
        "scheduledStartDate": "2025-02-04T09:00:00Z",
        "scheduledEndDate": "2025-02-04T10:00:00Z",
        "approvalChain": ["Jennifer Lee"],
        "testingEvidence": "Tested new caching rules in staging CDN environment",
        "rollbackPlan": "Revert CDN configuration via Terraform",
        "changeWindow": "Tuesday 9:00 AM - 10:00 AM EST"
    },
    {
        "id": "12",
        "number": "CHG0012356",
        "shortDescription": "Message queue migration",
        "description": "Migrate from RabbitMQ to Apache Kafka for the event streaming platform.",
        "requestedBy": "Architecture Team",
        "assignedTo": "Mike Johnson",
        "priority": "Critical",
        "status": "Pending Approval",
        "createdAt": "2025-01-20T10:00:00Z",
        "scheduledStartDate": "2025-02-15T01:00:00Z",
        "scheduledEndDate": "2025-02-15T09:00:00Z",
        "approvalChain": None,
        "testingEvidence": None,
        "rollbackPlan": None,
        "changeWindow": None
    },
    {
        "id": "13",
        "number": "CHG0012357",
        "shortDescription": "Logging infrastructure upgrade",
        "description": "Upgrade ELK stack to latest version and increase log retention to 90 days.",
        "requestedBy": "Compliance Team",
        "assignedTo": "Jennifer Lee",
        "priority": "Medium",
        "status": "In Review",
        "createdAt": "2025-01-25T11:30:00Z",
        "scheduledStartDate": "2025-02-06T02:00:00Z",
        "scheduledEndDate": "2025-02-06T06:00:00Z",
        "approvalChain": ["David Kim", "Compliance Officer"],
        "testingEvidence": "Upgrade tested in dev environment. All log pipelines validated.",
        "rollbackPlan": "Snapshot current indices, restore if upgrade fails",
        "changeWindow": "Thursday 2:00 AM - 6:00 AM EST"
    },
    {
        "id": "14",
        "number": "CHG0012358",
        "shortDescription": "Load balancer health check update",
        "description": "Update health check endpoints and intervals for production load balancers.",
        "requestedBy": "SRE Team",
        "assignedTo": "Alex Rivera",
        "priority": "Medium",
        "status": "Pending Approval",
        "createdAt": "2025-01-28T16:00:00Z",
        "scheduledStartDate": "2025-02-02T05:00:00Z",
        "scheduledEndDate": "2025-02-02T06:00:00Z",
        "approvalChain": ["Tom Bradley"],
        "testingEvidence": "Health check changes tested with staging load balancer",
        "rollbackPlan": "Revert health check configuration via infrastructure-as-code",
        "changeWindow": "Sunday 5:00 AM - 6:00 AM EST"
    },
    {
        "id": "15",
        "number": "CHG0012359",
        "shortDescription": "OAuth provider integration",
        "description": "Add support for Google OAuth as an additional authentication provider.",
        "requestedBy": "Identity Team",
        "assignedTo": "Emily Zhang",
        "priority": "High",
        "status": "Rejected",
        "createdAt": "2025-01-21T09:00:00Z",
        "scheduledStartDate": "2025-02-01T03:00:00Z",
        "scheduledEndDate": "2025-02-01T05:00:00Z",
        "approvalChain": ["Security Lead"],
        "testingEvidence": None,
        "rollbackPlan": "Disable OAuth provider via feature flag",
        "changeWindow": "Saturday 3:00 AM - 5:00 AM EST"
    }
]


def get_mock_tickets() -> list[ChangeTicket]:
    """Generate mock tickets with computed validation results."""
    tickets = []
    for raw in RAW_TICKETS:
        compliance_status, validation_results = validate_ticket(raw)
        ticket = ChangeTicket(
            **raw,
            complianceStatus=compliance_status,
            validationResults=validation_results
        )
        tickets.append(ticket)
    return tickets


MOCK_TICKETS = get_mock_tickets()
