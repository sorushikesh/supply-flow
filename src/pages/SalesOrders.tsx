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

interface SalesOrder {
  id: string;
  soNumber: string;
  customer: string;
  orderDate: string;
  deliveryDate: string;
  totalAmount: number;
  status: StatusType;
  items: number;
}

const mockSalesOrders: SalesOrder[] = [
  { id: "1", soNumber: "SO-2024-0123", customer: "TechStart Inc", orderDate: "2024-01-15", deliveryDate: "2024-01-20", totalAmount: 8750, status: "approved", items: 3 },
  { id: "2", soNumber: "SO-2024-0122", customer: "Metro Retail Group", orderDate: "2024-01-14", deliveryDate: "2024-01-19", totalAmount: 15600, status: "in_transit", items: 5 },
  { id: "3", soNumber: "SO-2024-0121", customer: "City Stores Ltd", orderDate: "2024-01-13", deliveryDate: "2024-01-18", totalAmount: 4800, status: "delivered", items: 2 },
  { id: "4", soNumber: "SO-2024-0120", customer: "Express Outlets", orderDate: "2024-01-12", deliveryDate: "2024-01-17", totalAmount: 23400, status: "completed", items: 8 },
  { id: "5", soNumber: "SO-2024-0119", customer: "Wholesale Partners", orderDate: "2024-01-11", deliveryDate: "2024-01-16", totalAmount: 34500, status: "completed", items: 12 },
  { id: "6", soNumber: "SO-2024-0118", customer: "TechStart Inc", orderDate: "2024-01-10", deliveryDate: "2024-01-15", totalAmount: 12300, status: "pending", items: 4 },
  { id: "7", soNumber: "SO-2024-0117", customer: "Prime Electronics", orderDate: "2024-01-09", deliveryDate: "2024-01-14", totalAmount: 19800, status: "approved", items: 6 },
  { id: "8", soNumber: "SO-2024-0116", customer: "Global Trade Corp", orderDate: "2024-01-08", deliveryDate: "2024-01-13", totalAmount: 28900, status: "in_transit", items: 9 },
  { id: "9", soNumber: "SO-2024-0115", customer: "Downtown Supermarket", orderDate: "2024-01-07", deliveryDate: "2024-01-12", totalAmount: 6700, status: "delivered", items: 3 },
  { id: "10", soNumber: "SO-2024-0114", customer: "Coastal Distributors", orderDate: "2024-01-06", deliveryDate: "2024-01-11", totalAmount: 14500, status: "completed", items: 5 },
  { id: "11", soNumber: "SO-2024-0113", customer: "Mountain Retail Chain", orderDate: "2024-01-05", deliveryDate: "2024-01-10", totalAmount: 31200, status: "completed", items: 11 },
  { id: "12", soNumber: "SO-2024-0112", customer: "Urban Solutions LLC", orderDate: "2024-01-04", deliveryDate: "2024-01-09", totalAmount: 9600, status: "pending", items: 4 },
  { id: "13", soNumber: "SO-2024-0111", customer: "Northern Supplies", orderDate: "2024-01-03", deliveryDate: "2024-01-08", totalAmount: 17300, status: "approved", items: 7 },
  { id: "14", soNumber: "SO-2024-0110", customer: "Eastern Markets", orderDate: "2024-01-02", deliveryDate: "2024-01-07", totalAmount: 22100, status: "in_transit", items: 8 },
  { id: "15", soNumber: "SO-2024-0109", customer: "Central Warehouse Hub", orderDate: "2024-01-01", deliveryDate: "2024-01-06", totalAmount: 38700, status: "delivered", items: 13 },
  { id: "16", soNumber: "SO-2024-0108", customer: "Pacific Retailers", orderDate: "2023-12-31", deliveryDate: "2024-01-05", totalAmount: 26500, status: "completed", items: 10 },
  { id: "17", soNumber: "SO-2024-0107", customer: "TechStart Inc", orderDate: "2023-12-30", deliveryDate: "2024-01-04", totalAmount: 11400, status: "completed", items: 5 },
  { id: "18", soNumber: "SO-2024-0106", customer: "Metro Retail Group", orderDate: "2023-12-29", deliveryDate: "2024-01-03", totalAmount: 18900, status: "pending", items: 6 },
  { id: "19", soNumber: "SO-2024-0105", customer: "Express Outlets", orderDate: "2023-12-28", deliveryDate: "2024-01-02", totalAmount: 29300, status: "approved", items: 9 },
  { id: "20", soNumber: "SO-2024-0104", customer: "Wholesale Partners", orderDate: "2023-12-27", deliveryDate: "2024-01-01", totalAmount: 41800, status: "completed", items: 14 },
];

