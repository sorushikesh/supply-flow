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
import { Users, Mail, Phone, Package, ShoppingCart, Calendar, DollarSign, TrendingUp } from "lucide-react";

interface Customer {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  creditLimit: number;
  totalOrders: number;
  totalRevenue: number;
  status: "active" | "inactive";
}

interface PurchaseHistoryItem {
  id: string;
  orderNumber: string;
  date: string;
  products: { name: string; sku: string; quantity: number; unitPrice: number }[];
  totalAmount: number;
  status: "delivered" | "pending" | "cancelled";
}

const mockCustomers: Customer[] = [
  { id: "1", code: "C-001", name: "TechStart Inc", email: "orders@techstart.com", phone: "+1 555-0201", address: "100 Innovation Blvd, Tech City", creditLimit: 50000, totalOrders: 67, totalRevenue: 234500, status: "active" },
  { id: "2", code: "C-002", name: "Metro Retail Group", email: "purchasing@metroretail.com", phone: "+1 555-0202", address: "200 Shopping Center, Mall Town", creditLimit: 100000, totalOrders: 89, totalRevenue: 456000, status: "active" },
  { id: "3", code: "C-003", name: "City Stores Ltd", email: "supply@citystores.com", phone: "+1 555-0203", address: "300 Main Street, Downtown", creditLimit: 75000, totalOrders: 45, totalRevenue: 178900, status: "active" },
  { id: "4", code: "C-004", name: "Regional Distributors", email: "orders@regionaldist.com", phone: "+1 555-0204", address: "400 Highway Road, Suburb", creditLimit: 25000, totalOrders: 23, totalRevenue: 67800, status: "inactive" },
  { id: "5", code: "C-005", name: "Express Outlets", email: "buy@expressoutlets.com", phone: "+1 555-0205", address: "500 Fast Lane, Commerce Park", creditLimit: 150000, totalOrders: 112, totalRevenue: 567000, status: "active" },
  { id: "6", code: "C-006", name: "Wholesale Partners", email: "orders@wholesalepartners.com", phone: "+1 555-0206", address: "600 Bulk Blvd, Industrial Zone", creditLimit: 200000, totalOrders: 78, totalRevenue: 345600, status: "active" },
  { id: "7", code: "C-007", name: "Prime Electronics", email: "buying@primeelec.com", phone: "+1 555-0207", address: "700 Circuit Ave, Silicon Valley", creditLimit: 120000, totalOrders: 94, totalRevenue: 412300, status: "active" },
  { id: "8", code: "C-008", name: "Global Trade Corp", email: "orders@globaltrade.com", phone: "+1 555-0208", address: "800 International Blvd, Trade Hub", creditLimit: 180000, totalOrders: 156, totalRevenue: 687500, status: "active" },
  { id: "9", code: "C-009", name: "Downtown Supermarket", email: "procurement@downtown.com", phone: "+1 555-0209", address: "900 Market Street, City Center", creditLimit: 65000, totalOrders: 38, totalRevenue: 145800, status: "active" },
  { id: "10", code: "C-010", name: "Coastal Distributors", email: "supply@coastal.com", phone: "+1 555-0210", address: "1000 Seaside Road, Port City", creditLimit: 45000, totalOrders: 29, totalRevenue: 89700, status: "active" },
  { id: "11", code: "C-011", name: "Mountain Retail Chain", email: "orders@mountainretail.com", phone: "+1 555-0211", address: "1100 Alpine Drive, Highland", creditLimit: 90000, totalOrders: 61, totalRevenue: 267400, status: "active" },
  { id: "12", code: "C-012", name: "Urban Solutions LLC", email: "purchasing@urbansolutions.com", phone: "+1 555-0212", address: "1200 Metro Plaza, Uptown", creditLimit: 55000, totalOrders: 42, totalRevenue: 198600, status: "active" },
  { id: "13", code: "C-013", name: "Sunset Trading Co", email: "orders@sunsettrading.com", phone: "+1 555-0213", address: "1300 Western Ave, Beach Town", creditLimit: 40000, totalOrders: 18, totalRevenue: 56900, status: "inactive" },
  { id: "14", code: "C-014", name: "Northern Supplies", email: "buy@northernsupplies.com", phone: "+1 555-0214", address: "1400 Polar Street, North City", creditLimit: 70000, totalOrders: 53, totalRevenue: 223100, status: "active" },
  { id: "15", code: "C-015", name: "Eastern Markets", email: "procurement@easternmarkets.com", phone: "+1 555-0215", address: "1500 Sunrise Blvd, East District", creditLimit: 110000, totalOrders: 87, totalRevenue: 398200, status: "active" },
  { id: "16", code: "C-016", name: "Central Warehouse Hub", email: "orders@centralwh.com", phone: "+1 555-0216", address: "1600 Storage Lane, Midtown", creditLimit: 135000, totalOrders: 103, totalRevenue: 512800, status: "active" },
  { id: "17", code: "C-017", name: "Southwest Commerce", email: "supply@swcommerce.com", phone: "+1 555-0217", address: "1700 Desert Road, Southwest", creditLimit: 30000, totalOrders: 21, totalRevenue: 72400, status: "inactive" },
  { id: "18", code: "C-018", name: "Pacific Retailers", email: "orders@pacificretailers.com", phone: "+1 555-0218", address: "1800 Ocean Drive, Coastal City", creditLimit: 95000, totalOrders: 74, totalRevenue: 334500, status: "active" },
];

