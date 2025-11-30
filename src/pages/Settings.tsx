import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { PageBackground } from "@/components/PageBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Pencil, Package, MapPin, Tag } from "lucide-react";

// todo: remove mock functionality
interface Category {
  id: string;
  name: string;
  description: string;
}

interface Location {
  id: string;
  name: string;
  address: string;
  capacity: string;
}

interface ProductType {
  id: string;
  name: string;
  prefix: string;
}

const mockCategories: Category[] = [
  { id: "1", name: "Widgets", description: "Basic widget products" },
  { id: "2", name: "Gadgets", description: "Electronic gadgets and devices" },
  { id: "3", name: "Components", description: "Parts and components" },
  { id: "4", name: "Accessories", description: "Product accessories" },
];

const mockLocations: Location[] = [
  { id: "1", name: "Warehouse A", address: "123 Industrial Blvd", capacity: "10000 sq ft" },
  { id: "2", name: "Warehouse B", address: "456 Storage Ave", capacity: "8000 sq ft" },
  { id: "3", name: "Warehouse C", address: "789 Distribution Way", capacity: "12000 sq ft" },
];

const mockProductTypes: ProductType[] = [
  { id: "1", name: "Raw Material", prefix: "RM" },
  { id: "2", name: "Finished Goods", prefix: "FG" },
  { id: "3", name: "Work in Progress", prefix: "WIP" },
];

