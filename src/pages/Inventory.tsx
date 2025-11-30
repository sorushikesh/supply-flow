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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Pencil, Trash2, Package, ArrowUp, ArrowDown, Calendar, TrendingUp, DollarSign } from "lucide-react";

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  unitPrice: number;
  location: string;
  lastUpdated: string;
}

interface StockMovement {
  id: string;
  date: string;
  type: "in" | "out";
  quantity: number;
  reference: string;
  notes: string;
  performedBy: string;
}

const mockInventory: InventoryItem[] = [
  { id: "1", sku: "WDG-001", name: "Widget Alpha", category: "Widgets", currentStock: 12, reorderLevel: 50, unitPrice: 25.99, location: "Warehouse A", lastUpdated: "2024-01-15" },
  { id: "2", sku: "GDG-023", name: "Gadget Pro", category: "Gadgets", currentStock: 8, reorderLevel: 25, unitPrice: 149.99, location: "Warehouse B", lastUpdated: "2024-01-14" },
  { id: "3", sku: "CMP-045", name: "Component X", category: "Components", currentStock: 3, reorderLevel: 20, unitPrice: 12.50, location: "Warehouse A", lastUpdated: "2024-01-14" },
  { id: "4", sku: "WDG-002", name: "Widget Beta", category: "Widgets", currentStock: 156, reorderLevel: 30, unitPrice: 32.00, location: "Warehouse A", lastUpdated: "2024-01-13" },
  { id: "5", sku: "GDG-024", name: "Gadget Lite", category: "Gadgets", currentStock: 89, reorderLevel: 40, unitPrice: 89.99, location: "Warehouse C", lastUpdated: "2024-01-12" },
  { id: "6", sku: "CMP-046", name: "Component Y", category: "Components", currentStock: 234, reorderLevel: 100, unitPrice: 8.75, location: "Warehouse B", lastUpdated: "2024-01-11" },
  { id: "7", sku: "ACC-001", name: "Accessory Pack", category: "Accessories", currentStock: 45, reorderLevel: 20, unitPrice: 15.00, location: "Warehouse A", lastUpdated: "2024-01-10" },
  { id: "8", sku: "WDG-003", name: "Widget Gamma", category: "Widgets", currentStock: 67, reorderLevel: 25, unitPrice: 45.50, location: "Warehouse C", lastUpdated: "2024-01-09" },
  { id: "9", sku: "GDG-025", name: "Gadget Ultra", category: "Gadgets", currentStock: 145, reorderLevel: 50, unitPrice: 199.99, location: "Warehouse A", lastUpdated: "2024-01-08" },
  { id: "10", sku: "CMP-047", name: "Component Z", category: "Components", currentStock: 5, reorderLevel: 15, unitPrice: 18.75, location: "Warehouse B", lastUpdated: "2024-01-07" },
  { id: "11", sku: "WDG-004", name: "Widget Delta", category: "Widgets", currentStock: 203, reorderLevel: 40, unitPrice: 28.50, location: "Warehouse C", lastUpdated: "2024-01-06" },
  { id: "12", sku: "ACC-002", name: "Premium Cable Set", category: "Accessories", currentStock: 78, reorderLevel: 30, unitPrice: 22.00, location: "Warehouse A", lastUpdated: "2024-01-05" },
  { id: "13", sku: "GDG-026", name: "Gadget Mini", category: "Gadgets", currentStock: 112, reorderLevel: 35, unitPrice: 59.99, location: "Warehouse B", lastUpdated: "2024-01-04" },
  { id: "14", sku: "CMP-048", name: "Component Alpha", category: "Components", currentStock: 18, reorderLevel: 25, unitPrice: 14.25, location: "Warehouse C", lastUpdated: "2024-01-03" },
  { id: "15", sku: "WDG-005", name: "Widget Omega", category: "Widgets", currentStock: 189, reorderLevel: 45, unitPrice: 38.75, location: "Warehouse A", lastUpdated: "2024-01-02" },
  { id: "16", sku: "ACC-003", name: "Connector Kit", category: "Accessories", currentStock: 6, reorderLevel: 18, unitPrice: 12.50, location: "Warehouse B", lastUpdated: "2024-01-01" },
  { id: "17", sku: "GDG-027", name: "Gadget Max", category: "Gadgets", currentStock: 167, reorderLevel: 60, unitPrice: 299.99, location: "Warehouse C", lastUpdated: "2023-12-31" },
  { id: "18", sku: "CMP-049", name: "Component Beta", category: "Components", currentStock: 298, reorderLevel: 80, unitPrice: 9.99, location: "Warehouse A", lastUpdated: "2023-12-30" },
  { id: "19", sku: "WDG-006", name: "Widget Prime", category: "Widgets", currentStock: 4, reorderLevel: 22, unitPrice: 42.00, location: "Warehouse B", lastUpdated: "2023-12-29" },
  { id: "20", sku: "ACC-004", name: "Adapter Bundle", category: "Accessories", currentStock: 134, reorderLevel: 28, unitPrice: 19.99, location: "Warehouse C", lastUpdated: "2023-12-28" },
  { id: "21", sku: "GDG-028", name: "Gadget Flex", category: "Gadgets", currentStock: 56, reorderLevel: 45, unitPrice: 129.99, location: "Warehouse A", lastUpdated: "2023-12-27" },
  { id: "22", sku: "CMP-050", name: "Component Gamma", category: "Components", currentStock: 423, reorderLevel: 120, unitPrice: 7.50, location: "Warehouse B", lastUpdated: "2023-12-26" },
  { id: "23", sku: "WDG-007", name: "Widget Express", category: "Widgets", currentStock: 91, reorderLevel: 33, unitPrice: 34.99, location: "Warehouse C", lastUpdated: "2023-12-25" },
  { id: "24", sku: "ACC-005", name: "Mount Bracket Set", category: "Accessories", currentStock: 12, reorderLevel: 24, unitPrice: 16.75, location: "Warehouse A", lastUpdated: "2023-12-24" },
  { id: "25", sku: "GDG-029", name: "Gadget Swift", category: "Gadgets", currentStock: 178, reorderLevel: 52, unitPrice: 174.99, location: "Warehouse B", lastUpdated: "2023-12-23" },
];

