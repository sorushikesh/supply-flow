import { PageHeader } from "../PageHeader";
import { FileText } from "lucide-react";

export default function PageHeaderExample() {
  return (
    <div className="p-4">
      <PageHeader
        title="Inventory Management"
        description="View and manage your product inventory"
        actionLabel="Add Product"
        actionIcon={FileText}
        onAction={() => console.log("Action clicked")}
      />
    </div>
  );
}
