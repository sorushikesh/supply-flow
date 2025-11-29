import { StatsCard } from "../StatsCard";
import { Package, ShoppingCart, FileText, CreditCard } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <StatsCard
        title="Total Inventory Value"
        value="$284,520"
        change={12.5}
        changeLabel="vs last month"
        icon={Package}
      />
      <StatsCard
        title="Pending Orders"
        value="23"
        change={-8}
        changeLabel="vs last week"
        icon={ShoppingCart}
      />
      <StatsCard
        title="Open Invoices"
        value="$67,890"
        change={5.2}
        changeLabel="vs last month"
        icon={FileText}
      />
      <StatsCard
        title="Payments Received"
        value="$156,340"
        change={18.3}
        changeLabel="vs last month"
        icon={CreditCard}
      />
    </div>
  );
}
