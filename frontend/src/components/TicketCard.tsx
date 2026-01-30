import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComplianceBadge } from "@/components/ComplianceBadge";
import { Calendar, User, Clock } from "lucide-react";
import type { ChangeTicket } from "@/types/ticket";

interface TicketCardProps {
  ticket: ChangeTicket;
  onClick: () => void;
}

const priorityColors: Record<ChangeTicket["priority"], string> = {
  Critical: "bg-red-100 text-red-800 border-red-200",
  High: "bg-orange-100 text-orange-800 border-orange-200",
  Medium: "bg-blue-100 text-blue-800 border-blue-200",
  Low: "bg-gray-100 text-gray-800 border-gray-200",
};

const statusColors: Record<ChangeTicket["status"], string> = {
  "Pending Approval": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "In Review": "bg-blue-100 text-blue-800 border-blue-200",
  Approved: "bg-green-100 text-green-800 border-green-200",
  Rejected: "bg-red-100 text-red-800 border-red-200",
};

export function TicketCard({ ticket, onClick }: TicketCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const failedRules = ticket.validationResults.filter((r) => !r.passed).length;

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-mono text-muted-foreground">
                {ticket.number}
              </span>
              <Badge className={priorityColors[ticket.priority]} variant="outline">
                {ticket.priority}
              </Badge>
            </div>
            <CardTitle className="text-base line-clamp-2">
              {ticket.shortDescription}
            </CardTitle>
          </div>
          <ComplianceBadge status={ticket.complianceStatus} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Assigned to: {ticket.assignedTo}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Scheduled: {formatDate(ticket.scheduledStartDate)}</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <Badge className={statusColors[ticket.status]} variant="outline">
              {ticket.status}
            </Badge>
            {failedRules > 0 && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {failedRules} issue{failedRules > 1 ? "s" : ""} to resolve
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
