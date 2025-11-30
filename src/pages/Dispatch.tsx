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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, MapPin, Package, CheckCircle2, PackageX, History, Download, Filter, Plus } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { BulkActions } from "@/components/BulkActions";
import { ExportDialog } from "@/components/ExportDialog";
import { ActivityLogDialog, generateMockActivityLogs, type ActivityLog } from "@/components/ActivityLog";
import { AdvancedFilterDialog, applyAdvancedFilters, type FilterCondition, type SavedFilter } from "@/components/AdvancedFilter";

interface DispatchRecord {
  id: string;
  dispatchNumber: string;
  soNumber: string;
  customer: string;
  dispatchDate: string;
  carrier: string;
  trackingNumber: string;
  status: StatusType;
}

import { getDispatchData, getPendingSOs } from "@/data/dataTransformers";

const mockDispatches: DispatchRecord[] = getDispatchData().map(d => ({
  id: d.id,
  dispatchNumber: d.dispatchNumber,
  soNumber: d.soNumber,
  customer: d.customer,
  dispatchDate: d.dispatchDate,
  carrier: d.carrier,
  trackingNumber: d.trackingNumber,
  status: d.status as StatusType
}));

const _mockDispatches_removed = [
  { id: "1", dispatchNumber: "DSP-2024-0050", soNumber: "SO-2024-0122", customer: "BestBuy Corporate", dispatchDate: "2024-01-15", carrier: "FedEx", trackingNumber: "FX123456789", status: "in_transit" },
  { id: "2", dispatchNumber: "DSP-2024-0049", soNumber: "SO-2024-0121", customer: "Micro Center Distribution", dispatchDate: "2024-01-14", carrier: "UPS", trackingNumber: "UP987654321", status: "delivered" },
  { id: "3", dispatchNumber: "DSP-2024-0048", soNumber: "SO-2024-0120", customer: "Amazon Business Services", dispatchDate: "2024-01-13", carrier: "DHL", trackingNumber: "DH456789123", status: "delivered" },
  { id: "4", dispatchNumber: "DSP-2024-0047", soNumber: "SO-2024-0119", customer: "CDW Corporation", dispatchDate: "2024-01-12", carrier: "FedEx", trackingNumber: "FX789123456", status: "delivered" },
  { id: "5", dispatchNumber: "DSP-2024-0046", soNumber: "SO-2024-0118", customer: "TechCorp Solutions", dispatchDate: "2024-01-11", carrier: "UPS", trackingNumber: "UP654321987", status: "delivered" },
  { id: "6", dispatchNumber: "DSP-2024-0045", soNumber: "SO-2024-0117", customer: "Newegg Business", dispatchDate: "2024-01-10", carrier: "DHL", trackingNumber: "DH321654987", status: "pending" },
  { id: "7", dispatchNumber: "DSP-2024-0044", soNumber: "SO-2024-0116", customer: "Global Tech Distributors", dispatchDate: "2024-01-09", carrier: "FedEx", trackingNumber: "FX987456123", status: "in_transit" },
  { id: "8", dispatchNumber: "DSP-2024-0043", soNumber: "SO-2024-0115", customer: "Office Depot Enterprise", dispatchDate: "2024-01-08", carrier: "USPS", trackingNumber: "US123789456", status: "delivered" },
  { id: "9", dispatchNumber: "DSP-2024-0042", soNumber: "SO-2024-0114", customer: "Staples Advantage", dispatchDate: "2024-01-07", carrier: "UPS", trackingNumber: "UP456123789", status: "delivered" },
  { id: "10", dispatchNumber: "DSP-2024-0041", soNumber: "SO-2024-0113", customer: "B&H Photo Video", dispatchDate: "2024-01-06", carrier: "FedEx", trackingNumber: "FX654987321", status: "delivered" },
  { id: "11", dispatchNumber: "DSP-2024-0040", soNumber: "SO-2024-0112", customer: "TigerDirect Commercial", dispatchDate: "2024-01-05", carrier: "DHL", trackingNumber: "DH789321654", status: "pending" },
  { id: "12", dispatchNumber: "DSP-2024-0039", soNumber: "SO-2024-0111", customer: "Connection Enterprise", dispatchDate: "2024-01-04", carrier: "UPS", trackingNumber: "UP321789654", status: "in_transit" },
  { id: "13", dispatchNumber: "DSP-2024-0038", soNumber: "SO-2024-0110", customer: "SHI International", dispatchDate: "2024-01-03", carrier: "FedEx", trackingNumber: "FX147258369", status: "in_transit" },
  { id: "14", dispatchNumber: "DSP-2024-0037", soNumber: "SO-2024-0109", customer: "Ingram Micro", dispatchDate: "2024-01-02", carrier: "DHL", trackingNumber: "DH963852741", status: "delivered" },
  { id: "15", dispatchNumber: "DSP-2024-0036", soNumber: "SO-2024-0108", customer: "Costco Business Center", dispatchDate: "2024-01-01", carrier: "UPS", trackingNumber: "UP741963852", status: "delivered" },
  { id: "16", dispatchNumber: "DSP-2024-0035", soNumber: "SO-2024-0107", customer: "TechCorp Solutions", dispatchDate: "2023-12-31", carrier: "USPS", trackingNumber: "US852741963", status: "delivered" },
  { id: "17", dispatchNumber: "DSP-2024-0034", soNumber: "SO-2024-0106", customer: "BestBuy Corporate", dispatchDate: "2023-12-30", carrier: "FedEx", trackingNumber: "FX258963147", status: "pending" },
  { id: "18", dispatchNumber: "DSP-2024-0033", soNumber: "SO-2024-0105", customer: "Amazon Business Services", dispatchDate: "2023-12-29", carrier: "UPS", trackingNumber: "UP369147258", status: "delivered" },
];