const mockStockMovements: Record<string, StockMovement[]> = {
  "1": [
    { id: "1", date: "2024-11-25", type: "out", quantity: 50, reference: "SO-2024-0098", notes: "Sales order fulfillment", performedBy: "John Doe" },
    { id: "2", date: "2024-11-20", type: "in", quantity: 100, reference: "PO-2024-0045", notes: "Purchase order received", performedBy: "Jane Smith" },
    { id: "3", date: "2024-11-15", type: "out", quantity: 38, reference: "SO-2024-0087", notes: "Customer order", performedBy: "John Doe" },
    { id: "4", date: "2024-11-10", type: "in", quantity: 200, reference: "PO-2024-0038", notes: "Stock replenishment", performedBy: "Jane Smith" },
  ],
  "2": [
    { id: "5", date: "2024-11-22", type: "out", quantity: 30, reference: "SO-2024-0115", notes: "Bulk order", performedBy: "John Doe" },
    { id: "6", date: "2024-11-18", type: "in", quantity: 50, reference: "PO-2024-0042", notes: "Restock", performedBy: "Jane Smith" },
    { id: "7", date: "2024-11-12", type: "out", quantity: 12, reference: "ADJ-001", notes: "Inventory adjustment - damaged items", performedBy: "Admin" },
  ],
  "3": [
    { id: "8", date: "2024-11-24", type: "out", quantity: 100, reference: "SO-2024-0122", notes: "Large customer order", performedBy: "John Doe" },
    { id: "9", date: "2024-11-19", type: "in", quantity: 500, reference: "PO-2024-0043", notes: "Bulk purchase", performedBy: "Jane Smith" },
    { id: "10", date: "2024-11-14", type: "out", quantity: 297, reference: "SO-2024-0095", notes: "Multiple orders", performedBy: "John Doe" },
  ],
};

const categories = ["All", "Widgets", "Gadgets", "Components", "Accessories"];
const locations = ["All", "Warehouse A", "Warehouse B", "Warehouse C"];

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

  const columns: Column<InventoryItem>[] = [
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
  const totalValue = mockInventory.reduce(
    (sum, item) => sum + item.currentStock * item.unitPrice,
    0
  );

  return (
    <PageBackground>
      <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Inventory Management
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Track and manage your product inventory</p>
          </div>
          <Button 
            onClick={() => setModalOpen(true)} 
            className="gap-2 hover:shadow-lg hover:scale-105 transition-all duration-200"
            aria-label="Add new product"
          >
            <Package className="h-4 w-4" />
            Add Product
          </Button>
        </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/20 hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => {/* Navigate to all products */}}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Package className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Total Products</p>
            <p className="text-2xl font-bold mt-1" aria-label={`${mockInventory.length} total products`}>{mockInventory.length}</p>
          </CardContent>
        </Card>
        <Card className="border-blue-500/20 hover:border-blue-500/40 hover:shadow-md transition-all duration-200 cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-4 w-4 text-blue-500" aria-hidden="true" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Total Stock Value</p>
            <p className="text-2xl font-bold mt-1 font-mono" aria-label={`Total value $${totalValue.toLocaleString()}`}>${totalValue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent hover:border-amber-500/50 hover:shadow-md transition-all duration-200 cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-4 w-4 text-amber-500" aria-hidden="true" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Low Stock Items</p>
            <p className="text-2xl font-bold mt-1 text-amber-600" aria-label={`${lowStockCount} items with low stock`}>{lowStockCount}</p>
          </CardContent>
        </Card>
        <Card className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent hover:border-green-500/50 hover:shadow-md transition-all duration-200 cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Package className="h-4 w-4 text-green-500" aria-hidden="true" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">In Stock Items</p>
            <p className="text-2xl font-bold mt-1 text-green-600" aria-label={`${inStockCount} items in stock`}>{inStockCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <SearchFilter
            searchPlaceholder="Search by SKU or product name..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={[
              {
                key: "category",
                label: "Category",
                options: categories.map((c) => ({ value: c, label: c })),
                value: category,
                onChange: setCategory,
              },
              {
                key: "location",
                label: "Location",
                options: locations.map((l) => ({ value: l, label: l })),
                value: location,
                onChange: setLocation,
              },
            ]}
          />

          <DataTable
            columns={columns}
            data={filteredData}
            testIdPrefix="inventory"
          />
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{itemToDelete?.name}</strong>?
              This action cannot be undone and will permanently remove this product from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
    </PageBackground>
  );
}
