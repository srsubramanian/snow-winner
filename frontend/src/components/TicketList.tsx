import { TicketCard } from "@/components/TicketCard";
import type { ChangeTicket } from "@/types/ticket";

interface TicketListProps {
  tickets: ChangeTicket[];
  onTicketClick: (ticket: ChangeTicket) => void;
  loading?: boolean;
}

export function TicketList({ tickets, onTicketClick, loading }: TicketListProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No tickets found</p>
        <p className="text-sm">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          onClick={() => onTicketClick(ticket)}
        />
      ))}
    </div>
  );
}
