import { useState } from "react";
import { PageBackground } from "@/components/PageBackground";
import { SearchFilter } from "@/components/SearchFilter";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge, type StatusType } from "@/components/StatusBadge";
import { FormModal } from "@/components/FormModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, CheckCircle2, AlertTriangle, PackageX, History, Download, Filter, DollarSign, Plus } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { BulkActions } from "@/components/BulkActions";
import { ExportDialog } from "@/components/ExportDialog";
import { ActivityLogDialog, generateMockActivityLogs, type ActivityLog } from "@/components/ActivityLog";
import { AdvancedFilterDialog, applyAdvancedFilters, type FilterCondition, type SavedFilter } from "@/components/AdvancedFilter";

interface GRNRecord {
  id: string;
  grnNumber: string;
  poNumber: string;
  vendor: string;
  receivedDate: string;
  orderedQty: number;
  receivedQty: number;
  status: StatusType;
}

const mockGRNs: GRNRecord[] = [
  { id: "1", grnNumber: "GRN-2024-0030", poNumber: "PO-2024-0044", vendor: "Global Supply Co", receivedDate: "2024-01-15", orderedQty: 100, receivedQty: 100, status: "completed" },
  { id: "2", grnNumber: "GRN-2024-0029", poNumber: "PO-2024-0043", vendor: "Quality Parts Inc", receivedDate: "2024-01-14", orderedQty: 250, receivedQty: 245, status: "partial" },
  { id: "3", grnNumber: "GRN-2024-0028", poNumber: "PO-2024-0042", vendor: "Tech Components", receivedDate: "2024-01-13", orderedQty: 50, receivedQty: 50, status: "completed" },
  { id: "4", grnNumber: "GRN-2024-0027", poNumber: "PO-2024-0040", vendor: "Acme Corporation", receivedDate: "2024-01-12", orderedQty: 200, receivedQty: 200, status: "completed" },
  { id: "5", grnNumber: "GRN-2024-0026", poNumber: "PO-2024-0039", vendor: "Prime Materials Ltd", receivedDate: "2024-01-11", orderedQty: 75, receivedQty: 70, status: "partial" },
  { id: "6", grnNumber: "GRN-2024-0025", poNumber: "PO-2024-0038", vendor: "Mega Manufacturing", receivedDate: "2024-01-10", orderedQty: 180, receivedQty: 180, status: "completed" },
  { id: "7", grnNumber: "GRN-2024-0024", poNumber: "PO-2024-0037", vendor: "Alpha Distributors", receivedDate: "2024-01-09", orderedQty: 120, receivedQty: 115, status: "partial" },
  { id: "8", grnNumber: "GRN-2024-0023", poNumber: "PO-2024-0036", vendor: "Beta Supplies Ltd", receivedDate: "2024-01-08", orderedQty: 95, receivedQty: 95, status: "completed" },
  { id: "9", grnNumber: "GRN-2024-0022", poNumber: "PO-2024-0035", vendor: "Gamma Industries", receivedDate: "2024-01-07", orderedQty: 150, receivedQty: 150, status: "completed" },
  { id: "10", grnNumber: "GRN-2024-0021", poNumber: "PO-2024-0034", vendor: "Epsilon Materials", receivedDate: "2024-01-06", orderedQty: 220, receivedQty: 210, status: "partial" },
  { id: "11", grnNumber: "GRN-2024-0020", poNumber: "PO-2024-0033", vendor: "Zeta Trading Co", receivedDate: "2024-01-05", orderedQty: 65, receivedQty: 65, status: "completed" },
  { id: "12", grnNumber: "GRN-2024-0019", poNumber: "PO-2024-0032", vendor: "Theta Wholesale", receivedDate: "2024-01-04", orderedQty: 135, receivedQty: 135, status: "completed" },
  { id: "13", grnNumber: "GRN-2024-0018", poNumber: "PO-2024-0031", vendor: "Omega Solutions", receivedDate: "2024-01-03", orderedQty: 280, receivedQty: 270, status: "partial" },
  { id: "14", grnNumber: "GRN-2024-0017", poNumber: "PO-2024-0030", vendor: "Acme Corporation", receivedDate: "2024-01-02", orderedQty: 110, receivedQty: 110, status: "completed" },
  { id: "15", grnNumber: "GRN-2024-0016", poNumber: "PO-2024-0029", vendor: "Global Supply Co", receivedDate: "2024-01-01", orderedQty: 160, receivedQty: 160, status: "completed" },
];

const mockPendingPOs = [
  { poNumber: "PO-2024-0045", vendor: "Acme Corporation", items: "Widget Alpha x 50, Widget Beta x 30" },
  { poNumber: "PO-2024-0046", vendor: "Global Supply Co", items: "Gadget Pro x 25" },
];

