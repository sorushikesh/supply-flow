import { useState } from "react";
import { PageBackground } from "@/components/PageBackground";
import { SearchFilter } from "@/components/SearchFilter";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge, type StatusType } from "@/components/StatusBadge";
import { FormModal } from "@/components/FormModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Trash2, Plus, ShoppingCart, FileText, DollarSign, Package, PackageX, History, Download, Filter } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { BulkActions } from "@/components/BulkActions";
import { ExportDialog } from "@/components/ExportDialog";
import { ActivityLogDialog, generateMockActivityLogs, type ActivityLog } from "@/components/ActivityLog";
import { AdvancedFilterDialog, applyAdvancedFilters, type FilterCondition, type SavedFilter } from "@/components/AdvancedFilter";
import { getPurchaseOrdersData, getVendorNames, getProductNames } from "@/data/dataTransformers";

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

const mockPurchaseOrders: PurchaseOrder[] = getPurchaseOrdersData();

// Vendor and product lists now imported from centralized data
const mockVendors = getVendorNames();
const mockProducts = getProductNames();

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
  
  // New features state
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [activityLogOpen, setActivityLogOpen] = useState(false);
  const [advancedFilterOpen, setAdvancedFilterOpen] = useState(false);
  const [activityLogs] = useState<ActivityLog[]>(generateMockActivityLogs());
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([]);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([
    {
      id: "1",
      name: "Pending Orders",
      conditions: [{ id: "1", field: "status", operator: "equals", value: "pending", fieldType: "select" }],
      isFavorite: true,
    },
    {
      id: "2",
      name: "High Value Orders",
      conditions: [{ id: "1", field: "totalAmount", operator: "greater", value: "20000", fieldType: "number" }],
    },
  ]);

  const filteredData = mockPurchaseOrders.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(search.toLowerCase()) ||
      po.vendor.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || po.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Apply advanced filters if any
  const finalData = filterConditions.length > 0 
    ? applyAdvancedFilters(filteredData, filterConditions)
    : filteredData;

  const columns: Column<PurchaseOrder>[] = [
    {
      key: "select",
      header: () => (
        <Checkbox
          checked={selectedItems.length === finalData.length && finalData.length > 0}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedItems(finalData.map((item) => item.id));
            } else {
              setSelectedItems([]);
            }
          }}
        />
      ),
      render: (po) => (
        <Checkbox
          checked={selectedItems.includes(po.id)}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedItems([...selectedItems, po.id]);
            } else {
              setSelectedItems(selectedItems.filter((id) => id !== po.id));
            }
          }}
        />
      ),
    },
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

  // Bulk operation handlers
  const handleBulkExport = () => {
    setExportDialogOpen(true);
  };

  const handleBulkEmail = () => {
    toast({
      title: "Email Sent",
      description: `Report for ${selectedItems.length} purchase orders has been sent to your email.`,
    });
  };

  const handleBulkStatusChange = (newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `${selectedItems.length} purchase orders have been updated to ${newStatus}.`,
    });
    setSelectedItems([]);
  };

  const handleBulkDelete = () => {
    toast({
      title: "Orders Deleted",
      description: `${selectedItems.length} purchase orders have been deleted successfully.`,
      variant: "destructive",
    });
    setSelectedItems([]);
  };

  const handleApplyFilters = (conditions: FilterCondition[]) => {
    setFilterConditions(conditions);
    toast({
      title: "Filters Applied",
      description: `Applied ${conditions.length} filter condition(s).`,
    });
  };

  const handleSaveFilter = (name: string, conditions: FilterCondition[]) => {
    const newFilter: SavedFilter = {
      id: String(Date.now()),
      name,
      conditions,
    };
    setSavedFilters([...savedFilters, newFilter]);
    toast({
      title: "Filter Saved",
      description: `Filter "${name}" has been saved successfully.`,
    });
  };

  const pendingOrders = mockPurchaseOrders.filter((po) => po.status === "pending").length;
  const totalValue = mockPurchaseOrders
    .filter((po) => po.status !== "cancelled")
    .reduce((sum, po) => sum + po.totalAmount, 0);

  const approvedOrders = mockPurchaseOrders.filter((po) => po.status === "approved").length;
  const completedOrders = mockPurchaseOrders.filter((po) => po.status === "completed").length;

  return (
    <PageBackground>
      <div className="relative z-10 p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Purchase Orders</h1>
          <p className="text-muted-foreground">Manage and track purchase orders from suppliers</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{mockPurchaseOrders.length}</p>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{pendingOrders}</p>
                <ShoppingCart className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{approvedOrders}</p>
                <Package className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{completedOrders}</p>
                <PackageX className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-green-600">${(totalValue / 1000).toFixed(1)}k</p>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <SearchFilter
                  searchValue={search}
                  onSearchChange={setSearch}
                  searchPlaceholder="Search by PO number or vendor..."
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setAdvancedFilterOpen(true)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced
                  {filterConditions.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {filterConditions.length}
                    </Badge>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setActivityLogOpen(true)}
                >
                  <History className="h-4 w-4 mr-2" />
                  Activity Log
                </Button>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={() => setModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create PO
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <BulkActions
            selectedCount={selectedItems.length}
            onExport={handleBulkExport}
            onEmail={handleBulkEmail}
            onStatusChange={handleBulkStatusChange}
            onDelete={handleBulkDelete}
            statusOptions={["Draft", "Sent", "Confirmed", "Received", "Cancelled"]}
          />
        )}

        {/* Data Table */}
        <Card>
          <CardContent className="pt-6">
            {filteredData.length === 0 ? (
            <EmptyState
              icon={PackageX}
              title={search || statusFilter !== "All" ? "No orders found" : "No purchase orders yet"}
              description={
                search || statusFilter !== "All"
                  ? "No purchase orders match your search criteria. Try adjusting your filters."
                  : "Create your first purchase order to start ordering from vendors."
              }
              action={{
                label: "Create Purchase Order",
                onClick: () => setModalOpen(true),
                icon: ShoppingCart,
              }}
            />
            ) : (
              <DataTable
                columns={columns}
                data={finalData}
                testIdPrefix="purchase-orders"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Create Purchase Order"
        description="Create a new purchase order for your vendor."
        onSubmit={handleSubmit}
        submitLabel="Create Purchase Order"
        maxWidth="xl"
      >
        <div className="space-y-6">
          {/* Order Information Section */}
          <div className="space-y-4">
            <div className="pb-3 border-b">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-primary" />
                Order Information
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Select vendor and expected delivery date</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-1">
                  Vendor <span className="text-destructive">*</span>
                </Label>
                <Select value={vendor} onValueChange={setVendor}>
                  <SelectTrigger data-testid="select-vendor" className="transition-all duration-200">
                    <SelectValue placeholder="Choose a vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockVendors.map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Select your supplier</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-1">
                  Expected Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="date"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  data-testid="input-expected-date"
                  className="transition-all duration-200"
                  min={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-muted-foreground">Expected delivery date</p>
              </div>
            </div>
          </div>

          {/* Line Items Section */}
          <div className="space-y-4">
            <div className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    Line Items
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">Add products to this purchase order</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLineItem}
                  data-testid="button-add-line-item"
                  className="gap-1.5 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </div>

            <div className="space-y-3 bg-muted/30 p-4 rounded-lg border">
              {lineItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end p-3 bg-background rounded-md border hover:border-primary/30 transition-all duration-200">
                  <div className="col-span-5">
                    {index === 0 && (
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Product</Label>
                    )}
                    <Select
                      value={item.product}
                      onValueChange={(v) => updateLineItem(item.id, "product", v)}
                    >
                      <SelectTrigger data-testid={`select-product-${index}`} className="h-9">
                        <SelectValue placeholder="Choose product" />
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
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Qty</Label>
                    )}
                    <Input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, "quantity", e.target.value)}
                      placeholder="0"
                      data-testid={`input-quantity-${index}`}
                      className="h-9"
                    />
                  </div>
                  <div className="col-span-3">
                    {index === 0 && (
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Unit Price</Label>
                    )}
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateLineItem(item.id, "unitPrice", e.target.value)}
                        placeholder="0.00"
                        data-testid={`input-unit-price-${index}`}
                        className="pl-6 h-9"
                      />
                    </div>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    {index === 0 && (
                      <div className="h-5 mb-1.5"></div>
                    )}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLineItem(item.id)}
                          disabled={lineItems.length === 1}
                          data-testid={`button-remove-item-${index}`}
                          className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove item</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-4 mt-2 border-t-2 border-primary/20">
                <div className="text-right bg-background p-4 rounded-lg border-2 border-primary/30 min-w-[200px]">
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Total Amount</p>
                  <p className="text-3xl font-bold font-mono text-primary mt-1">
                    ${calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormModal>

      {/* Export Dialog */}
      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        columns={[
          { key: "poNumber", label: "PO Number" },
          { key: "orderDate", label: "Order Date" },
          { key: "vendor", label: "Vendor" },
          { key: "items", label: "Items" },
          { key: "totalAmount", label: "Total Amount" },
          { key: "status", label: "Status" },
          { key: "expectedDate", label: "Expected Date" },
        ]}
        data={finalData.filter((item) => selectedItems.length === 0 || selectedItems.includes(item.id))}
        filename="purchase-orders"
      />

      {/* Activity Log Dialog */}
      <ActivityLogDialog
        open={activityLogOpen}
        onOpenChange={setActivityLogOpen}
        logs={activityLogs}
        title="Purchase Orders Activity Log"
      />

      {/* Advanced Filter Dialog */}
      <AdvancedFilterDialog
        open={advancedFilterOpen}
        onOpenChange={setAdvancedFilterOpen}
        fields={[
          { value: "poNumber", label: "PO Number", type: "text" },
          { value: "vendor", label: "Vendor", type: "text" },
          { value: "orderDate", label: "Order Date", type: "date" },
          { value: "totalAmount", label: "Total Amount", type: "number" },
          { value: "status", label: "Status", type: "select" },
        ]}
        onApplyFilters={handleApplyFilters}
        savedFilters={savedFilters}
        onSaveFilter={handleSaveFilter}
      />
    </PageBackground>
  );
}