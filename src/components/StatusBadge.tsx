import { Badge } from "@/components/ui/badge";

export type StatusType =
  | "pending"
  | "approved"
  | "rejected"
  | "completed"
  | "paid"
  | "overdue"
  | "partial"
  | "in_transit"
  | "delivered"
  | "draft"
  | "cancelled"
  | "processing"
  | "pending_approval"
  | "changes_requested";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "secondary" },
  approved: { label: "Approved", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
  completed: { label: "Completed", variant: "default" },
  paid: { label: "Paid", variant: "default" },
  overdue: { label: "Overdue", variant: "destructive" },
  partial: { label: "Partial", variant: "secondary" },
  in_transit: { label: "In Transit", variant: "secondary" },
  delivered: { label: "Delivered", variant: "default" },
  draft: { label: "Draft", variant: "outline" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  processing: { label: "Processing", variant: "secondary" },
  pending_approval: { label: "Pending Approval", variant: "secondary" },
  changes_requested: { label: "Changes Requested", variant: "outline" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  // Fallback for undefined status
  if (!config) {
    console.error(`StatusBadge: Unknown status "${status}"`);
    return (
      <Badge 
        variant="outline" 
        className={`transition-all duration-200 hover:scale-105 hover:shadow-sm cursor-default animate-fade-in ${className || ''}`}
        data-testid={`status-badge-${status}`}
      >
        {status}
      </Badge>
    );
  }
  
  return (
    <Badge 
      variant={config.variant} 
      className={`transition-all duration-200 hover:scale-105 hover:shadow-sm cursor-default animate-fade-in ${className || ''}`}
      data-testid={`status-badge-${status}`}
    >
      {config.label}
    </Badge>
  );
}
