import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ComplianceBadge } from "@/components/ComplianceBadge";
import { ValidationChecklist } from "@/components/ValidationChecklist";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  FileText,
  Users,
  RotateCcw,
} from "lucide-react";
import type { ChangeTicket } from "@/types/ticket";

interface TicketDetailProps {
  ticket: ChangeTicket;
  onBack: () => void;
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

export function TicketDetail({ ticket, onBack }: TicketDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-mono text-muted-foreground">
                      {ticket.number}
                    </span>
                    <Badge
                      className={priorityColors[ticket.priority]}
                      variant="outline"
                    >
                      {ticket.priority}
                    </Badge>
                    <Badge
                      className={statusColors[ticket.status]}
                      variant="outline"
                    >
                      {ticket.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">
                    {ticket.shortDescription}
                  </CardTitle>
                </div>
                <ComplianceBadge status={ticket.complianceStatus} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {ticket.description}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Requested By
                      </p>
                      <p className="font-medium">{ticket.requestedBy}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Assigned To
                      </p>
                      <p className="font-medium">{ticket.assignedTo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Scheduled Start
                      </p>
                      <p className="font-medium">
                        {formatDate(ticket.scheduledStartDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Scheduled End
                      </p>
                      <p className="font-medium">
                        {formatDate(ticket.scheduledEndDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <ValidationChecklist results={ticket.validationResults} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Approval Chain
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ticket.approvalChain && ticket.approvalChain.length > 0 ? (
                <ul className="space-y-2">
                  {ticket.approvalChain.map((approver, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      {approver}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No approvers assigned
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Change Window
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ticket.changeWindow ? (
                <p className="text-sm">{ticket.changeWindow}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No change window specified
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Testing Evidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ticket.testingEvidence ? (
                <p className="text-sm whitespace-pre-wrap">
                  {ticket.testingEvidence}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No testing evidence provided
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Rollback Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ticket.rollbackPlan ? (
                <p className="text-sm whitespace-pre-wrap">
                  {ticket.rollbackPlan}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No rollback plan documented
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
