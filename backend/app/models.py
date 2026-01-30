from pydantic import BaseModel
from typing import Literal, Optional
from datetime import datetime


class ValidationResult(BaseModel):
    rule: str
    passed: bool
    severity: Literal["error", "warning"]
    message: str
    suggestion: str


class ChangeTicket(BaseModel):
    id: str
    number: str  # CHG0012345 format
    shortDescription: str
    description: str
    requestedBy: str
    assignedTo: str
    priority: Literal["Critical", "High", "Medium", "Low"]
    status: Literal["Pending Approval", "Approved", "Rejected", "In Review"]
    createdAt: str
    scheduledStartDate: str
    scheduledEndDate: str

    # Validation-related fields
    approvalChain: Optional[list[str]] = None
    testingEvidence: Optional[str] = None
    rollbackPlan: Optional[str] = None
    changeWindow: Optional[str] = None

    # Computed compliance
    complianceStatus: Literal["compliant", "warning", "non-compliant"]
    validationResults: list[ValidationResult]


class TicketListResponse(BaseModel):
    tickets: list[ChangeTicket]
    total: int
    page: int
    pageSize: int


class DashboardStats(BaseModel):
    totalTickets: int
    pendingApproval: int
    compliant: int
    warning: int
    nonCompliant: int
    byPriority: dict[str, int]
    byAssignee: dict[str, int]
