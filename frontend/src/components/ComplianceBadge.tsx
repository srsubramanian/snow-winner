import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import type { ChangeTicket } from "@/types/ticket";

interface ComplianceBadgeProps {
  status: ChangeTicket["complianceStatus"];
  showLabel?: boolean;
}

export function ComplianceBadge({ status, showLabel = true }: ComplianceBadgeProps) {
  const config = {
    compliant: {
      variant: "success" as const,
      icon: CheckCircle,
      label: "Compliant",
    },
    warning: {
      variant: "warning" as const,
      icon: AlertTriangle,
      label: "Warning",
    },
    "non-compliant": {
      variant: "error" as const,
      icon: XCircle,
      label: "Non-Compliant",
    },
  };

  const { variant, icon: Icon, label } = config[status];

  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {showLabel && <span>{label}</span>}
    </Badge>
  );
}
