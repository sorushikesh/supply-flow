import { StatusBadge } from "../StatusBadge";

export default function StatusBadgeExample() {
  const statuses = [
    "pending",
    "approved",
    "rejected",
    "completed",
    "paid",
    "overdue",
    "partial",
    "in_transit",
    "delivered",
    "draft",
    "cancelled",
    "processing",
  ] as const;

  return (
    <div className="flex flex-wrap gap-2 p-4">
      {statuses.map((status) => (
        <StatusBadge key={status} status={status} />
      ))}
    </div>
  );
}