const mockPurchaseHistory: Record<string, PurchaseHistoryItem[]> = {
  "1": [
    {
      id: "1",
      orderNumber: "SO-2024-0098",
      date: "2024-11-25",
      products: [
        { name: "Widget Alpha", sku: "WDG-001", quantity: 50, unitPrice: 125.00 },
        { name: "Gadget Pro", sku: "GDG-023", quantity: 30, unitPrice: 89.99 },
      ],
      totalAmount: 8949.70,
      status: "delivered"
    },
    {
      id: "2",
      orderNumber: "SO-2024-0087",
      date: "2024-11-18",
      products: [
        { name: "Component X", sku: "CMP-045", quantity: 100, unitPrice: 45.50 },
        { name: "Widget Beta", sku: "WDG-002", quantity: 75, unitPrice: 98.00 },
      ],
      totalAmount: 11900.00,
      status: "delivered"
    },
    {
      id: "3",
      orderNumber: "SO-2024-0076",
      date: "2024-11-10",
      products: [
        { name: "Device Ultra", sku: "DEV-100", quantity: 25, unitPrice: 275.00 },
      ],
      totalAmount: 6875.00,
      status: "delivered"
    },
  ],
  "2": [
    {
      id: "4",
      orderNumber: "SO-2024-0125",
      date: "2024-11-28",
      products: [
        { name: "Widget Alpha", sku: "WDG-001", quantity: 200, unitPrice: 125.00 },
        { name: "Component X", sku: "CMP-045", quantity: 150, unitPrice: 45.50 },
      ],
      totalAmount: 31825.00,
      status: "pending"
    },
    {
      id: "5",
      orderNumber: "SO-2024-0115",
      date: "2024-11-22",
      products: [
        { name: "Gadget Pro", sku: "GDG-023", quantity: 100, unitPrice: 89.99 },
        { name: "Widget Beta", sku: "WDG-002", quantity: 80, unitPrice: 98.00 },
      ],
      totalAmount: 16839.00,
      status: "delivered"
    },
  ],
};

