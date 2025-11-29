import { DataTable, type Column } from "../DataTable";
import { StatusBadge, type StatusType } from "../StatusBadge";

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  amount: number;
  status: StatusType;
  date: string;
}

const mockData: Order[] = [
  { id: "1", orderNumber: "SO-2024-0001", customer: "Acme Corp", amount: 1250, status: "completed", date: "2024-01-15" },
  { id: "2", orderNumber: "SO-2024-0002", customer: "TechStart", amount: 3400, status: "pending", date: "2024-01-14" },
  { id: "3", orderNumber: "SO-2024-0003", customer: "Global Inc", amount: 890, status: "in_transit", date: "2024-01-13" },
  { id: "4", orderNumber: "SO-2024-0004", customer: "Metro Ltd", amount: 2100, status: "approved", date: "2024-01-12" },
];

const columns: Column<Order>[] = [
  { key: "orderNumber", header: "Order #", className: "font-mono" },
  { key: "customer", header: "Customer" },
  { key: "amount", header: "Amount", className: "text-right font-mono", render: (item) => `$${item.amount}` },
  { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
  { key: "date", header: "Date" },
];

export default function DataTableExample() {
  return (
    <div className="p-4">
      <DataTable
        columns={columns}
        data={mockData}
        selectable
        onRowClick={(item) => console.log("Clicked:", item)}
        testIdPrefix="example"
      />
    </div>
  );
}