export default function Settings() {
  const { toast } = useToast();
  
  // Category state
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDesc, setCategoryDesc] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  // Location state
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [locationCapacity, setLocationCapacity] = useState("");
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [deleteLocationId, setDeleteLocationId] = useState<string | null>(null);

  // Product Type state
  const [productTypes, setProductTypes] = useState<ProductType[]>(mockProductTypes);
  const [typeName, setTypeName] = useState("");
  const [typePrefix, setTypePrefix] = useState("");
  const [editingType, setEditingType] = useState<ProductType | null>(null);
  const [deleteTypeId, setDeleteTypeId] = useState<string | null>(null);

  // Category handlers
  const handleAddCategory = () => {
    if (!categoryName.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    const newCategory: Category = {
      id: String(Date.now()),
      name: categoryName,
      description: categoryDesc,
    };

    setCategories([...categories, newCategory]);
    setCategoryName("");
    setCategoryDesc("");
    toast({
      title: "Category Added",
      description: `${categoryName} has been added successfully.`,
    });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryDesc(category.description);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory) return;

    setCategories(
      categories.map((cat) =>
        cat.id === editingCategory.id
          ? { ...cat, name: categoryName, description: categoryDesc }
          : cat
      )
    );

    toast({
      title: "Category Updated",
      description: `${categoryName} has been updated successfully.`,
    });

    setEditingCategory(null);
    setCategoryName("");
    setCategoryDesc("");
  };

  const handleDeleteCategory = () => {
    if (!deleteCategoryId) return;

    setCategories(categories.filter((cat) => cat.id !== deleteCategoryId));
    toast({
      title: "Category Deleted",
      description: "Category has been removed successfully.",
      variant: "destructive",
    });
    setDeleteCategoryId(null);
  };

  const handleCancelCategoryEdit = () => {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryDesc("");
  };

  // Location handlers
  const handleAddLocation = () => {
    if (!locationName.trim()) {
      toast({
        title: "Validation Error",
        description: "Location name is required",
        variant: "destructive",
      });
      return;
    }

    const newLocation: Location = {
      id: String(Date.now()),
      name: locationName,
      address: locationAddress,
      capacity: locationCapacity,
    };

    setLocations([...locations, newLocation]);
    setLocationName("");
    setLocationAddress("");
    setLocationCapacity("");
    toast({
      title: "Location Added",
      description: `${locationName} has been added successfully.`,
    });
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setLocationName(location.name);
    setLocationAddress(location.address);
    setLocationCapacity(location.capacity);
  };

  const handleUpdateLocation = () => {
    if (!editingLocation) return;

    setLocations(
      locations.map((loc) =>
        loc.id === editingLocation.id
          ? {
              ...loc,
              name: locationName,
              address: locationAddress,
              capacity: locationCapacity,
            }
          : loc
      )
    );

    toast({
      title: "Location Updated",
      description: `${locationName} has been updated successfully.`,
    });

    setEditingLocation(null);
    setLocationName("");
    setLocationAddress("");
    setLocationCapacity("");
  };

  const handleDeleteLocation = () => {
    if (!deleteLocationId) return;

    setLocations(locations.filter((loc) => loc.id !== deleteLocationId));
    toast({
      title: "Location Deleted",
      description: "Location has been removed successfully.",
      variant: "destructive",
    });
    setDeleteLocationId(null);
  };

  const handleCancelLocationEdit = () => {
    setEditingLocation(null);
    setLocationName("");
    setLocationAddress("");
    setLocationCapacity("");
  };

  // Product Type handlers
  const handleAddProductType = () => {
    if (!typeName.trim() || !typePrefix.trim()) {
      toast({
        title: "Validation Error",
        description: "Product type name and prefix are required",
        variant: "destructive",
      });
      return;
    }

    const newType: ProductType = {
      id: String(Date.now()),
      name: typeName,
      prefix: typePrefix.toUpperCase(),
    };

    setProductTypes([...productTypes, newType]);
    setTypeName("");
    setTypePrefix("");
    toast({
      title: "Product Type Added",
      description: `${typeName} has been added successfully.`,
    });
  };

  const handleEditProductType = (type: ProductType) => {
    setEditingType(type);
    setTypeName(type.name);
    setTypePrefix(type.prefix);
  };

  const handleUpdateProductType = () => {
    if (!editingType) return;

    setProductTypes(
      productTypes.map((type) =>
        type.id === editingType.id
          ? { ...type, name: typeName, prefix: typePrefix.toUpperCase() }
          : type
      )
    );

    toast({
      title: "Product Type Updated",
      description: `${typeName} has been updated successfully.`,
    });

    setEditingType(null);
    setTypeName("");
    setTypePrefix("");
  };

  const handleDeleteProductType = () => {
    if (!deleteTypeId) return;

    setProductTypes(productTypes.filter((type) => type.id !== deleteTypeId));
    toast({
      title: "Product Type Deleted",
      description: "Product type has been removed successfully.",
      variant: "destructive",
    });
    setDeleteTypeId(null);
  };

  const handleCancelTypeEdit = () => {
    setEditingType(null);
    setTypeName("");
    setTypePrefix("");
  };

  return (
    <PageBackground>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto animate-fade-in">
        <PageHeader
        title="Settings"
        description="Manage categories, locations, and product types"
      />

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList>
          <TabsTrigger value="categories">
            <Package className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="locations">
            <MapPin className="h-4 w-4 mr-2" />
            Locations
          </TabsTrigger>
          <TabsTrigger value="product-types">
            <Tag className="h-4 w-4 mr-2" />
            Product Types
          </TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Category Name *</Label>
                  <Input
                    id="category-name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="e.g., Electronics"
                    maxLength={50}
                  />
                  <p className="text-xs text-muted-foreground">
                    {categoryName.length}/50 characters
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-desc">Description</Label>
                  <Input
                    id="category-desc"
                    value={categoryDesc}
                    onChange={(e) => setCategoryDesc(e.target.value)}
                    placeholder="Brief description"
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground">
                    {categoryDesc.length}/200 characters
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {editingCategory ? (
                  <>
                    <Button onClick={handleUpdateCategory} disabled={!categoryName.trim()}>
                      Update Category
                    </Button>
                    <Button variant="outline" onClick={handleCancelCategoryEdit}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleAddCategory} disabled={!categoryName.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Existing Categories</h3>
              {categories.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No categories yet</p>
                  <p className="text-sm">Add your first category above</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {categories.map((category, index) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-all duration-200 hover:shadow-md hover:border-primary/20 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{category.name}</h4>
                        <Badge variant="secondary">{category.id}</Badge>
                      </div>
                      {category.description && (
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteCategoryId(category.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingLocation ? "Edit Location" : "Add New Location"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="location-name">Location Name *</Label>
                  <Input
                    id="location-name"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g., Warehouse A"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location-address">Address</Label>
                  <Input
                    id="location-address"
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    placeholder="Full address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location-capacity">Capacity</Label>
                  <Input
                    id="location-capacity"
                    value={locationCapacity}
                    onChange={(e) => setLocationCapacity(e.target.value)}
                    placeholder="e.g., 10000 sq ft"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {editingLocation ? (
                  <>
                    <Button onClick={handleUpdateLocation} disabled={!locationName.trim()}>
                      Update Location
                    </Button>
                    <Button variant="outline" onClick={handleCancelLocationEdit}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleAddLocation} disabled={!locationName.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Location
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Existing Locations</h3>
              {locations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No locations yet</p>
                  <p className="text-sm">Add your first warehouse location above</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {locations.map((location, index) => (
                  <div
                    key={location.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-all duration-200 hover:shadow-md hover:border-primary/20 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-medium">{location.name}</h4>
                      </div>
                      <div className="space-y-1">
                        {location.address && (
                          <p className="text-sm text-muted-foreground">
                            📍 {location.address}
                          </p>
                        )}
                        {location.capacity && (
                          <p className="text-sm text-muted-foreground">
                            📦 Capacity: {location.capacity}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditLocation(location)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteLocationId(location.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Product Types Tab */}
        <TabsContent value="product-types" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingType ? "Edit Product Type" : "Add New Product Type"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="type-name">Product Type Name *</Label>
                  <Input
                    id="type-name"
                    value={typeName}
                    onChange={(e) => setTypeName(e.target.value)}
                    placeholder="e.g., Raw Material"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type-prefix">SKU Prefix *</Label>
                  <Input
                    id="type-prefix"
                    value={typePrefix}
                    onChange={(e) => setTypePrefix(e.target.value)}
                    placeholder="e.g., RM"
                    maxLength={5}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {editingType ? (
                  <>
                    <Button onClick={handleUpdateProductType} disabled={!typeName.trim() || !typePrefix.trim()}>
                      Update Type
                    </Button>
                    <Button variant="outline" onClick={handleCancelTypeEdit}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleAddProductType} disabled={!typeName.trim() || !typePrefix.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product Type
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Existing Product Types</h3>
              {productTypes.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Tag className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No product types yet</p>
                  <p className="text-sm">Add your first product type above</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {productTypes.map((type, index) => (
                  <div
                    key={type.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-all duration-200 hover:shadow-md hover:border-primary/20 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{type.name}</h4>
                        <Badge variant="outline" className="font-mono">
                          {type.prefix}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditProductType(type)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTypeId(type.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Category Dialog */}
      <AlertDialog open={!!deleteCategoryId} onOpenChange={() => setDeleteCategoryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Location Dialog */}
      <AlertDialog open={!!deleteLocationId} onOpenChange={() => setDeleteLocationId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Location</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this location? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLocation}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Product Type Dialog */}
      <AlertDialog open={!!deleteTypeId} onOpenChange={() => setDeleteTypeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product type? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProductType}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </PageBackground>
  );
}
