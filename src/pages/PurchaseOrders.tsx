import { useState } from "react";
import { PageBackground } from "@/components/PageBackground";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, ShoppingCart, FileText, DollarSign } from "lucide-react";

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
  { id: "7", poNumber: "PO-2024-0039", vendor: "Supreme Electronics", orderDate: "2024-01-09", expectedDate: "2024-01-19", totalAmount: 18900, status: "pending", items: 7 },
  { id: "8", poNumber: "PO-2024-0038", vendor: "Mega Manufacturing", orderDate: "2024-01-08", expectedDate: "2024-01-18", totalAmount: 29400, status: "approved", items: 9 },
  { id: "9", poNumber: "PO-2024-0037", vendor: "Alpha Distributors", orderDate: "2024-01-07", expectedDate: "2024-01-17", totalAmount: 11200, status: "completed", items: 4 },
  { id: "10", poNumber: "PO-2024-0036", vendor: "Beta Supplies Ltd", orderDate: "2024-01-06", expectedDate: "2024-01-16", totalAmount: 16700, status: "completed", items: 6 },
  { id: "11", poNumber: "PO-2024-0035", vendor: "Gamma Industries", orderDate: "2024-01-05", expectedDate: "2024-01-15", totalAmount: 24300, status: "pending", items: 8 },
  { id: "12", poNumber: "PO-2024-0034", vendor: "Epsilon Materials", orderDate: "2024-01-04", expectedDate: "2024-01-14", totalAmount: 31800, status: "approved", items: 11 },
  { id: "13", poNumber: "PO-2024-0033", vendor: "Zeta Trading Co", orderDate: "2024-01-03", expectedDate: "2024-01-13", totalAmount: 9600, status: "completed", items: 5 },
  { id: "14", poNumber: "PO-2024-0032", vendor: "Theta Wholesale", orderDate: "2024-01-02", expectedDate: "2024-01-12", totalAmount: 19200, status: "completed", items: 7 },
  { id: "15", poNumber: "PO-2024-0031", vendor: "Omega Solutions", orderDate: "2024-01-01", expectedDate: "2024-01-11", totalAmount: 35600, status: "pending", items: 12 },
  { id: "16", poNumber: "PO-2024-0030", vendor: "Acme Corporation", orderDate: "2023-12-31", expectedDate: "2024-01-10", totalAmount: 14800, status: "approved", items: 6 },
  { id: "17", poNumber: "PO-2024-0029", vendor: "Global Supply Co", orderDate: "2023-12-30", expectedDate: "2024-01-09", totalAmount: 21400, status: "completed", items: 8 },
  { id: "18", poNumber: "PO-2024-0028", vendor: "Quality Parts Inc", orderDate: "2023-12-29", expectedDate: "2024-01-08", totalAmount: 7900, status: "completed", items: 4 },
  { id: "19", poNumber: "PO-2024-0027", vendor: "Tech Components", orderDate: "2023-12-28", expectedDate: "2024-01-07", totalAmount: 28500, status: "cancelled", items: 10 },
  { id: "20", poNumber: "PO-2024-0026", vendor: "Supreme Electronics", orderDate: "2023-12-27", expectedDate: "2024-01-06", totalAmount: 33700, status: "completed", items: 13 },
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
    { 
      key: "poNumber", 
      header: "PO Number", 
      className: "font-mono text-sm font-medium",
      render: (po) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help">{po.poNumber}</span>
          </TooltipTrigger>
          <TooltipContent side="top">
            <div className="space-y-1">
              <p className="text-xs font-semibold">{po.poNumber}</p>
              <p className="text-xs text-muted-foreground">Order Date: {po.orderDate}</p>
              <p className="text-xs text-muted-foreground">Items: {po.items}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      ),
    },
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
    <PageBackground>
      <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Purchase Orders
            </h1>
            <p className="text-muted-foreground mt-1">Manage orders to suppliers</p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            New Purchase Order
          </Button>
        </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Total POs</p>
            <p className="text-2xl font-bold mt-1">{mockPurchaseOrders.length}</p>
          </CardContent>
        </Card>
        <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Pending Approval</p>
            <p className="text-2xl font-bold mt-1 text-amber-600">{pendingOrders}</p>
          </CardContent>
        </Card>
        <Card className="border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Total Value</p>
            <p className="text-2xl font-bold mt-1 font-mono">${totalValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="space-y-4">
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
          </div>

          <DataTable
            columns={columns}
            data={filteredData}
            testIdPrefix="purchase-orders"
          />
        </CardContent>
      </Card>
      </div>

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
    </PageBackground>
  );
}