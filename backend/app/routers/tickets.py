from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.models import ChangeTicket, TicketListResponse, DashboardStats
from app.mock_data import MOCK_TICKETS

router = APIRouter(prefix="/api", tags=["tickets"])


@router.get("/tickets", response_model=TicketListResponse)
def list_tickets(
    status: Optional[str] = Query(None, description="Filter by status"),
    priority: Optional[str] = Query(None, description="Filter by priority"),
    compliance: Optional[str] = Query(None, description="Filter by compliance status"),
    assignee: Optional[str] = Query(None, description="Filter by assignee"),
    sort_by: Optional[str] = Query("createdAt", description="Sort field"),
    sort_order: Optional[str] = Query("desc", description="Sort order (asc/desc)"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Page size"),
):
    """List all tickets with optional filtering and sorting."""
    filtered = MOCK_TICKETS.copy()

    # Apply filters
    if status:
        filtered = [t for t in filtered if t.status == status]
    if priority:
        filtered = [t for t in filtered if t.priority == priority]
    if compliance:
        filtered = [t for t in filtered if t.complianceStatus == compliance]
    if assignee:
        filtered = [t for t in filtered if t.assignedTo == assignee]

    # Apply sorting
    sort_key_map = {
        "createdAt": lambda t: t.createdAt,
        "priority": lambda t: {"Critical": 0, "High": 1, "Medium": 2, "Low": 3}.get(t.priority, 4),
        "compliance": lambda t: {"non-compliant": 0, "warning": 1, "compliant": 2}.get(t.complianceStatus, 3),
        "scheduledStartDate": lambda t: t.scheduledStartDate,
    }

    if sort_by in sort_key_map:
        reverse = sort_order == "desc"
        filtered.sort(key=sort_key_map[sort_by], reverse=reverse)

    # Paginate
    total = len(filtered)
    start = (page - 1) * page_size
    end = start + page_size
    paginated = filtered[start:end]

    return TicketListResponse(
        tickets=paginated,
        total=total,
        page=page,
        pageSize=page_size
    )


@router.get("/tickets/{ticket_id}", response_model=ChangeTicket)
def get_ticket(ticket_id: str):
    """Get a single ticket by ID."""
    for ticket in MOCK_TICKETS:
        if ticket.id == ticket_id:
            return ticket
    raise HTTPException(status_code=404, detail="Ticket not found")


@router.get("/stats", response_model=DashboardStats)
def get_stats():
    """Get dashboard summary statistics."""
    tickets = MOCK_TICKETS

    # Count by compliance status
    compliant = sum(1 for t in tickets if t.complianceStatus == "compliant")
    warning = sum(1 for t in tickets if t.complianceStatus == "warning")
    non_compliant = sum(1 for t in tickets if t.complianceStatus == "non-compliant")

    # Count pending approval
    pending_approval = sum(1 for t in tickets if t.status == "Pending Approval")

    # Count by priority
    by_priority = {}
    for t in tickets:
        by_priority[t.priority] = by_priority.get(t.priority, 0) + 1

    # Count by assignee
    by_assignee = {}
    for t in tickets:
        by_assignee[t.assignedTo] = by_assignee.get(t.assignedTo, 0) + 1

    return DashboardStats(
        totalTickets=len(tickets),
        pendingApproval=pending_approval,
        compliant=compliant,
        warning=warning,
        nonCompliant=non_compliant,
        byPriority=by_priority,
        byAssignee=by_assignee
    )
