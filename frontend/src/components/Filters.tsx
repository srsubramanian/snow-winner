import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { TicketFilters } from "@/types/ticket";

interface FiltersProps {
  filters: TicketFilters;
  onFiltersChange: (filters: TicketFilters) => void;
  assignees: string[];
}

export function Filters({ filters, onFiltersChange, assignees }: FiltersProps) {
  const updateFilter = (key: keyof TicketFilters, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasFilters = Object.values(filters).some((v) => v !== undefined);

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Select
        value={filters.status ?? "all"}
        onValueChange={(v) => updateFilter("status", v === "all" ? undefined : v)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="Pending Approval">Pending Approval</SelectItem>
          <SelectItem value="In Review">In Review</SelectItem>
          <SelectItem value="Approved">Approved</SelectItem>
          <SelectItem value="Rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.priority ?? "all"}
        onValueChange={(v) => updateFilter("priority", v === "all" ? undefined : v)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="All Priorities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="Critical">Critical</SelectItem>
          <SelectItem value="High">High</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="Low">Low</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.compliance ?? "all"}
        onValueChange={(v) => updateFilter("compliance", v === "all" ? undefined : v)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Compliance" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Compliance</SelectItem>
          <SelectItem value="compliant">Compliant</SelectItem>
          <SelectItem value="warning">Warning</SelectItem>
          <SelectItem value="non-compliant">Non-Compliant</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.assignee ?? "all"}
        onValueChange={(v) => updateFilter("assignee", v === "all" ? undefined : v)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Assignees" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Assignees</SelectItem>
          {assignees.map((assignee) => (
            <SelectItem key={assignee} value={assignee}>
              {assignee}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.sortBy ?? "createdAt"}
        onValueChange={(v) => updateFilter("sortBy", v)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt">Date Created</SelectItem>
          <SelectItem value="priority">Priority</SelectItem>
          <SelectItem value="compliance">Compliance</SelectItem>
          <SelectItem value="scheduledStartDate">Scheduled Date</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.sortOrder ?? "desc"}
        onValueChange={(v) => updateFilter("sortOrder", v as "asc" | "desc")}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Sort Order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Descending</SelectItem>
          <SelectItem value="asc">Ascending</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
