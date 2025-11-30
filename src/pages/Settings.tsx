import { useState } from "react";
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
import { Plus, Trash2, Pencil, Package, MapPin, Tag, Building2, DollarSign, Scale, Bell, FileText, Users } from "lucide-react";

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

interface TaxRate {
  id: string;
  name: string;
  rate: string;
  type: string;
}

interface PaymentTerm {
  id: string;
  name: string;
  days: string;
  description: string;
}

interface UnitOfMeasure {
  id: string;
  name: string;
  abbreviation: string;
  category: string;
}

interface ShippingCarrier {
  id: string;
  name: string;
  contactEmail: string;
  trackingUrl: string;
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

const mockTaxRates: TaxRate[] = [
  { id: "1", name: "Standard VAT", rate: "20", type: "VAT" },
  { id: "2", name: "Reduced VAT", rate: "5", type: "VAT" },
  { id: "3", name: "Sales Tax", rate: "8.5", type: "Sales Tax" },
];

const mockPaymentTerms: PaymentTerm[] = [
  { id: "1", name: "Net 30", days: "30", description: "Payment due within 30 days" },
  { id: "2", name: "Net 60", days: "60", description: "Payment due within 60 days" },
  { id: "3", name: "Due on Receipt", days: "0", description: "Payment due immediately" },
];

const mockUnitsOfMeasure: UnitOfMeasure[] = [
  { id: "1", name: "Kilogram", abbreviation: "kg", category: "Weight" },
  { id: "2", name: "Meter", abbreviation: "m", category: "Length" },
  { id: "3", name: "Liter", abbreviation: "L", category: "Volume" },
  { id: "4", name: "Piece", abbreviation: "pcs", category: "Quantity" },
];

const mockShippingCarriers: ShippingCarrier[] = [
  { id: "1", name: "FedEx", contactEmail: "support@fedex.com", trackingUrl: "https://fedex.com/track?id=" },
  { id: "2", name: "UPS", contactEmail: "support@ups.com", trackingUrl: "https://ups.com/track?id=" },
  { id: "3", name: "DHL", contactEmail: "support@dhl.com", trackingUrl: "https://dhl.com/track?id=" },
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

  // Tax Rate state
  const [taxRates, setTaxRates] = useState<TaxRate[]>(mockTaxRates);
  const [taxName, setTaxName] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [taxType, setTaxType] = useState("");
  const [editingTax, setEditingTax] = useState<TaxRate | null>(null);
  const [deleteTaxId, setDeleteTaxId] = useState<string | null>(null);

  // Payment Term state
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>(mockPaymentTerms);
  const [termName, setTermName] = useState("");
  const [termDays, setTermDays] = useState("");
  const [termDesc, setTermDesc] = useState("");
  const [editingTerm, setEditingTerm] = useState<PaymentTerm | null>(null);
  const [deleteTermId, setDeleteTermId] = useState<string | null>(null);

  // Unit of Measure state
  const [unitsOfMeasure, setUnitsOfMeasure] = useState<UnitOfMeasure[]>(mockUnitsOfMeasure);
  const [unitName, setUnitName] = useState("");
  const [unitAbbr, setUnitAbbr] = useState("");
  const [unitCategory, setUnitCategory] = useState("");
  const [editingUnit, setEditingUnit] = useState<UnitOfMeasure | null>(null);
  const [deleteUnitId, setDeleteUnitId] = useState<string | null>(null);

  // Shipping Carrier state
  const [shippingCarriers, setShippingCarriers] = useState<ShippingCarrier[]>(mockShippingCarriers);
  const [carrierName, setCarrierName] = useState("");
  const [carrierEmail, setCarrierEmail] = useState("");
  const [carrierTrackingUrl, setCarrierTrackingUrl] = useState("");
  const [editingCarrier, setEditingCarrier] = useState<ShippingCarrier | null>(null);
  const [deleteCarrierId, setDeleteCarrierId] = useState<string | null>(null);

  // Company Settings state
  const [companyName, setCompanyName] = useState("SupplyFlow Inc.");
  const [companyAddress, setCompanyAddress] = useState("123 Business Street, Tech City");
  const [companyTaxId, setCompanyTaxId] = useState("TAX-123456");
  const [companyEmail, setCompanyEmail] = useState("contact@supplyflow.com");
  const [companyPhone, setCompanyPhone] = useState("+1 (555) 123-4567");

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

  // Tax Rate handlers
  const handleAddTaxRate = () => {
    if (!taxName.trim() || !taxRate.trim()) {
      toast({ title: "Validation Error", description: "Tax name and rate are required", variant: "destructive" });
      return;
    }
    const newTax: TaxRate = { id: String(Date.now()), name: taxName, rate: taxRate, type: taxType || "VAT" };
    setTaxRates([...taxRates, newTax]);
    setTaxName(""); setTaxRate(""); setTaxType("");
    toast({ title: "Tax Rate Added", description: `${taxName} has been added successfully.` });
  };

  const handleEditTaxRate = (tax: TaxRate) => {
    setEditingTax(tax);
    setTaxName(tax.name);
    setTaxRate(tax.rate);
    setTaxType(tax.type);
  };

  const handleUpdateTaxRate = () => {
    if (!editingTax) return;
    setTaxRates(taxRates.map((tax) => tax.id === editingTax.id ? { ...tax, name: taxName, rate: taxRate, type: taxType } : tax));
    toast({ title: "Tax Rate Updated", description: `${taxName} has been updated successfully.` });
    setEditingTax(null);
    setTaxName(""); setTaxRate(""); setTaxType("");
  };

  const handleDeleteTaxRate = () => {
    if (!deleteTaxId) return;
    setTaxRates(taxRates.filter((tax) => tax.id !== deleteTaxId));
    toast({ title: "Tax Rate Deleted", description: "Tax rate has been removed successfully.", variant: "destructive" });
    setDeleteTaxId(null);
  };

  // Payment Term handlers
  const handleAddPaymentTerm = () => {
    if (!termName.trim() || !termDays.trim()) {
      toast({ title: "Validation Error", description: "Term name and days are required", variant: "destructive" });
      return;
    }
    const newTerm: PaymentTerm = { id: String(Date.now()), name: termName, days: termDays, description: termDesc };
    setPaymentTerms([...paymentTerms, newTerm]);
    setTermName(""); setTermDays(""); setTermDesc("");
    toast({ title: "Payment Term Added", description: `${termName} has been added successfully.` });
  };

  const handleEditPaymentTerm = (term: PaymentTerm) => {
    setEditingTerm(term);
    setTermName(term.name);
    setTermDays(term.days);
    setTermDesc(term.description);
  };

  const handleUpdatePaymentTerm = () => {
    if (!editingTerm) return;
    setPaymentTerms(paymentTerms.map((term) => term.id === editingTerm.id ? { ...term, name: termName, days: termDays, description: termDesc } : term));
    toast({ title: "Payment Term Updated", description: `${termName} has been updated successfully.` });
    setEditingTerm(null);
    setTermName(""); setTermDays(""); setTermDesc("");
  };

  const handleDeletePaymentTerm = () => {
    if (!deleteTermId) return;
    setPaymentTerms(paymentTerms.filter((term) => term.id !== deleteTermId));
    toast({ title: "Payment Term Deleted", description: "Payment term has been removed successfully.", variant: "destructive" });
    setDeleteTermId(null);
  };

  // Unit of Measure handlers
  const handleAddUnit = () => {
    if (!unitName.trim() || !unitAbbr.trim()) {
      toast({ title: "Validation Error", description: "Unit name and abbreviation are required", variant: "destructive" });
      return;
    }
    const newUnit: UnitOfMeasure = { id: String(Date.now()), name: unitName, abbreviation: unitAbbr, category: unitCategory || "Other" };
    setUnitsOfMeasure([...unitsOfMeasure, newUnit]);
    setUnitName(""); setUnitAbbr(""); setUnitCategory("");
    toast({ title: "Unit Added", description: `${unitName} has been added successfully.` });
  };

  const handleEditUnit = (unit: UnitOfMeasure) => {
    setEditingUnit(unit);
    setUnitName(unit.name);
    setUnitAbbr(unit.abbreviation);
    setUnitCategory(unit.category);
  };

  const handleUpdateUnit = () => {
    if (!editingUnit) return;
    setUnitsOfMeasure(unitsOfMeasure.map((unit) => unit.id === editingUnit.id ? { ...unit, name: unitName, abbreviation: unitAbbr, category: unitCategory } : unit));
    toast({ title: "Unit Updated", description: `${unitName} has been updated successfully.` });
    setEditingUnit(null);
    setUnitName(""); setUnitAbbr(""); setUnitCategory("");
  };

  const handleDeleteUnit = () => {
    if (!deleteUnitId) return;
    setUnitsOfMeasure(unitsOfMeasure.filter((unit) => unit.id !== deleteUnitId));
    toast({ title: "Unit Deleted", description: "Unit of measure has been removed successfully.", variant: "destructive" });
    setDeleteUnitId(null);
  };

  // Shipping Carrier handlers
  const handleAddCarrier = () => {
    if (!carrierName.trim()) {
      toast({ title: "Validation Error", description: "Carrier name is required", variant: "destructive" });
      return;
    }
    const newCarrier: ShippingCarrier = { id: String(Date.now()), name: carrierName, contactEmail: carrierEmail, trackingUrl: carrierTrackingUrl };
    setShippingCarriers([...shippingCarriers, newCarrier]);
    setCarrierName(""); setCarrierEmail(""); setCarrierTrackingUrl("");
    toast({ title: "Carrier Added", description: `${carrierName} has been added successfully.` });
  };

  const handleEditCarrier = (carrier: ShippingCarrier) => {
    setEditingCarrier(carrier);
    setCarrierName(carrier.name);
    setCarrierEmail(carrier.contactEmail);
    setCarrierTrackingUrl(carrier.trackingUrl);
  };

  const handleUpdateCarrier = () => {
    if (!editingCarrier) return;
    setShippingCarriers(shippingCarriers.map((carrier) => carrier.id === editingCarrier.id ? { ...carrier, name: carrierName, contactEmail: carrierEmail, trackingUrl: carrierTrackingUrl } : carrier));
    toast({ title: "Carrier Updated", description: `${carrierName} has been updated successfully.` });
    setEditingCarrier(null);
    setCarrierName(""); setCarrierEmail(""); setCarrierTrackingUrl("");
  };

  const handleDeleteCarrier = () => {
    if (!deleteCarrierId) return;
    setShippingCarriers(shippingCarriers.filter((carrier) => carrier.id !== deleteCarrierId));
    toast({ title: "Carrier Deleted", description: "Shipping carrier has been removed successfully.", variant: "destructive" });
    setDeleteCarrierId(null);
  };

  const handleSaveCompanySettings = () => {
    toast({ title: "Settings Saved", description: "Company settings have been updated successfully." });
  };

  return (
    <PageBackground>
      <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-muted-foreground mt-1">Manage categories, locations, and product types</p>
          </div>
        </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid grid-cols-3 lg:grid-cols-8 gap-2">
          <TabsTrigger value="company">
            <Building2 className="h-4 w-4 mr-2" />
            <span className="hidden lg:inline">Company</span>
          </TabsTrigger>
          <TabsTrigger value="categories">
            <Package className="h-4 w-4 mr-2" />
            <span className="hidden lg:inline">Categories</span>
          </TabsTrigger>
          <TabsTrigger value="locations">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="hidden lg:inline">Locations</span>
          </TabsTrigger>
          <TabsTrigger value="product-types">
            <Tag className="h-4 w-4 mr-2" />
            <span className="hidden lg:inline">Product Types</span>
          </TabsTrigger>
          <TabsTrigger value="tax-rates">
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden lg:inline">Tax Rates</span>
          </TabsTrigger>
          <TabsTrigger value="payment-terms">
            <DollarSign className="h-4 w-4 mr-2" />
            <span className="hidden lg:inline">Payment Terms</span>
          </TabsTrigger>
          <TabsTrigger value="units">
            <Scale className="h-4 w-4 mr-2" />
            <span className="hidden lg:inline">Units</span>
          </TabsTrigger>
          <TabsTrigger value="carriers">
            <Package className="h-4 w-4 mr-2" />
            <span className="hidden lg:inline">Carriers</span>
          </TabsTrigger>
        </TabsList>

        {/* Company Settings Tab */}
        <TabsContent value="company" className="space-y-6">
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name *</Label>
                  <Input id="company-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">Email Address</Label>
                  <Input id="company-email" type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Phone Number</Label>
                  <Input id="company-phone" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-tax-id">Tax ID / Registration Number</Label>
                  <Input id="company-tax-id" value={companyTaxId} onChange={(e) => setCompanyTaxId(e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="company-address">Address</Label>
                  <Input id="company-address" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
                </div>
              </div>
              <Button onClick={handleSaveCompanySettings}>
                Save Company Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

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

        {/* Tax Rates Tab */}
        <TabsContent value="tax-rates" className="space-y-6">
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">{editingTax ? "Edit Tax Rate" : "Add New Tax Rate"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="tax-name">Tax Name *</Label>
                  <Input id="tax-name" value={taxName} onChange={(e) => setTaxName(e.target.value)} placeholder="e.g., Standard VAT" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Rate (%) *</Label>
                  <Input id="tax-rate" type="number" step="0.01" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} placeholder="e.g., 20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-type">Tax Type</Label>
                  <Input id="tax-type" value={taxType} onChange={(e) => setTaxType(e.target.value)} placeholder="e.g., VAT, Sales Tax" />
                </div>
              </div>
              <div className="flex gap-2">
                {editingTax ? (
                  <>
                    <Button onClick={handleUpdateTaxRate} disabled={!taxName.trim() || !taxRate.trim()}>Update Tax Rate</Button>
                    <Button variant="outline" onClick={() => { setEditingTax(null); setTaxName(""); setTaxRate(""); setTaxType(""); }}>Cancel</Button>
                  </>
                ) : (
                  <Button onClick={handleAddTaxRate} disabled={!taxName.trim() || !taxRate.trim()}><Plus className="h-4 w-4 mr-2" />Add Tax Rate</Button>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Existing Tax Rates</h3>
              <div className="space-y-3">
                {taxRates.map((tax, index) => (
                  <div key={tax.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-all" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{tax.name}</h4>
                        <Badge variant="secondary">{tax.rate}%</Badge>
                        <Badge variant="outline">{tax.type}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditTaxRate(tax)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteTaxId(tax.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Terms Tab */}
        <TabsContent value="payment-terms" className="space-y-6">
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">{editingTerm ? "Edit Payment Term" : "Add New Payment Term"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="term-name">Term Name *</Label>
                  <Input id="term-name" value={termName} onChange={(e) => setTermName(e.target.value)} placeholder="e.g., Net 30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="term-days">Days *</Label>
                  <Input id="term-days" type="number" value={termDays} onChange={(e) => setTermDays(e.target.value)} placeholder="e.g., 30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="term-desc">Description</Label>
                  <Input id="term-desc" value={termDesc} onChange={(e) => setTermDesc(e.target.value)} placeholder="Payment description" />
                </div>
              </div>
              <div className="flex gap-2">
                {editingTerm ? (
                  <>
                    <Button onClick={handleUpdatePaymentTerm} disabled={!termName.trim() || !termDays.trim()}>Update Term</Button>
                    <Button variant="outline" onClick={() => { setEditingTerm(null); setTermName(""); setTermDays(""); setTermDesc(""); }}>Cancel</Button>
                  </>
                ) : (
                  <Button onClick={handleAddPaymentTerm} disabled={!termName.trim() || !termDays.trim()}><Plus className="h-4 w-4 mr-2" />Add Payment Term</Button>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Existing Payment Terms</h3>
              <div className="space-y-3">
                {paymentTerms.map((term, index) => (
                  <div key={term.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-all" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{term.name}</h4>
                        <Badge variant="secondary">{term.days} days</Badge>
                      </div>
                      {term.description && <p className="text-sm text-muted-foreground">{term.description}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditPaymentTerm(term)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteTermId(term.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Units of Measure Tab */}
        <TabsContent value="units" className="space-y-6">
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">{editingUnit ? "Edit Unit" : "Add New Unit of Measure"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="unit-name">Unit Name *</Label>
                  <Input id="unit-name" value={unitName} onChange={(e) => setUnitName(e.target.value)} placeholder="e.g., Kilogram" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit-abbr">Abbreviation *</Label>
                  <Input id="unit-abbr" value={unitAbbr} onChange={(e) => setUnitAbbr(e.target.value)} placeholder="e.g., kg" maxLength={10} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit-category">Category</Label>
                  <Input id="unit-category" value={unitCategory} onChange={(e) => setUnitCategory(e.target.value)} placeholder="e.g., Weight, Length" />
                </div>
              </div>
              <div className="flex gap-2">
                {editingUnit ? (
                  <>
                    <Button onClick={handleUpdateUnit} disabled={!unitName.trim() || !unitAbbr.trim()}>Update Unit</Button>
                    <Button variant="outline" onClick={() => { setEditingUnit(null); setUnitName(""); setUnitAbbr(""); setUnitCategory(""); }}>Cancel</Button>
                  </>
                ) : (
                  <Button onClick={handleAddUnit} disabled={!unitName.trim() || !unitAbbr.trim()}><Plus className="h-4 w-4 mr-2" />Add Unit</Button>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Existing Units of Measure</h3>
              <div className="space-y-3">
                {unitsOfMeasure.map((unit, index) => (
                  <div key={unit.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-all" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{unit.name}</h4>
                        <Badge variant="secondary" className="font-mono">{unit.abbreviation}</Badge>
                        <Badge variant="outline">{unit.category}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditUnit(unit)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteUnitId(unit.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Carriers Tab */}
        <TabsContent value="carriers" className="space-y-6">
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">{editingCarrier ? "Edit Carrier" : "Add New Shipping Carrier"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="carrier-name">Carrier Name *</Label>
                  <Input id="carrier-name" value={carrierName} onChange={(e) => setCarrierName(e.target.value)} placeholder="e.g., FedEx" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carrier-email">Contact Email</Label>
                  <Input id="carrier-email" type="email" value={carrierEmail} onChange={(e) => setCarrierEmail(e.target.value)} placeholder="support@carrier.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carrier-tracking">Tracking URL</Label>
                  <Input id="carrier-tracking" value={carrierTrackingUrl} onChange={(e) => setCarrierTrackingUrl(e.target.value)} placeholder="https://..." />
                </div>
              </div>
              <div className="flex gap-2">
                {editingCarrier ? (
                  <>
                    <Button onClick={handleUpdateCarrier} disabled={!carrierName.trim()}>Update Carrier</Button>
                    <Button variant="outline" onClick={() => { setEditingCarrier(null); setCarrierName(""); setCarrierEmail(""); setCarrierTrackingUrl(""); }}>Cancel</Button>
                  </>
                ) : (
                  <Button onClick={handleAddCarrier} disabled={!carrierName.trim()}><Plus className="h-4 w-4 mr-2" />Add Carrier</Button>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Existing Shipping Carriers</h3>
              <div className="space-y-3">
                {shippingCarriers.map((carrier, index) => (
                  <div key={carrier.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-all" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{carrier.name}</h4>
                      <div className="space-y-1">
                        {carrier.contactEmail && <p className="text-sm text-muted-foreground">📧 {carrier.contactEmail}</p>}
                        {carrier.trackingUrl && <p className="text-sm text-muted-foreground break-all">🔗 {carrier.trackingUrl}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditCarrier(carrier)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteCarrierId(carrier.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Dialogs */}
      <AlertDialog open={!!deleteTaxId} onOpenChange={() => setDeleteTaxId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tax Rate</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this tax rate? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTaxRate} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteTermId} onOpenChange={() => setDeleteTermId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment Term</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this payment term? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePaymentTerm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteUnitId} onOpenChange={() => setDeleteUnitId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Unit of Measure</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this unit? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUnit} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteCarrierId} onOpenChange={() => setDeleteCarrierId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Shipping Carrier</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this carrier? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCarrier} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