const mockPendingSOs = getPendingSOs().map(so => ({
  soNumber: so.soNumber,
  customer: so.customer,
  address: "Address",
  items: 0
}));

const carriers = ["FedEx", "UPS", "DHL", "USPS"];

export default function Dispatch() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSO, setSelectedSO] = useState("");
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
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
      name: "In Transit Shipments",
      conditions: [{ id: "1", field: "status", operator: "equals", value: "in_transit", fieldType: "select" }],
      isFavorite: true,
    },
    {
      id: "2",
      name: "Pending Dispatches",
      conditions: [{ id: "1", field: "status", operator: "equals", value: "pending", fieldType: "select" }],
    },
  ]);

  const filteredData = mockDispatches.filter((dispatch) => {
    const matchesSearch =
      dispatch.dispatchNumber.toLowerCase().includes(search.toLowerCase()) ||
      dispatch.soNumber.toLowerCase().includes(search.toLowerCase()) ||
      dispatch.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || dispatch.status === statusFilter.toLowerCase().replace(" ", "_");
    return matchesSearch && matchesStatus;
  });

  // Apply advanced filters if any
  const finalData = filterConditions.length > 0 
    ? applyAdvancedFilters(filteredData, filterConditions)
    : filteredData;

  const columns: Column<DispatchRecord>[] = [
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
      render: (dispatch) => (
        <Checkbox
          checked={selectedItems.includes(dispatch.id)}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedItems([...selectedItems, dispatch.id]);
            } else {
              setSelectedItems(selectedItems.filter((id) => id !== dispatch.id));
            }
          }}
        />
      ),
    },
    { key: "dispatchNumber", header: "Dispatch #", className: "font-mono text-sm font-medium" },
    { key: "soNumber", header: "SO Number", className: "font-mono text-sm" },
    { key: "customer", header: "Customer" },
    { key: "dispatchDate", header: "Dispatch Date" },
    {
      key: "carrier",
      header: "Carrier",
      render: (dispatch) => (
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-muted-foreground" />
          {dispatch.carrier}
        </div>
      ),
    },
    {
      key: "trackingNumber",
      header: "Tracking",
      className: "font-mono text-sm",
      render: (dispatch) => (
        <span className="text-primary hover:underline cursor-pointer">
          {dispatch.trackingNumber}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (dispatch) => <StatusBadge status={dispatch.status} />,
    },
  ];

  const handleSubmit = () => {
    toast({
      title: "Dispatch Created",
      description: `Shipment created for ${selectedSO}.`,
    });
    setModalOpen(false);
    setSelectedSO("");
    setCarrier("");
    setTrackingNumber("");
    setNotes("");
  };

  // Bulk operation handlers
  const handleBulkExport = () => {
    setExportDialogOpen(true);
  };

  const handleBulkEmail = () => {
    toast({
      title: "Email Sent",
      description: `Report for ${selectedItems.length} items has been sent to your email.`,
    });
  };

  const handleBulkStatusChange = (newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `${selectedItems.length} dispatches have been updated to ${newStatus}.`,
    });
    setSelectedItems([]);
  };

  const handleBulkDelete = () => {
    toast({
      title: "Dispatches Deleted",
      description: `${selectedItems.length} dispatches have been deleted successfully.`,
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

  const inTransit = mockDispatches.filter((d) => d.status === "in_transit").length;
  const delivered = mockDispatches.filter((d) => d.status === "delivered").length;
  const pending = mockDispatches.filter((d) => d.status === "pending").length;
  const totalItems = mockDispatches.length;

  return (
    <PageBackground>
      <div className="relative z-10 p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Dispatch Management</h1>
          <p className="text-muted-foreground">Track and manage outgoing shipments</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Dispatches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{mockDispatches.length}</p>
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
                <p className="text-2xl font-bold">{pending}</p>
                <Package className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Transit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{inTransit}</p>
                <Truck className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Delivered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{delivered}</p>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{totalItems}</p>
                <Package className="h-8 w-8 text-blue-500" />
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
                  searchPlaceholder="Search by dispatch, SO number or customer..."
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
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
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
                  Create Dispatch
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
            statusOptions={["Pending", "In Transit", "Delivered", "Cancelled"]}
          />
        )}

        {/* Data Table */}
        <Card>
          <CardContent className="pt-6">
            {filteredData.length === 0 ? (
            <EmptyState
              icon={PackageX}
              title={search || statusFilter !== "All" ? "No dispatch records found" : "No dispatches yet"}
              description={
                search || statusFilter !== "All"
                  ? "No dispatch records match your search criteria. Try adjusting your filters."
                  : "Create your first dispatch to start shipping orders to customers."
              }
              action={{
                label: "Create Dispatch",
                onClick: () => setModalOpen(true),
                icon: Truck,
              }}
            />
            ) : (
              <DataTable
                columns={columns}
                data={finalData}
                testIdPrefix="dispatch"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Create Dispatch"
        description="Prepare shipment for a sales order."
        onSubmit={handleSubmit}
        submitLabel="Create Dispatch"
        maxWidth="lg"
      >
        <div className="space-y-4">
          {/* Sales Order Section */}
          <div className="space-y-3">
            <div className="pb-2 border-b">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Sales Order Selection
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Choose the order to dispatch</p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1">
                Sales Order <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedSO} onValueChange={setSelectedSO}>
                <SelectTrigger data-testid="select-so" className="transition-all duration-200">
                  <SelectValue placeholder="Choose a pending sales order" />
                </SelectTrigger>
                <SelectContent>
                  {mockPendingSOs.map((so) => (
                    <SelectItem key={so.soNumber} value={so.soNumber}>
                      <div className="flex flex-col py-1">
                        <span className="font-mono font-medium">{so.soNumber}</span>
                        <span className="text-xs text-muted-foreground">{so.customer}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Select from approved sales orders</p>
            </div>
          </div>

          {/* SO Details Display */}
          {selectedSO && (
            <div className="p-4 rounded-lg border-2 border-primary/20 bg-muted/30 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <MapPin className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Delivery Information</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Delivery Address</p>
                    <p className="text-sm font-medium mt-0.5">
                      {mockPendingSOs.find((s) => s.soNumber === selectedSO)?.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary" className="text-xs">
                    {mockPendingSOs.find((s) => s.soNumber === selectedSO)?.items} items to ship
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Details */}
          <div className="space-y-3 pt-2">
            <div className="pb-2 border-b">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                Shipping Details
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Carrier and tracking information</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-1">
                  Carrier <span className="text-destructive">*</span>
                </Label>
                <Select value={carrier} onValueChange={setCarrier}>
                  <SelectTrigger data-testid="select-carrier" className="transition-all duration-200">
                    <SelectValue placeholder="Select carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    {carriers.map((c) => (
                      <SelectItem key={c} value={c}>
                        <div className="flex items-center gap-2">
                          <Truck className="h-3 w-3" />
                          {c}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Shipping company</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tracking" className="text-sm font-medium">
                  Tracking Number
                </Label>
                <Input
                  id="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g., FX123456789"
                  data-testid="input-tracking"
                  className="transition-all duration-200 font-mono"
                />
                <p className="text-xs text-muted-foreground">Optional tracking ID</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Shipping Instructions
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special delivery instructions, handling requirements..."
                rows={3}
                data-testid="input-dispatch-notes"
                className="resize-none transition-all duration-200"
              />
              <p className="text-xs text-muted-foreground">Any special delivery notes</p>
            </div>
          </div>
        </div>
      </FormModal>

      {/* Export Dialog */}
      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        columns={[
          { key: "dispatchNumber", label: "Dispatch #" },
          { key: "dispatchDate", label: "Date" },
          { key: "customer", label: "Customer" },
          { key: "soNumber", label: "SO Number" },
          { key: "carrier", label: "Carrier" },
          { key: "trackingNumber", label: "Tracking" },
          { key: "status", label: "Status" },
        ]}
        data={finalData.filter((item) => selectedItems.length === 0 || selectedItems.includes(item.id))}
        filename="dispatch"
      />

      {/* Activity Log Dialog */}
      <ActivityLogDialog
        open={activityLogOpen}
        onOpenChange={setActivityLogOpen}
        logs={activityLogs}
        title="Dispatch Activity Log"
      />

      {/* Advanced Filter Dialog */}
      <AdvancedFilterDialog
        open={advancedFilterOpen}
        onOpenChange={setAdvancedFilterOpen}
        fields={[
          { value: "dispatchNumber", label: "Dispatch Number", type: "text" },
          { value: "customer", label: "Customer", type: "text" },
          { value: "dispatchDate", label: "Date", type: "date" },
          { value: "carrier", label: "Carrier", type: "text" },
          { value: "status", label: "Status", type: "select" },
        ]}
        onApplyFilters={handleApplyFilters}
        savedFilters={savedFilters}
        onSaveFilter={handleSaveFilter}
      />
    </PageBackground>
  );
}