export default function GRN() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState("");
  const [receivedQty, setReceivedQty] = useState("");
  const [notes, setNotes] = useState("");
  
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
      name: "Partial Receipts",
      conditions: [{ id: "1", field: "status", operator: "equals", value: "partial", fieldType: "select" }],
      isFavorite: true,
    },
    {
      id: "2",
      name: "Recent GRNs",
      conditions: [{ id: "1", field: "receivedDate", operator: "greater", value: "2024-01-10", fieldType: "date" }],
    },
  ]);

  const filteredData = mockGRNs.filter((grn) => {
    const matchesSearch =
      grn.grnNumber.toLowerCase().includes(search.toLowerCase()) ||
      grn.poNumber.toLowerCase().includes(search.toLowerCase()) ||
      grn.vendor.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || grn.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Apply advanced filters if any
  const finalData = filterConditions.length > 0 
    ? applyAdvancedFilters(filteredData, filterConditions)
    : filteredData;

  const columns: Column<GRNRecord>[] = [
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
      render: (grn) => (
        <Checkbox
          checked={selectedItems.includes(grn.id)}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedItems([...selectedItems, grn.id]);
            } else {
              setSelectedItems(selectedItems.filter((id) => id !== grn.id));
            }
          }}
        />
      ),
    },
    { 
      key: "grnNumber", 
      header: "GRN Number", 
      className: "font-mono text-sm font-medium",
      render: (grn) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help">{grn.grnNumber}</span>
          </TooltipTrigger>
          <TooltipContent side="top">
            <div className="space-y-1">
              <p className="text-xs font-semibold">{grn.grnNumber}</p>
              <p className="text-xs text-muted-foreground">PO: {grn.poNumber}</p>
              <p className="text-xs text-muted-foreground">Vendor: {grn.vendor}</p>
              <p className="text-xs text-muted-foreground">Received: {grn.receivedDate}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      ),
    },
    { key: "poNumber", header: "PO Number", className: "font-mono text-sm" },
    { key: "vendor", header: "Vendor" },
    { key: "receivedDate", header: "Received Date" },
    {
      key: "orderedQty",
      header: "Ordered",
      className: "text-right font-mono",
    },
    {
      key: "receivedQty",
      header: "Received",
      className: "text-right font-mono",
      render: (grn) => (
        <span className={grn.receivedQty < grn.orderedQty ? "text-amber-600" : ""}>
          {grn.receivedQty}
        </span>
      ),
    },
    {
      key: "variance",
      header: "Variance",
      className: "text-right font-mono",
      render: (grn) => {
        const variance = grn.receivedQty - grn.orderedQty;
        return (
          <span className={variance < 0 ? "text-destructive" : "text-muted-foreground"}>
            {variance >= 0 ? "+" : ""}{variance}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (grn) => <StatusBadge status={grn.status} />,
    },
  ];

  const handleSubmit = () => {
    toast({
      title: "GRN Created",
      description: `Goods received for ${selectedPO}.`,
    });
    setModalOpen(false);
    setSelectedPO("");
    setReceivedQty("");
    setNotes("");
  };

  // Bulk operation handlers
  const handleBulkExport = () => {
    setExportDialogOpen(true);
  };

  const handleBulkEmail = () => {
    toast({
      title: "Email Sent",
      description: `Report for ${selectedItems.length} GRN records has been sent to your email.`,
    });
  };

  const handleBulkStatusChange = (newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `${selectedItems.length} GRN records have been updated to ${newStatus}.`,
    });
    setSelectedItems([]);
  };

  const handleBulkDelete = () => {
    toast({
      title: "GRN Records Deleted",
      description: `${selectedItems.length} GRN records have been deleted successfully.`,
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

  const completedGRNs = mockGRNs.filter((grn) => grn.status === "completed").length;
  const partialGRNs = mockGRNs.filter((grn) => grn.status === "partial").length;
  const pendingGRNs = mockGRNs.filter((grn) => grn.status === "pending").length;
  const totalReceivedValue = mockGRNs
    .filter((grn) => grn.status === "completed")
    .reduce((sum, grn) => sum + (grn.receivedQty * 100), 0); // Approximate value

  return (
    <PageBackground>
      <div className="relative z-10 p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Goods Receipt Notes</h1>
          <p className="text-muted-foreground">Track and manage incoming inventory receipts</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total GRNs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{mockGRNs.length}</p>
                <Package className="h-8 w-8 text-blue-500" />
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
                <p className="text-2xl font-bold">{pendingGRNs}</p>
                <Package className="h-8 w-8 text-yellow-500" />
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
                <p className="text-2xl font-bold">{completedGRNs}</p>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Partial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{partialGRNs}</p>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
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
                <p className="text-2xl font-bold text-green-600">${(totalReceivedValue / 1000).toFixed(1)}k</p>
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
                  searchPlaceholder="Search by GRN, PO number or vendor..."
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
                    <SelectItem value="Completed">Complete</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
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
                  Create GRN
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
            statusOptions={["Pending", "Received", "Partial", "Completed"]}
          />
        )}

        {/* Data Table */}
        <Card>
          <CardContent className="pt-6">
            {filteredData.length === 0 ? (
            <EmptyState
              icon={PackageX}
              title={search || statusFilter !== "All" ? "No GRN records found" : "No goods receipts yet"}
              description={
                search || statusFilter !== "All"
                  ? "No goods receipt notes match your search criteria. Try adjusting your filters."
                  : "Record your first goods receipt to track incoming inventory."
              }
              action={{
                label: "Record GRN",
                onClick: () => setModalOpen(true),
                icon: Package,
              }}
            />
            ) : (
              <DataTable
                columns={columns}
                data={finalData}
                testIdPrefix="grn"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Record Goods Received"
        description="Document the receipt of goods from a purchase order."
        onSubmit={handleSubmit}
        submitLabel="Create GRN"
        maxWidth="lg"
      >
        <div className="space-y-4">
          {/* Purchase Order Section */}
          <div className="space-y-3">
            <div className="pb-2 border-b">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Purchase Order Selection
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Select the PO you're receiving goods for</p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1">
                Purchase Order <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedPO} onValueChange={setSelectedPO}>
                <SelectTrigger data-testid="select-po" className="transition-all duration-200">
                  <SelectValue placeholder="Choose a pending purchase order" />
                </SelectTrigger>
                <SelectContent>
                  {mockPendingPOs.map((po) => (
                    <SelectItem key={po.poNumber} value={po.poNumber}>
                      <div className="flex flex-col py-1">
                        <span className="font-mono font-medium">{po.poNumber}</span>
                        <span className="text-xs text-muted-foreground">{po.vendor}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Select from pending purchase orders</p>
            </div>
          </div>

          {/* PO Details Display */}
          {selectedPO && (
            <div className="p-4 rounded-lg border-2 border-primary/20 bg-muted/30 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Purchase Order Details</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Vendor</span>
                  <span className="font-medium">{mockPendingPOs.find((p) => p.poNumber === selectedPO)?.vendor}</span>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium text-right max-w-[60%]">{mockPendingPOs.find((p) => p.poNumber === selectedPO)?.items}</span>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">Awaiting Receipt</Badge>
            </div>
          )}

          {/* Receipt Information */}
          <div className="space-y-3 pt-2">
            <div className="pb-2 border-b">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Receipt Information
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Record what you received</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="receivedQty" className="text-sm font-medium flex items-center gap-1">
                Received Quantity <span className="text-destructive">*</span>
              </Label>
              <Input
                id="receivedQty"
                type="number"
                min="0"
                value={receivedQty}
                onChange={(e) => setReceivedQty(e.target.value)}
                placeholder="Enter total quantity received"
                data-testid="input-received-qty"
                className="transition-all duration-200"
              />
              <p className="text-xs text-muted-foreground">Total units received in this shipment</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Inspection Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Quality check results, damages, discrepancies..."
                rows={3}
                data-testid="input-grn-notes"
                className="resize-none transition-all duration-200"
              />
              <p className="text-xs text-muted-foreground">Document any issues or observations</p>
            </div>
          </div>
        </div>
      </FormModal>

      {/* Export Dialog */}
      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        columns={[
          { key: "grnNumber", label: "GRN Number" },
          { key: "poNumber", label: "PO Number" },
          { key: "vendor", label: "Vendor" },
          { key: "receivedDate", label: "Date" },
          { key: "orderedQty", label: "Ordered Qty" },
          { key: "receivedQty", label: "Received Qty" },
          { key: "status", label: "Status" },
        ]}
        data={finalData.filter((item) => selectedItems.length === 0 || selectedItems.includes(item.id))}
        filename="grn-records"
      />

      {/* Activity Log Dialog */}
      <ActivityLogDialog
        open={activityLogOpen}
        onOpenChange={setActivityLogOpen}
        logs={activityLogs}
        title="GRN Activity Log"
      />

      {/* Advanced Filter Dialog */}
      <AdvancedFilterDialog
        open={advancedFilterOpen}
        onOpenChange={setAdvancedFilterOpen}
        fields={[
          { value: "grnNumber", label: "GRN Number", type: "text" },
          { value: "poNumber", label: "PO Number", type: "text" },
          { value: "vendor", label: "Vendor", type: "text" },
          { value: "receivedDate", label: "Date", type: "date" },
          { value: "status", label: "Status", type: "select" },
        ]}
        onApplyFilters={handleApplyFilters}
        savedFilters={savedFilters}
        onSaveFilter={handleSaveFilter}
      />
    </PageBackground>
  );
}
