import { useState } from "react";
import { PageBackground } from "@/components/PageBackground";
import { SearchFilter } from "@/components/SearchFilter";
import { DataTable, type Column } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Building2, Mail, Phone, Package, ShoppingCart, Calendar, DollarSign, TrendingDown, TrendingUp, Building, History, Download, Filter, Pencil, Trash2, Eye, Plus } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { BulkActions } from "@/components/BulkActions";
import { ExportDialog } from "@/components/ExportDialog";
import { ActivityLogDialog, generateMockActivityLogs, type ActivityLog } from "@/components/ActivityLog";
import { AdvancedFilterDialog, applyAdvancedFilters, type FilterCondition, type SavedFilter } from "@/components/AdvancedFilter";
import { getVendorsData, getVendorPurchaseHistory, type Vendor, type PurchaseOrderHistory } from "@/data/dataTransformers";

const mockVendors = getVendorsData();
const mockPurchaseOrders = getVendorPurchaseHistory();
  
export default function Vendors() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  
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
      name: "Active Vendors",
      conditions: [{ id: "1", field: "status", operator: "equals", value: "active", fieldType: "select" }],
      isFavorite: true,
    },
    {
      id: "2",
      name: "High Spend Vendors",
      conditions: [{ id: "1", field: "totalSpent", operator: "greater", value: "100000", fieldType: "number" }],
    },
  ]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentTerms: "",
  });

  const filteredData = mockVendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(search.toLowerCase()) ||
      vendor.code.toLowerCase().includes(search.toLowerCase()) ||
      vendor.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || vendor.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Apply advanced filters if any
  const finalData = filterConditions.length > 0 
    ? applyAdvancedFilters(filteredData, filterConditions)
    : filteredData;

  const columns: Column<Vendor>[] = [
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
      render: (vendor) => (
        <Checkbox
          checked={selectedItems.includes(vendor.id)}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedItems([...selectedItems, vendor.id]);
            } else {
              setSelectedItems(selectedItems.filter((id) => id !== vendor.id));
            }
          }}
        />
      ),
    },
    { key: "code", header: "Code", className: "font-mono text-sm" },
    {
      key: "name",
      header: "Vendor Name",
      render: (vendor) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                setSelectedVendor(vendor);
                setDetailsOpen(true);
              }}
              className="flex items-center gap-2 hover:text-primary transition-colors text-left"
            >
              <div className="p-1.5 rounded bg-muted">
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="font-medium underline decoration-transparent hover:decoration-current transition-all">
                {vendor.name}
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-semibold">{vendor.name}</p>
              <p className="text-xs text-muted-foreground">Code: {vendor.code}</p>
              <p className="text-xs text-muted-foreground">Status: {vendor.status}</p>
              <p className="text-xs text-muted-foreground">Payment Terms: {vendor.paymentTerms}</p>
              <p className="text-xs">Click to view full details</p>
            </div>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      key: "email",
      header: "Contact",
      render: (vendor) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <Mail className="h-3 w-3 text-muted-foreground" />
            {vendor.email}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Phone className="h-3 w-3" />
            {vendor.phone}
          </div>
        </div>
      ),
    },
    { key: "paymentTerms", header: "Payment Terms" },
    {
      key: "totalOrders",
      header: "Orders",
      className: "text-right font-mono",
    },
    {
      key: "totalSpent",
      header: "Total Spent",
      className: "text-right font-mono",
      render: (vendor) => `$${vendor.totalSpent.toLocaleString()}`,
    },
    {
      key: "status",
      header: "Status",
      render: (vendor) => (
        <Badge variant={vendor.status === "active" ? "default" : "secondary"}>
          {vendor.status === "active" ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  const handleSubmit = () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, Email, Phone).",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Vendor Added",
      description: `${formData.name} has been added to your vendors.`,
    });
    setModalOpen(false);
    setFormData({ name: "", email: "", phone: "", address: "", paymentTerms: "" });
  };

  // Bulk operation handlers
  const handleBulkExport = () => {
    setExportDialogOpen(true);
  };

  const handleBulkEmail = () => {
    toast({
      title: "Email Sent",
      description: `Report for ${selectedItems.length} vendors has been sent to your email.`,
    });
  };

  const handleBulkStatusChange = (newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `${selectedItems.length} vendors have been updated to ${newStatus}.`,
    });
    setSelectedItems([]);
  };

  const handleBulkDelete = () => {
    toast({
      title: "Vendors Deleted",
      description: `${selectedItems.length} vendors have been deleted successfully.`,
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
      description: `Filter \"${name}\" has been saved successfully.`,
    });
  };

  const totalSpent = mockVendors.reduce((sum, v) => sum + v.totalSpent, 0);
  const activeVendors = mockVendors.filter((v) => v.status === "active").length;
  const inactiveVendors = mockVendors.filter((v) => v.status === "inactive").length;
  const totalOrders = mockVendors.reduce((sum, v) => sum + v.totalOrders, 0);
  const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

  return (
    <PageBackground>
      <div className="relative z-10 p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Vendors</h1>
          <p className="text-muted-foreground">Manage and track supplier relationships</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Vendors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{mockVendors.length}</p>
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{activeVendors}</p>
                <Building2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Inactive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{inactiveVendors}</p>
                <Building2 className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-red-600">${(totalSpent / 1000).toFixed(1)}k</p>
                <DollarSign className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-green-600">${(avgOrderValue / 1000).toFixed(1)}k</p>
                <TrendingUp className="h-8 w-8 text-green-500" />
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
                  searchPlaceholder="Search vendors..."
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
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
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
                  Add Vendor
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
            statusOptions={["Active", "Inactive", "Preferred"]}
          />
        )}

        {/* Data Table */}
        <Card>
          <CardContent className="pt-6">
            {filteredData.length === 0 ? (
            <EmptyState
              icon={Building}
              title={search || statusFilter !== "All" ? "No vendors found" : "No vendors yet"}
              description={
                search || statusFilter !== "All"
                  ? "No vendors match your search criteria. Try adjusting your filters."
                  : "Build your supplier network by adding your first vendor."
              }
              action={{
                label: "Add Vendor",
                onClick: () => setModalOpen(true),
                icon: Building2,
              }}
            />
            ) : (
              <DataTable
                columns={columns}
                data={finalData}
                testIdPrefix="vendors"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Add New Vendor"
        description="Enter the vendor's details below."
        onSubmit={handleSubmit}
        submitLabel="Add Vendor"
      >
        {/* Vendor Information Section */}
        <div className="space-y-4">
          <div className="pb-2 border-b">
            <h3 className="text-sm font-semibold text-foreground">Vendor Information</h3>
            <p className="text-xs text-muted-foreground mt-1">Basic vendor details</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vendor-name" className="text-sm font-medium flex items-center gap-1">
              Vendor Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="vendor-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Acme Supplies Inc."
              data-testid="input-vendor-name"
              className="transition-all duration-200"
            />
            <p className="text-xs text-muted-foreground">Full legal name of the vendor</p>
          </div>
        </div>

        {/* Contact Details Section */}
        <div className="space-y-4 pt-4">
          <div className="pb-2 border-b">
            <h3 className="text-sm font-semibold text-foreground">Contact Details</h3>
            <p className="text-xs text-muted-foreground mt-1">How to reach the vendor</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sales@company.com"
                data-testid="input-vendor-email"
                className="transition-all duration-200"
              />
              <p className="text-xs text-muted-foreground">Primary contact email</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-1">
                Phone <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 555-0100"
                data-testid="input-vendor-phone"
                className="transition-all duration-200"
              />
              <p className="text-xs text-muted-foreground">Contact phone number</p>
            </div>
          </div>
        </div>

        {/* Location & Terms Section */}
        <div className="space-y-4 pt-4">
          <div className="pb-2 border-b">
            <h3 className="text-sm font-semibold text-foreground">Location & Terms</h3>
            <p className="text-xs text-muted-foreground mt-1">Address and payment details</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Address
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full address"
                rows={2}
                data-testid="input-vendor-address"
                className="resize-none transition-all duration-200"
              />
              <p className="text-xs text-muted-foreground">Full business address</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentTerms" className="text-sm font-medium">
                Payment Terms
              </Label>
              <Input
                id="paymentTerms"
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                placeholder="e.g., Net 30"
                data-testid="input-payment-terms"
                className="transition-all duration-200"
              />
              <p className="text-xs text-muted-foreground">Standard payment terms agreement</p>
            </div>
          </div>
        </div>
      </FormModal>

      {/* Vendor Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              {selectedVendor?.name}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="font-mono text-xs">{selectedVendor?.code}</Badge>
              <span className="text-xs text-muted-foreground">•</span>
              <Badge variant={selectedVendor?.status === "active" ? "default" : "secondary"}>
                {selectedVendor?.status === "active" ? "Active Vendor" : "Inactive"}
              </Badge>
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="history">Purchase Order History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              {/* Contact Information */}
              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="p-2 rounded-md bg-background">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Email Address</p>
                      <p className="font-medium">{selectedVendor?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="p-2 rounded-md bg-background">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Phone Number</p>
                      <p className="font-medium">{selectedVendor?.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="p-2 rounded-md bg-background">
                      <Package className="h-4 w-4 text-primary mt-0.5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Address</p>
                      <p className="font-medium">{selectedVendor?.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-blue-500/20 hover:border-blue-500/40 transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <ShoppingCart className="h-4 w-4 text-blue-600" />
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Orders</p>
                    </div>
                    <p className="text-3xl font-bold">{selectedVendor?.totalOrders}</p>
                    <p className="text-xs text-muted-foreground mt-1">Purchase orders</p>
                  </CardContent>
                </Card>
                <Card className="border-orange-500/20 hover:border-orange-500/40 transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-orange-500/10">
                        <TrendingDown className="h-4 w-4 text-orange-600" />
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Spent</p>
                    </div>
                    <p className="text-3xl font-bold font-mono text-orange-600">
                      ${selectedVendor?.totalSpent.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Lifetime spending</p>
                  </CardContent>
                </Card>
                <Card className="border-purple-500/20 hover:border-purple-500/40 transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <Calendar className="h-4 w-4 text-purple-600" />
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Payment Terms</p>
                    </div>
                    <p className="text-2xl font-bold">
                      {selectedVendor?.paymentTerms}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Standard terms</p>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 hover:border-primary/40 transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</p>
                    </div>
                    <Badge 
                      variant={selectedVendor?.status === "active" ? "default" : "secondary"}
                      className="text-sm px-3 py-1"
                    >
                      {selectedVendor?.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">Account status</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {selectedVendor && mockPurchaseOrders[selectedVendor.id] ? (
                <div className="space-y-4">
                  {mockPurchaseOrders[selectedVendor.id].map((order) => (
                    <Card key={order.id} className="border-primary/10 hover:border-primary/30 transition-all duration-200 hover:shadow-md">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="p-1.5 rounded-md bg-primary/10">
                                <ShoppingCart className="h-4 w-4 text-primary" />
                              </div>
                              <CardTitle className="text-base font-mono">
                                {order.orderNumber}
                              </CardTitle>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(order.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                          <Badge 
                            variant={
                              order.status === "completed" ? "default" : 
                              order.status === "pending" ? "secondary" : 
                              "destructive"
                            }
                            className="text-xs px-2.5 py-1"
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="border rounded-lg overflow-hidden bg-muted/30">
                            <table className="w-full text-sm">
                              <thead className="bg-muted/80">
                                <tr>
                                  <th className="text-left p-3 font-semibold text-xs uppercase tracking-wide">Product</th>
                                  <th className="text-left p-3 font-semibold text-xs uppercase tracking-wide">SKU</th>
                                  <th className="text-right p-3 font-semibold text-xs uppercase tracking-wide">Quantity</th>
                                  <th className="text-right p-3 font-semibold text-xs uppercase tracking-wide">Unit Price</th>
                                  <th className="text-right p-3 font-semibold text-xs uppercase tracking-wide">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody className="bg-background">
                                {order.products.map((product, idx) => (
                                  <tr key={idx} className="border-t hover:bg-muted/20 transition-colors">
                                    <td className="p-3 font-medium">{product.name}</td>
                                    <td className="p-3 font-mono text-xs text-muted-foreground">{product.sku}</td>
                                    <td className="p-3 text-right font-mono">{product.quantity}</td>
                                    <td className="p-3 text-right font-mono">
                                      ${product.unitPrice.toFixed(2)}
                                    </td>
                                    <td className="p-3 text-right font-mono font-semibold">
                                      ${(product.quantity * product.unitPrice).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="flex justify-between items-center pt-4 mt-2 border-t-2 border-primary/20">
                            <span className="font-semibold text-base">Total Amount</span>
                            <span className="text-2xl font-bold font-mono text-primary">
                              ${order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">
                      No purchase order history available
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      No orders have been placed with this vendor yet
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        columns={[
          { key: "code", label: "Code" },
          { key: "name", label: "Vendor Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "address", label: "Address" },
          { key: "paymentTerms", label: "Payment Terms" },
          { key: "totalOrders", label: "Total Orders" },
          { key: "totalSpent", label: "Total Spent" },
          { key: "status", label: "Status" },
        ]}
        data={finalData.filter((item) => selectedItems.length === 0 || selectedItems.includes(item.id))}
        filename="vendors"
      />

      {/* Activity Log Dialog */}
      <ActivityLogDialog
        open={activityLogOpen}
        onOpenChange={setActivityLogOpen}
        logs={activityLogs}
        title="Vendor Activity Log"
      />

      {/* Advanced Filter Dialog */}
      <AdvancedFilterDialog
        open={advancedFilterOpen}
        onOpenChange={setAdvancedFilterOpen}
        fields={[
          { value: "code", label: "Code", type: "text" },
          { value: "name", label: "Vendor Name", type: "text" },
          { value: "email", label: "Email", type: "text" },
          { value: "phone", label: "Phone", type: "text" },
          { value: "address", label: "Address", type: "text" },
          { value: "paymentTerms", label: "Payment Terms", type: "text" },
          { value: "totalOrders", label: "Total Orders", type: "number" },
          { value: "totalSpent", label: "Total Spent", type: "number" },
          { value: "status", label: "Status", type: "select" },
        ]}
        onApplyFilters={handleApplyFilters}
        savedFilters={savedFilters}
        onSaveFilter={handleSaveFilter}
      />
    </PageBackground>
  );
}
