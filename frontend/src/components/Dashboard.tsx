import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filters } from "@/components/Filters";
import { TicketList } from "@/components/TicketList";
import { TicketDetail } from "@/components/TicketDetail";
import { useTickets, useStats } from "@/hooks/useTickets";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import type { ChangeTicket, TicketFilters } from "@/types/ticket";

export function Dashboard() {
  const [filters, setFilters] = useState<TicketFilters>({});
  const [selectedTicket, setSelectedTicket] = useState<ChangeTicket | null>(
    null
  );

  const { data: ticketData, loading: ticketsLoading, error: ticketsError } = useTickets(filters);
  const { data: stats, loading: statsLoading } = useStats();

  const assignees = useMemo(() => {
    if (!stats?.byAssignee) return [];
    return Object.keys(stats.byAssignee).sort();
  }, [stats]);

  if (selectedTicket) {
    return (
      <TicketDetail
        ticket={selectedTicket}
        onBack={() => setSelectedTicket(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Change Ticket Compliance Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Review ServiceNow change tickets pending approval and their compliance status
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "-" : stats?.totalTickets ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "-" : stats?.pendingApproval ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliant</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statsLoading ? "-" : stats?.compliant ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {statsLoading ? "-" : stats?.warning ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non-Compliant</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statsLoading ? "-" : stats?.nonCompliant ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <Filters
            filters={filters}
            onFiltersChange={setFilters}
            assignees={assignees}
          />
        </CardContent>
      </Card>

      {ticketsError ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Error loading tickets: {ticketsError}</p>
            <p className="text-sm text-red-500 mt-1">
              Make sure the backend server is running on http://localhost:8000
            </p>
          </CardContent>
        </Card>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {ticketsLoading
                ? "Loading..."
                : `${ticketData?.total ?? 0} Tickets`}
            </h2>
          </div>
          <TicketList
            tickets={ticketData?.tickets ?? []}
            onTicketClick={setSelectedTicket}
            loading={ticketsLoading}
          />
        </div>
      )}
    </div>
  );
}