export default function Customers() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    creditLimit: "",
  });

  const filteredData = mockCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.code.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || customer.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const columns: Column<Customer>[] = [
    { key: "code", header: "Code", className: "font-mono text-sm" },
    {
      key: "name",
      header: "Customer Name",
      render: (customer) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                setSelectedCustomer(customer);
                setDetailsOpen(true);
              }}
              className="flex items-center gap-2 hover:text-primary transition-colors text-left"
            >
              <div className="p-1.5 rounded bg-muted">
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="font-medium underline decoration-transparent hover:decoration-current transition-all">
                {customer.name}
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-semibold">{customer.name}</p>
              <p className="text-xs text-muted-foreground">Code: {customer.code}</p>
              <p className="text-xs text-muted-foreground">Status: {customer.status}</p>
              <p className="text-xs text-muted-foreground">Total Orders: {customer.totalOrders}</p>
              <p className="text-xs">Click to view full details</p>
            </div>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      key: "email",
      header: "Contact",
      render: (customer) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <Mail className="h-3 w-3 text-muted-foreground" />
            {customer.email}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Phone className="h-3 w-3" />
            {customer.phone}
          </div>
        </div>
      ),
    },
    {
      key: "creditLimit",
      header: "Credit Limit",
      className: "text-right font-mono",
      render: (customer) => `$${customer.creditLimit.toLocaleString()}`,
    },
    {
      key: "totalOrders",
      header: "Orders",
      className: "text-right font-mono",
    },
    {
      key: "totalRevenue",
      header: "Total Revenue",
      className: "text-right font-mono",
      render: (customer) => `$${customer.totalRevenue.toLocaleString()}`,
    },
    {
      key: "status",
      header: "Status",
      render: (customer) => (
        <Badge variant={customer.status === "active" ? "default" : "secondary"}>
          {customer.status === "active" ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  const handleSubmit = () => {
    toast({
      title: "Customer Added",
      description: `${formData.name} has been added to your customers.`,
    });
    setModalOpen(false);
    setFormData({ name: "", email: "", phone: "", address: "", creditLimit: "" });
  };

  const totalRevenue = mockCustomers.reduce((sum, c) => sum + c.totalRevenue, 0);
  const activeCustomers = mockCustomers.filter((c) => c.status === "active").length;

  return (
    <PageBackground>
      <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Customers
            </h1>
            <p className="text-muted-foreground mt-1">Manage your customer relationships</p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="gap-2">
            <Users className="h-4 w-4" />
            Add Customer
          </Button>
        </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Total Customers</p>
            <p className="text-2xl font-bold mt-1">{mockCustomers.length}</p>
          </CardContent>
        </Card>
        <Card className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Active Customers</p>
            <p className="text-2xl font-bold mt-1 text-green-600">{activeCustomers}</p>
          </CardContent>
        </Card>
        <Card className="border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Total Revenue</p>
            <p className="text-2xl font-bold mt-1 font-mono">${totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <SearchFilter
            searchPlaceholder="Search customers..."
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
            testIdPrefix="customers"
          />
        </CardContent>
      </Card>
      </div>

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Add New Customer"
        description="Enter the customer's details below."
        onSubmit={handleSubmit}
        submitLabel="Add Customer"
      >
        {/* Customer Information Section */}
        <div className="space-y-4">
          <div className="pb-2 border-b">
            <h3 className="text-sm font-semibold text-foreground">Customer Information</h3>
            <p className="text-xs text-muted-foreground mt-1">Basic customer details</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1">
              Company Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., TechStart Inc"
              data-testid="input-customer-name"
              className="transition-all duration-200"
            />
            <p className="text-xs text-muted-foreground">Full name or company name</p>
          </div>
        </div>

        {/* Contact Details Section */}
        <div className="space-y-4 pt-4">
          <div className="pb-2 border-b">
            <h3 className="text-sm font-semibold text-foreground">Contact Details</h3>
            <p className="text-xs text-muted-foreground mt-1">How to reach the customer</p>
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
                placeholder="orders@company.com"
                data-testid="input-customer-email"
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
                placeholder="+1 555-0200"
                data-testid="input-customer-phone"
                className="transition-all duration-200"
              />
              <p className="text-xs text-muted-foreground">Contact phone number</p>
            </div>
          </div>
        </div>

        {/* Address & Credit Section */}
        <div className="space-y-4 pt-4">
          <div className="pb-2 border-b">
            <h3 className="text-sm font-semibold text-foreground">Address & Credit</h3>
            <p className="text-xs text-muted-foreground mt-1">Location and payment details</p>
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
                data-testid="input-customer-address"
                className="resize-none transition-all duration-200"
              />
              <p className="text-xs text-muted-foreground">Shipping or billing address</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="creditLimit" className="text-sm font-medium">
                Credit Limit
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input
                  id="creditLimit"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.creditLimit}
                  onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                  placeholder="50000"
                  data-testid="input-credit-limit"
                  className="pl-7 transition-all duration-200"
                />
              </div>
              <p className="text-xs text-muted-foreground">Maximum credit allowed</p>
            </div>
          </div>
        </div>
      </FormModal>

      {/* Customer Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              {selectedCustomer?.name}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="font-mono text-xs">{selectedCustomer?.code}</Badge>
              <span className="text-xs text-muted-foreground">•</span>
              <Badge variant={selectedCustomer?.status === "active" ? "default" : "secondary"}>
                {selectedCustomer?.status === "active" ? "Active Customer" : "Inactive"}
              </Badge>
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="history">Purchase History</TabsTrigger>
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
                      <p className="font-medium">{selectedCustomer?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="p-2 rounded-md bg-background">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Phone Number</p>
                      <p className="font-medium">{selectedCustomer?.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="p-2 rounded-md bg-background">
                      <Package className="h-4 w-4 text-primary mt-0.5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Address</p>
                      <p className="font-medium">{selectedCustomer?.address}</p>
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
                    <p className="text-3xl font-bold">{selectedCustomer?.totalOrders}</p>
                    <p className="text-xs text-muted-foreground mt-1">Lifetime orders</p>
                  </CardContent>
                </Card>
                <Card className="border-green-500/20 hover:border-green-500/40 transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Revenue</p>
                    </div>
                    <p className="text-3xl font-bold font-mono text-green-600">
                      ${selectedCustomer?.totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Lifetime value</p>
                  </CardContent>
                </Card>
                <Card className="border-purple-500/20 hover:border-purple-500/40 transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <DollarSign className="h-4 w-4 text-purple-600" />
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Credit Limit</p>
                    </div>
                    <p className="text-3xl font-bold font-mono">
                      ${selectedCustomer?.creditLimit.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Available credit</p>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 hover:border-primary/40 transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</p>
                    </div>
                    <Badge 
                      variant={selectedCustomer?.status === "active" ? "default" : "secondary"}
                      className="text-sm px-3 py-1"
                    >
                      {selectedCustomer?.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">Account status</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {selectedCustomer && mockPurchaseHistory[selectedCustomer.id] ? (
                <div className="space-y-4">
                  {mockPurchaseHistory[selectedCustomer.id].map((order) => (
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
                              order.status === "delivered" ? "default" : 
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
                      No purchase history available
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      This customer hasn't placed any orders yet
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