const mockCustomers = ["TechStart Inc", "Metro Retail Group", "City Stores Ltd", "Express Outlets", "Wholesale Partners"];
const mockProducts = ["Widget Alpha", "Widget Beta", "Gadget Pro", "Component X", "Component Y"];

interface LineItem {
  id: string;
  product: string;
  quantity: string;
  unitPrice: string;
}

export default function SalesOrders() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [customer, setCustomer] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", product: "", quantity: "", unitPrice: "" },
  ]);

  const filteredData = mockSalesOrders.filter((so) => {
    const matchesSearch =
      so.soNumber.toLowerCase().includes(search.toLowerCase()) ||
      so.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || so.status === statusFilter.toLowerCase().replace(" ", "_");
    return matchesSearch && matchesStatus;
  });

  const columns: Column<SalesOrder>[] = [
    { 
      key: "soNumber", 
      header: "SO Number", 
      className: "font-mono text-sm font-medium",
      render: (so) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help">{so.soNumber}</span>
          </TooltipTrigger>
          <TooltipContent side="top">
            <div className="space-y-1">
              <p className="text-xs font-semibold">{so.soNumber}</p>
              <p className="text-xs text-muted-foreground">Order Date: {so.orderDate}</p>
              <p className="text-xs text-muted-foreground">Items: {so.items}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      ),
    },
    { key: "customer", header: "Customer" },
    { key: "orderDate", header: "Order Date" },
    { key: "deliveryDate", header: "Delivery Date" },
    { key: "items", header: "Items", className: "text-center" },
    {
      key: "totalAmount",
      header: "Total",
      className: "text-right font-mono",
      render: (so) => `$${so.totalAmount.toLocaleString()}`,
    },
    {
      key: "status",
      header: "Status",
      render: (so) => <StatusBadge status={so.status} />,
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
      title: "Sales Order Created",
      description: `SO has been created for ${customer}.`,
    });
    setModalOpen(false);
    setCustomer("");
    setDeliveryDate("");
    setLineItems([{ id: "1", product: "", quantity: "", unitPrice: "" }]);
  };

  const pendingOrders = mockSalesOrders.filter((so) => so.status === "pending" || so.status === "approved").length;
  const totalRevenue = mockSalesOrders
    .filter((so) => so.status === "completed" || so.status === "delivered")
    .reduce((sum, so) => sum + so.totalAmount, 0);

  return (
    <PageBackground>
      <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Sales Orders
            </h1>
            <p className="text-muted-foreground mt-1">Manage orders from your customers</p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            New Sales Order
          </Button>
        </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Total SOs
            </p>
            <p className="text-2xl font-bold mt-1">{mockSalesOrders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Pending Fulfillment
            </p>
            <p className="text-2xl font-bold mt-1 text-amber-600">
              {pendingOrders}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Completed Revenue
            </p>
            <p className="text-2xl font-bold mt-1 font-mono">
              ${totalRevenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="space-y-4">
            <SearchFilter
              searchPlaceholder="Search by SO number or customer..."
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
                    { value: "In Transit", label: "In Transit" },
                    { value: "Delivered", label: "Delivered" },
                    { value: "Completed", label: "Completed" },
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
            testIdPrefix="sales-orders"
          />
        </CardContent>
      </Card>
      </div>

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Create Sales Order"
        description="Select a customer and add line items."
        onSubmit={handleSubmit}
        submitLabel="Create SO"
      >
        {/* Order Information Section */}
        <div className="space-y-4">
          <div className="pb-2 border-b">
            <h3 className="text-sm font-semibold text-foreground">Order Information</h3>
            <p className="text-xs text-muted-foreground mt-1">Basic order details</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1">
                Customer <span className="text-destructive">*</span>
              </Label>
              <Select value={customer} onValueChange={setCustomer}>
                <SelectTrigger data-testid="select-customer">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {mockCustomers.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Select customer for this order</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1">
                Delivery Date <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                data-testid="input-delivery-date"
                className="transition-all duration-200"
              />
              <p className="text-xs text-muted-foreground">Expected delivery date</p>
            </div>
          </div>
        </div>

        {/* Line Items Section */}
        <div className="space-y-4 pt-4">
          <div className="pb-2 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Line Items</h3>
                <p className="text-xs text-muted-foreground mt-1">Products and quantities</p>
              </div>
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
          </div>

          <div className="space-y-3">

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