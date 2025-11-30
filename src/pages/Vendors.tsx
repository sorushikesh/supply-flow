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
import { Building2, Mail, Phone, Package, ShoppingCart, Calendar, DollarSign, TrendingDown } from "lucide-react";

interface Vendor {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive";
}

interface PurchaseOrderHistory {
  id: string;
  orderNumber: string;
  date: string;
  products: { name: string; sku: string; quantity: number; unitPrice: number }[];
  totalAmount: number;
  status: "completed" | "pending" | "cancelled";
}

const mockVendors: Vendor[] = [
  { id: "1", code: "V-001", name: "Acme Corporation", email: "sales@acme.com", phone: "+1 555-0101", address: "123 Industrial Ave, City", paymentTerms: "Net 30", totalOrders: 45, totalSpent: 156000, status: "active" },
  { id: "2", code: "V-002", name: "Global Supply Co", email: "orders@globalsupply.com", phone: "+1 555-0102", address: "456 Commerce St, Town", paymentTerms: "Net 45", totalOrders: 32, totalSpent: 89500, status: "active" },
  { id: "3", code: "V-003", name: "Quality Parts Inc", email: "info@qualityparts.com", phone: "+1 555-0103", address: "789 Factory Rd, Village", paymentTerms: "Net 15", totalOrders: 28, totalSpent: 67800, status: "active" },
  { id: "4", code: "V-004", name: "Prime Materials Ltd", email: "contact@primematerials.com", phone: "+1 555-0104", address: "321 Supply Lane, Metro", paymentTerms: "Net 30", totalOrders: 18, totalSpent: 45200, status: "inactive" },
  { id: "5", code: "V-005", name: "Tech Components", email: "orders@techcomp.com", phone: "+1 555-0105", address: "654 Tech Park, Hub", paymentTerms: "Net 60", totalOrders: 56, totalSpent: 234000, status: "active" },
  { id: "6", code: "V-006", name: "Supreme Electronics", email: "sales@supremeelec.com", phone: "+1 555-0106", address: "987 Circuit Blvd, Tech City", paymentTerms: "Net 30", totalOrders: 41, totalSpent: 178900, status: "active" },
  { id: "7", code: "V-007", name: "Mega Manufacturing", email: "orders@megamfg.com", phone: "+1 555-0107", address: "246 Factory Lane, Industrial Zone", paymentTerms: "Net 45", totalOrders: 63, totalSpent: 289400, status: "active" },
  { id: "8", code: "V-008", name: "Alpha Distributors", email: "info@alphadist.com", phone: "+1 555-0108", address: "135 Warehouse Way, Distribution Hub", paymentTerms: "Net 20", totalOrders: 37, totalSpent: 123700, status: "active" },
  { id: "9", code: "V-009", name: "Beta Supplies Ltd", email: "sales@betasupplies.com", phone: "+1 555-0109", address: "579 Supply Road, Business Park", paymentTerms: "Net 30", totalOrders: 29, totalSpent: 98600, status: "active" },
  { id: "10", code: "V-010", name: "Gamma Industries", email: "orders@gammaindustries.com", phone: "+1 555-0110", address: "802 Production Ave, Factory District", paymentTerms: "Net 60", totalOrders: 48, totalSpent: 201500, status: "active" },
  { id: "11", code: "V-011", name: "Delta Components", email: "contact@deltacomp.com", phone: "+1 555-0111", address: "913 Component St, Tech Valley", paymentTerms: "Net 30", totalOrders: 22, totalSpent: 76800, status: "inactive" },
  { id: "12", code: "V-012", name: "Epsilon Materials", email: "sales@epsilonmaterials.com", phone: "+1 555-0112", address: "1024 Material Blvd, Industrial Park", paymentTerms: "Net 45", totalOrders: 54, totalSpent: 245300, status: "active" },
  { id: "13", code: "V-013", name: "Zeta Trading Co", email: "orders@zetatrading.com", phone: "+1 555-0113", address: "1135 Trade Center, Commerce District", paymentTerms: "Net 15", totalOrders: 34, totalSpent: 112400, status: "active" },
  { id: "14", code: "V-014", name: "Theta Wholesale", email: "info@thetawholesale.com", phone: "+1 555-0114", address: "1246 Wholesale Plaza, Market Zone", paymentTerms: "Net 30", totalOrders: 44, totalSpent: 167900, status: "active" },
  { id: "15", code: "V-015", name: "Omega Solutions", email: "sales@omegasolutions.com", phone: "+1 555-0115", address: "1357 Solution Drive, Business Hub", paymentTerms: "Net 60", totalOrders: 58, totalSpent: 278600, status: "active" },
];

