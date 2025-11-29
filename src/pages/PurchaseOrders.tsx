import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SearchFilter } from "@/components/SearchFilter";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge, type StatusType } from "@/components/StatusBadge";
import { FormModal } from "@/components/FormModal";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";

// todo: remove mock functionality
interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: string;
  orderDate: string;
  expectedDate: string;
  totalAmount: number;
  status: StatusType;
  items: number;
}

const mockPurchaseOrders: PurchaseOrder[] = [
  { id: "1", poNumber: "PO-2024-0045", vendor: "Acme Corporation", orderDate: "2024-01-15", expectedDate: "2024-01-25", totalAmount: 12500, status: "pending", items: 5 },
  { id: "2", poNumber: "PO-2024-0044", vendor: "Global Supply Co", orderDate: "2024-01-14", expectedDate: "2024-01-24", totalAmount: 8750, status: "approved", items: 3 },
  { id: "3", poNumber: "PO-2024-0043", vendor: "Quality Parts Inc", orderDate: "2024-01-13", expectedDate: "2024-01-23", totalAmount: 3200, status: "completed", items: 8 },
  { id: "4", poNumber: "PO-2024-0042", vendor: "Tech Components", orderDate: "2024-01-12", expectedDate: "2024-01-22", totalAmount: 15600, status: "completed", items: 4 },
  { id: "5", poNumber: "PO-2024-0041", vendor: "Prime Materials Ltd", orderDate: "2024-01-11", expectedDate: "2024-01-21", totalAmount: 4800, status: "cancelled", items: 2 },
  { id: "6", poNumber: "PO-2024-0040", vendor: "Acme Corporation", orderDate: "2024-01-10", expectedDate: "2024-01-20", totalAmount: 22300, status: "completed", items: 6 },
];

const mockVendors = ["Acme Corporation", "Global Supply Co", "Quality Parts Inc", "Tech Components", "Prime Materials Ltd"];
const mockProducts = ["Widget Alpha", "Widget Beta", "Gadget Pro", "Component X", "Component Y"];

interface LineItem {
  id: string;
  product: string;
  quantity: string;
  unitPrice: string;
}

export default function PurchaseOrders() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [vendor, setVendor] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", product: "", quantity: "", unitPrice: "" },
  ]);

  const filteredData = mockPurchaseOrders.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(search.toLowerCase()) ||
      po.vendor.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || po.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const columns: Column<PurchaseOrder>[] = [
    { key: "poNumber", header: "PO Number", className: "font-mono text-sm font-medium" },
    { key: "vendor", header: "Vendor" },
    { key: "orderDate", header: "Order Date" },
    { key: "expectedDate", header: "Expected Date" },
    { key: "items", header: "Items", className: "text-center" },
    {
      key: "totalAmount",
      header: "Total",
      className: "text-right font-mono",
      render: (po) => `$${po.totalAmount.toLocaleString()}`,
    },
    {
      key: "status",
      header: "Status",
      render: (po) => <StatusBadge status={po.status} />,
    },
  ];

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: String(Date.now()), product: "", quantity: "", unitPrice: "" },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      return sum + qty * price;
    }, 0);
  };

  const handleSubmit = () => {
    toast({
      title: "Purchase Order Created",
      description: `PO has been created for ${vendor}.`,
    });
    setModalOpen(false);
    setVendor("");
    setExpectedDate("");
    setLineItems([{ id: "1", product: "", quantity: "", unitPrice: "" }]);
  };

  const pendingOrders = mockPurchaseOrders.filter((po) => po.status === "pending").length;
  const totalValue = mockPurchaseOrders
    .filter((po) => po.status !== "cancelled")
    .reduce((sum, po) => sum + po.totalAmount, 0);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Purchase Orders"
        description="Manage orders to your vendors"
        actionLabel="New Purchase Order"
        onAction={() => setModalOpen(true)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Total POs
            </p>
            <p className="text-2xl font-bold mt-1">{mockPurchaseOrders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Pending Approval
            </p>
            <p className="text-2xl font-bold mt-1 text-amber-600">
              {pendingOrders}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Total Value
            </p>
            <p className="text-2xl font-bold mt-1 font-mono">
              ${totalValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <SearchFilter
            searchPlaceholder="Search by PO number or vendor..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={[
              {
                key: "status",
                label: "Status",
                options: [
                  { value: "All", label: "All Status" },
                  { value: "Pending", label: "Pending" },
                  { value: "Approved", label: "Approved" },
                  { value: "Completed", label: "Completed" },
                  { value: "Cancelled", label: "Cancelled" },
                ],
                value: statusFilter,
                onChange: setStatusFilter,
              },
            ]}
          />

          <DataTable
            columns={columns}
            data={filteredData}
            testIdPrefix="purchase-orders"
          />
        </CardContent>
      </Card>

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Create Purchase Order"
        description="Select a vendor and add line items."
        onSubmit={handleSubmit}
        submitLabel="Create PO"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Vendor *</Label>
              <Select value={vendor} onValueChange={setVendor}>
                <SelectTrigger data-testid="select-vendor">
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {mockVendors.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Expected Date *</Label>
              <Input
                type="date"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                data-testid="input-expected-date"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Line Items</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLineItem}
                data-testid="button-add-line-item"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>

            {lineItems.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5">
                  {index === 0 && (
                    <Label className="text-xs text-muted-foreground">Product</Label>
                  )}
                  <Select
                    value={item.product}
                    onValueChange={(v) => updateLineItem(item.id, "product", v)}
                  >
                    <SelectTrigger data-testid={`select-product-${index}`}>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProducts.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  {index === 0 && (
                    <Label className="text-xs text-muted-foreground">Qty</Label>
                  )}
                  <Input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, "quantity", e.target.value)}
                    placeholder="0"
                    data-testid={`input-quantity-${index}`}
                  />
                </div>
                <div className="col-span-3">
                  {index === 0 && (
                    <Label className="text-xs text-muted-foreground">Unit Price</Label>
                  )}
                  <Input
                    type="number"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(item.id, "unitPrice", e.target.value)}
                    placeholder="0.00"
                    data-testid={`input-unit-price-${index}`}
                  />
                </div>
                <div className="col-span-2 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLineItem(item.id)}
                    disabled={lineItems.length === 1}
                    data-testid={`button-remove-item-${index}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-4 border-t">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-xl font-bold font-mono">
                  ${calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
