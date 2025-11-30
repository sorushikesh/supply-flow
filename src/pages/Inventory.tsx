import { useState } from "react";
import { PageBackground } from "@/components/PageBackground";
import { SearchFilter } from "@/components/SearchFilter";
import { DataTable, type Column } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Package, ArrowUp, ArrowDown, Calendar, TrendingUp, DollarSign, PackageX, History, Download, Filter, Plus } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { BulkActions } from "@/components/BulkActions";
import { ExportDialog } from "@/components/ExportDialog";
import { ActivityLogDialog, generateMockActivityLogs, type ActivityLog } from "@/components/ActivityLog";
import { AdvancedFilterDialog, applyAdvancedFilters, type FilterCondition, type SavedFilter } from "@/components/AdvancedFilter";
import { getInventoryData, getStockMovements, type InventoryItem, type StockMovement } from "@/data/dataTransformers";

const mockInventory = getInventoryData();
const mockStockMovements = getStockMovements();

const categories = ["All", "Laptops", "Monitors", "Power Supplies", "Accessories"];
const locations = ["All", "Main Warehouse", "Electronics Depot", "Regional Storage"];

export default function Inventory() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  
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
      name: "Low Stock Items",
      conditions: [{ id: "1", field: "currentStock", operator: "less", value: "20", fieldType: "number" }],
      isFavorite: true,
    },
    {
      id: "2",
      name: "High Value Products",
      conditions: [{ id: "1", field: "unitPrice", operator: "greater", value: "100", fieldType: "number" }],
    },
  ]);
  
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: "",
    currentStock: "",
    reorderLevel: "",
    unitPrice: "",
    location: "",
  });

  const filteredData = mockInventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || item.category === category;
    const matchesLocation = location === "All" || item.location === location;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Apply advanced filters if any
  const finalData = filterConditions.length > 0 
    ? applyAdvancedFilters(filteredData, filterConditions)
    : filteredData;

  const columns: Column<InventoryItem>[] = [
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
      render: (item) => (
        <Checkbox
          checked={selectedItems.includes(item.id)}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedItems([...selectedItems, item.id]);
            } else {
              setSelectedItems(selectedItems.filter((id) => id !== item.id));
            }
          }}
        />
      ),
    },
    { key: "sku", header: "SKU", className: "font-mono text-sm" },
    { 
      key: "name", 
      header: "Product Name",
      render: (item) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                setSelectedItem(item);
                setDetailsOpen(true);
              }}
              className="font-medium hover:text-primary transition-colors text-left underline decoration-transparent hover:decoration-current"
            >
              {item.name}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
              <p className="text-xs text-muted-foreground">Category: {item.category}</p>
              <p className="text-xs text-muted-foreground">Location: {item.location}</p>
              <p className="text-xs">Click to view full details</p>
            </div>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (item) => <Badge variant="secondary">{item.category}</Badge>,
    },
    {
      key: "currentStock",
      header: "Stock",
      className: "text-right font-mono",
      render: (item) => (
        <span
          className={
            item.currentStock <= item.reorderLevel
              ? "text-destructive font-medium"
              : ""
          }
        >
          {item.currentStock}
        </span>
      ),
    },
    {
      key: "reorderLevel",
      header: "Reorder Level",
      className: "text-right font-mono text-muted-foreground",
    },
    {
      key: "unitPrice",
      header: "Unit Price",
      className: "text-right font-mono",
      render: (item) => `$${item.unitPrice.toFixed(2)}`,
    },
    { key: "location", header: "Location" },
    { key: "lastUpdated", header: "Last Updated", className: "text-muted-foreground" },
    {
      key: "id",
      header: "Actions",
      render: (item) => (
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(item)}
                data-testid={`button-edit-${item.id}`}
                className="hover:bg-primary/10 hover:text-primary transition-all duration-200"
                aria-label={`Edit ${item.name}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit product</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteClick(item)}
                data-testid={`button-delete-${item.id}`}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                aria-label={`Delete ${item.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete product</TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      sku: item.sku,
      name: item.name,
      category: item.category,
      currentStock: item.currentStock.toString(),
      reorderLevel: item.reorderLevel.toString(),
      unitPrice: item.unitPrice.toString(),
      location: item.location,
    });
    setModalOpen(true);
  };

  const handleDeleteClick = (item: InventoryItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (itemToDelete) {
      toast({
        title: "Product Deleted",
        description: `${itemToDelete.name} has been removed from inventory.`,
        variant: "destructive",
      });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.sku || !formData.name || !formData.category || !formData.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (SKU, Name, Category, Location).",
        variant: "destructive",
      });
      return;
    }

    if (!formData.currentStock || parseInt(formData.currentStock) < 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid initial stock quantity.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid unit price.",
        variant: "destructive",
      });
      return;
    }

    if (editingItem) {
      toast({
        title: "Product Updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      toast({
        title: "Product Added",
        description: `${formData.name} has been added to inventory.`,
      });
    }
    setModalOpen(false);
    setEditingItem(null);
    setFormData({
      sku: "",
      name: "",
      category: "",
      currentStock: "",
      reorderLevel: "",
      unitPrice: "",
      location: "",
    });
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
      description: `${selectedItems.length} items have been updated to ${newStatus}.`,
    });
    setSelectedItems([]);
  };

  const handleBulkDelete = () => {
    toast({
      title: "Items Deleted",
      description: `${selectedItems.length} items have been deleted successfully.`,
      variant: "destructive",
    });
    setSelectedItems([]);
  };

  const handleExport = (format: "csv" | "json", selectedColumns: string[], includeHeaders: boolean) => {
    const selectedData = finalData.filter((item) => selectedItems.length === 0 || selectedItems.includes(item.id));
    toast({
      title: "Export Successful",
      description: `Exported ${selectedData.length} items in ${format.toUpperCase()} format.`,
    });
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

  const handleModalClose = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setEditingItem(null);
      setFormData({
        sku: "",
        name: "",
        category: "",
        currentStock: "",
        reorderLevel: "",
        unitPrice: "",
        location: "",
      });
    }
  };

  const lowStockCount = mockInventory.filter(
    (item) => item.currentStock <= item.reorderLevel
  ).length;
  const inStockCount = mockInventory.filter(
    (item) => item.currentStock > item.reorderLevel
  ).length;
  const outOfStockCount = mockInventory.filter(
    (item) => item.currentStock === 0
  ).length;
  const totalValue = mockInventory.reduce(
    (sum, item) => sum + item.currentStock * item.unitPrice,
    0
  );

  return (
    <PageBackground>
      <div className="relative z-10 p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage your product inventory levels</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{mockInventory.length}</p>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Low Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{lowStockCount}</p>
                <TrendingUp className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Out of Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{outOfStockCount}</p>
                <PackageX className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{inStockCount}</p>
                <Package className="h-8 w-8 text-green-500" />
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
                  searchPlaceholder="Search by SKU or product name..."
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.filter(c => c !== "All").map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Locations</SelectItem>
                    {locations.filter(l => l !== "All").map((l) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
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
                  Add Product
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
            statusOptions={["In Stock", "Low Stock", "Out of Stock", "Discontinued"]}
          />
        )}

        {/* Data Table */}
        <Card>
          <CardContent className="pt-6">
            {filteredData.length === 0 ? (
            <EmptyState
              icon={PackageX}
              title={search || category !== "All" || location !== "All" ? "No products found" : "No inventory items yet"}
              description={
                search || category !== "All" || location !== "All"
                  ? "No products match your search criteria. Try adjusting your filters."
                  : "Get started by adding your first product to the inventory."
              }
              action={{
                label: "Add Product",
                onClick: () => setModalOpen(true),
                icon: Package,
              }}
            />
            ) : (
              <DataTable
                columns={columns}
                data={finalData}
                testIdPrefix="inventory"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <FormModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        title={editingItem ? "Edit Product" : "Add New Product"}
        description={editingItem ? "Update the product details." : "Enter the details of the new inventory item."}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? "Update Product" : "Add Product"}
      >
        {/* Product Information Section */}
        <div className="space-y-4">
          <div className="pb-2 border-b">
            <h3 className="text-sm font-semibold text-foreground">Product Information</h3>
            <p className="text-xs text-muted-foreground mt-1">Basic details about the product</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku" className="text-sm font-medium flex items-center gap-1">
                SKU <span className="text-destructive">*</span>
              </Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g., WDG-001"
                data-testid="input-sku"
                className="transition-all duration-200"
              />
              <p className="text-xs text-muted-foreground">Unique product identifier</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1">
                Product Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Widget Alpha"
                data-testid="input-product-name"
                className="transition-all duration-200"
              />
              <p className="text-xs text-muted-foreground">Full product name</p>
            </div>
          </div>
        </div>

        {/* Classification Section */}
        <div className="space-y-4 pt-4">
          <div className="pb-2 border-b">
            <h3 className="text-sm font-semibold text-foreground">Classification</h3>
            <p className="text-xs text-muted-foreground mt-1">Categorize and organize the product</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium flex items-center gap-1">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.slice(1).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Product category type</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium flex items-center gap-1">
                Location <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.location}
                onValueChange={(value) => setFormData({ ...formData, location: value })}
              >
                <SelectTrigger data-testid="select-location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.slice(1).map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Warehouse location</p>
            </div>
          </div>
        </div>

        {/* Stock Management Section */}
        <div className="space-y-4 pt-4">
          <div className="pb-2 border-b">
            <h3 className="text-sm font-semibold text-foreground">Stock Management</h3>
            <p className="text-xs text-muted-foreground mt-1">Inventory levels and alerts</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentStock" className="text-sm font-medium flex items-center gap-1">
                Initial Stock <span className="text-destructive">*</span>
              </Label>
              <Input
                id="currentStock"
                type="number"
                min="0"
                value={formData.currentStock}
                onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                placeholder="0"
                data-testid="input-initial-stock"
                className="transition-all duration-200"
              />
              <p className="text-xs text-muted-foreground">Current quantity in stock</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reorderLevel" className="text-sm font-medium flex items-center gap-1">
                Reorder Level <span className="text-destructive">*</span>
              </Label>
              <Input
                id="reorderLevel"
                type="number"
                min="0"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                placeholder="0"
                data-testid="input-reorder-level"
                className="transition-all duration-200"
              />
              <p className="text-xs text-muted-foreground">Low stock alert threshold</p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="space-y-4 pt-4">
          <div className="pb-2 border-b">
            <h3 className="text-sm font-semibold text-foreground">Pricing</h3>
            <p className="text-xs text-muted-foreground mt-1">Product pricing information</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitPrice" className="text-sm font-medium flex items-center gap-1">
                Unit Price <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  placeholder="0.00"
                  data-testid="input-unit-price"
                  className="pl-7 transition-all duration-200"
                />
              </div>
              <p className="text-xs text-muted-foreground">Price per unit</p>
            </div>
          </div>
        </div>
      </FormModal>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone and will permanently remove this product from your inventory."
        variant="destructive"
        confirmLabel="Delete Product"
        itemName={itemToDelete?.name}
      />

      {/* Item Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Package className="h-6 w-6 text-primary" />
              {selectedItem?.name}
            </DialogTitle>
            <DialogDescription>
              SKU: {selectedItem?.sku} | Location: {selectedItem?.location}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="movements">Stock Movements</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Product Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Product Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <Badge variant="secondary" className="mt-1">{selectedItem?.category}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium mt-1">{selectedItem?.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium mt-1">{selectedItem?.lastUpdated}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Unit Price</p>
                    <p className="font-medium font-mono mt-1">${selectedItem?.unitPrice.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Package className="h-4 w-4" />
                      <p className="text-xs font-medium">Current Stock</p>
                    </div>
                    <p className={`text-2xl font-bold ${
                      selectedItem && selectedItem.currentStock <= selectedItem.reorderLevel 
                        ? 'text-destructive' 
                        : ''
                    }`}>
                      {selectedItem?.currentStock}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <TrendingUp className="h-4 w-4" />
                      <p className="text-xs font-medium">Reorder Level</p>
                    </div>
                    <p className="text-2xl font-bold">{selectedItem?.reorderLevel}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <DollarSign className="h-4 w-4" />
                      <p className="text-xs font-medium">Total Value</p>
                    </div>
                    <p className="text-2xl font-bold font-mono">
                      ${selectedItem ? (selectedItem.currentStock * selectedItem.unitPrice).toFixed(2) : '0.00'}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Package className="h-4 w-4" />
                      <p className="text-xs font-medium">Status</p>
                    </div>
                    <Badge 
                      variant={
                        selectedItem && selectedItem.currentStock <= selectedItem.reorderLevel 
                          ? "destructive" 
                          : "default"
                      }
                      className="mt-1"
                    >
                      {selectedItem && selectedItem.currentStock <= selectedItem.reorderLevel 
                        ? "Low Stock" 
                        : "In Stock"}
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="movements" className="space-y-4">
              {selectedItem && mockStockMovements[selectedItem.id] ? (
                <div className="space-y-3">
                  {mockStockMovements[selectedItem.id].map((movement) => (
                    <Card key={movement.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`p-2 rounded-lg ${
                              movement.type === "in" 
                                ? "bg-green-100 dark:bg-green-900/20" 
                                : "bg-red-100 dark:bg-red-900/20"
                            }`}>
                              {movement.type === "in" ? (
                                <ArrowDown className="h-5 w-5 text-green-600 dark:text-green-400" />
                              ) : (
                                <ArrowUp className="h-5 w-5 text-red-600 dark:text-red-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant={movement.type === "in" ? "default" : "secondary"}>
                                  {movement.type === "in" ? "Stock In" : "Stock Out"}
                                </Badge>
                                <span className="font-mono text-sm text-muted-foreground">
                                  {movement.reference}
                                </span>
                              </div>
                              <p className="text-sm mb-1">{movement.notes}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(movement.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                                <span>By {movement.performedBy}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-xl font-bold font-mono ${
                              movement.type === "in" 
                                ? "text-green-600 dark:text-green-400" 
                                : "text-red-600 dark:text-red-400"
                            }`}>
                              {movement.type === "in" ? "+" : "-"}{movement.quantity}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">
                      No stock movements recorded
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Stock movement history will appear here once transactions are recorded
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
          { key: "sku", label: "SKU" },
          { key: "name", label: "Product Name" },
          { key: "category", label: "Category" },
          { key: "currentStock", label: "Stock" },
          { key: "reorderLevel", label: "Reorder Level" },
          { key: "unitPrice", label: "Unit Price" },
          { key: "location", label: "Location" },
          { key: "lastUpdated", label: "Last Updated" },
        ]}
        data={finalData.filter((item) => selectedItems.length === 0 || selectedItems.includes(item.id))}
        filename="inventory"
      />

      {/* Activity Log Dialog */}
      <ActivityLogDialog
        open={activityLogOpen}
        onOpenChange={setActivityLogOpen}
        logs={activityLogs}
        title="Inventory Activity Log"
      />

      {/* Advanced Filter Dialog */}
      <AdvancedFilterDialog
        open={advancedFilterOpen}
        onOpenChange={setAdvancedFilterOpen}
        fields={[
          { value: "sku", label: "SKU", type: "text" },
          { value: "name", label: "Product Name", type: "text" },
          { value: "category", label: "Category", type: "select" },
          { value: "currentStock", label: "Current Stock", type: "number" },
          { value: "reorderLevel", label: "Reorder Level", type: "number" },
          { value: "unitPrice", label: "Unit Price", type: "number" },
          { value: "location", label: "Location", type: "select" },
          { value: "lastUpdated", label: "Last Updated", type: "date" },
        ]}
        onApplyFilters={handleApplyFilters}
        savedFilters={savedFilters}
        onSaveFilter={handleSaveFilter}
      />
    </PageBackground>
  );
}
