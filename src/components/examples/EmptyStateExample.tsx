import { EmptyState } from "../EmptyState";
import { Package } from "lucide-react";

export default function EmptyStateExample() {
  return (
    <div className="p-4">
      <EmptyState
        icon={Package}
        title="No products found"
        description="Get started by adding your first product to the inventory."
        actionLabel="Add Product"
        onAction={() => console.log("Add product clicked")}
      />
    </div>
  );
}
