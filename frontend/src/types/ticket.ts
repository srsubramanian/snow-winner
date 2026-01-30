export interface ValidationResult {
  rule: string;
  passed: boolean;
  severity: 'error' | 'warning';
  message: string;
  suggestion: string;
}

export interface ChangeTicket {
  id: string;
  number: string;
  shortDescription: string;
  description: string;
  requestedBy: string;
  assignedTo: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Pending Approval' | 'Approved' | 'Rejected' | 'In Review';
  createdAt: string;
  scheduledStartDate: string;
  scheduledEndDate: string;
  approvalChain: string[] | null;
  testingEvidence: string | null;
  rollbackPlan: string | null;
  changeWindow: string | null;
  complianceStatus: 'compliant' | 'warning' | 'non-compliant';
  validationResults: ValidationResult[];
}

export interface TicketListResponse {
  tickets: ChangeTicket[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DashboardStats {
  totalTickets: number;
  pendingApproval: number;
  compliant: number;
  warning: number;
  nonCompliant: number;
  byPriority: Record<string, number>;
  byAssignee: Record<string, number>;
}

export interface TicketFilters {
  status?: string;
  priority?: string;
  compliance?: string;
  assignee?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
