import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SearchFilter } from "@/components/SearchFilter";
import { DataTable, type Column } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { Card, CardContent } from "@/components/ui/card";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2 } from "lucide-react";

// todo: remove mock functionality
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

const mockInventory: InventoryItem[] = [
  { id: "1", sku: "WDG-001", name: "Widget Alpha", category: "Widgets", currentStock: 12, reorderLevel: 50, unitPrice: 25.99, location: "Warehouse A", lastUpdated: "2024-01-15" },
  { id: "2", sku: "GDG-023", name: "Gadget Pro", category: "Gadgets", currentStock: 8, reorderLevel: 25, unitPrice: 149.99, location: "Warehouse B", lastUpdated: "2024-01-14" },
  { id: "3", sku: "CMP-045", name: "Component X", category: "Components", currentStock: 3, reorderLevel: 20, unitPrice: 12.50, location: "Warehouse A", lastUpdated: "2024-01-14" },
  { id: "4", sku: "WDG-002", name: "Widget Beta", category: "Widgets", currentStock: 156, reorderLevel: 30, unitPrice: 32.00, location: "Warehouse A", lastUpdated: "2024-01-13" },
  { id: "5", sku: "GDG-024", name: "Gadget Lite", category: "Gadgets", currentStock: 89, reorderLevel: 40, unitPrice: 89.99, location: "Warehouse C", lastUpdated: "2024-01-12" },
  { id: "6", sku: "CMP-046", name: "Component Y", category: "Components", currentStock: 234, reorderLevel: 100, unitPrice: 8.75, location: "Warehouse B", lastUpdated: "2024-01-11" },
  { id: "7", sku: "ACC-001", name: "Accessory Pack", category: "Accessories", currentStock: 45, reorderLevel: 20, unitPrice: 15.00, location: "Warehouse A", lastUpdated: "2024-01-10" },
  { id: "8", sku: "WDG-003", name: "Widget Gamma", category: "Widgets", currentStock: 67, reorderLevel: 25, unitPrice: 45.50, location: "Warehouse C", lastUpdated: "2024-01-09" },
];

const categories = ["All", "Widgets", "Gadgets", "Components", "Accessories"];
const locations = ["All", "Warehouse A", "Warehouse B", "Warehouse C"];

export default function Inventory() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
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
    { key: "name", header: "Product Name" },
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
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
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

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your inventory data is being exported to CSV.",
    });
  };

  const lowStockCount = mockInventory.filter(
    (item) => item.currentStock <= item.reorderLevel
  ).length;
  const totalValue = mockInventory.reduce(
    (sum, item) => sum + item.currentStock * item.unitPrice,
    0
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Inventory"
        description="Manage your product stock levels and locations"
        actionLabel="Add Product"
        onAction={() => setModalOpen(true)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Total Products
            </p>
            <p className="text-2xl font-bold mt-1">{mockInventory.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Low Stock Items
            </p>
            <p className="text-2xl font-bold mt-1 text-destructive">{lowStockCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Total Value
            </p>
            <p className="text-2xl font-bold mt-1 font-mono">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
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
            onExport={handleExport}
          />

          <DataTable
            columns={columns}
            data={filteredData}
            selectable
            testIdPrefix="inventory"
          />
        </CardContent>
      </Card>

      <FormModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        title={editingItem ? "Edit Product" : "Add New Product"}
        description={editingItem ? "Update the product details." : "Enter the details of the new inventory item."}
        onSubmit={handleSubmit}
        submitLabel={editingItem ? "Update Product" : "Add Product"}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sku">SKU *</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="e.g., WDG-001"
              data-testid="input-sku"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Widget Alpha"
              data-testid="input-product-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentStock">Initial Stock *</Label>
            <Input
              id="currentStock"
              type="number"
              value={formData.currentStock}
              onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
              placeholder="0"
              data-testid="input-initial-stock"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reorderLevel">Reorder Level *</Label>
            <Input
              id="reorderLevel"
              type="number"
              value={formData.reorderLevel}
              onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
              placeholder="0"
              data-testid="input-reorder-level"
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="unitPrice">Unit Price ($) *</Label>
            <Input
              id="unitPrice"
              type="number"
              step="0.01"
              value={formData.unitPrice}
              onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
              placeholder="0.00"
              data-testid="input-unit-price"
            />
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
    </div>
  );
}