const mockPurchaseOrders: Record<string, PurchaseOrderHistory[]> = {
  "1": [
    {
      id: "1",
      orderNumber: "PO-2024-0045",
      date: "2024-11-20",
      products: [
        { name: "Widget Alpha", sku: "WDG-001", quantity: 200, unitPrice: 22.50 },
        { name: "Component X", sku: "CMP-045", quantity: 500, unitPrice: 8.75 },
      ],
      totalAmount: 8875.00,
      status: "completed"
    },
    {
      id: "2",
      orderNumber: "PO-2024-0038",
      date: "2024-11-10",
      products: [
        { name: "Widget Beta", sku: "WDG-002", quantity: 150, unitPrice: 28.00 },
      ],
      totalAmount: 4200.00,
      status: "completed"
    },
    {
      id: "3",
      orderNumber: "PO-2024-0029",
      date: "2024-11-01",
      products: [
        { name: "Gadget Pro", sku: "GDG-023", quantity: 100, unitPrice: 125.00 },
        { name: "Accessory Pack", sku: "ACC-001", quantity: 200, unitPrice: 12.50 },
      ],
      totalAmount: 15000.00,
      status: "completed"
    },
  ],
  "2": [
    {
      id: "4",
      orderNumber: "PO-2024-0042",
      date: "2024-11-18",
      products: [
        { name: "Component Y", sku: "CMP-046", quantity: 1000, unitPrice: 6.50 },
      ],
      totalAmount: 6500.00,
      status: "pending"
    },
    {
      id: "5",
      orderNumber: "PO-2024-0035",
      date: "2024-11-08",
      products: [
        { name: "Device Ultra", sku: "DEV-100", quantity: 50, unitPrice: 220.00 },
        { name: "Widget Gamma", sku: "WDG-003", quantity: 75, unitPrice: 38.00 },
      ],
      totalAmount: 13850.00,
      status: "completed"
    },
  ],
};

export default function Vendors() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
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

  const columns: Column<Vendor>[] = [
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

  const totalSpent = mockVendors.reduce((sum, v) => sum + v.totalSpent, 0);
  const activeVendors = mockVendors.filter((v) => v.status === "active").length;

  return (
    <PageBackground>
      <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Vendors
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage your supplier relationships</p>
          </div>
          <Button 
            onClick={() => setModalOpen(true)} 
            className="gap-2 hover:shadow-lg hover:scale-105 transition-all duration-200"
            aria-label="Add new vendor"
          >
            <Building2 className="h-4 w-4" />
            Add Vendor
          </Button>
        </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-primary/20 hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Total Vendors</p>
            <p className="text-2xl font-bold mt-1" aria-label={`${mockVendors.length} total vendors`}>{mockVendors.length}</p>
          </CardContent>
        </Card>
        <Card className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent hover:border-green-500/50 hover:shadow-md transition-all duration-200 cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Building2 className="h-4 w-4 text-green-500" aria-hidden="true" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Active Vendors</p>
            <p className="text-2xl font-bold mt-1 text-green-600" aria-label={`${activeVendors} active vendors`}>{activeVendors}</p>
          </CardContent>
        </Card>
        <Card className="border-blue-500/20 hover:border-blue-500/40 hover:shadow-md transition-all duration-200 cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-4 w-4 text-blue-500" aria-hidden="true" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Total Spent</p>
            <p className="text-2xl font-bold mt-1 font-mono" aria-label={`Total spent $${totalSpent.toLocaleString()}`}>${totalSpent.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <SearchFilter
            searchPlaceholder="Search vendors..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={[
              {
                key: "status",
                label: "Status",
                options: [
                  { value: "All", label: "All Status" },
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                ],
                value: statusFilter,
                onChange: setStatusFilter,
              },
            ]}
          />

          <DataTable
            columns={columns}
            data={filteredData}
            testIdPrefix="vendors"
          />
        </CardContent>
      </Card>

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
      </div>
    </PageBackground>
  );
}
