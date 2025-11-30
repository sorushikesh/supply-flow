import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { PageBackground } from "@/components/PageBackground";
import { SearchFilter } from "@/components/SearchFilter";
import { DataTable, type Column } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Users, Mail, Phone } from "lucide-react";

// todo: remove mock functionality
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

const mockCustomers: Customer[] = [
  { id: "1", code: "C-001", name: "TechStart Inc", email: "orders@techstart.com", phone: "+1 555-0201", address: "100 Innovation Blvd, Tech City", creditLimit: 50000, totalOrders: 67, totalRevenue: 234500, status: "active" },
  { id: "2", code: "C-002", name: "Metro Retail Group", email: "purchasing@metroretail.com", phone: "+1 555-0202", address: "200 Shopping Center, Mall Town", creditLimit: 100000, totalOrders: 89, totalRevenue: 456000, status: "active" },
  { id: "3", code: "C-003", name: "City Stores Ltd", email: "supply@citystores.com", phone: "+1 555-0203", address: "300 Main Street, Downtown", creditLimit: 75000, totalOrders: 45, totalRevenue: 178900, status: "active" },
  { id: "4", code: "C-004", name: "Regional Distributors", email: "orders@regionaldist.com", phone: "+1 555-0204", address: "400 Highway Road, Suburb", creditLimit: 25000, totalOrders: 23, totalRevenue: 67800, status: "inactive" },
  { id: "5", code: "C-005", name: "Express Outlets", email: "buy@expressoutlets.com", phone: "+1 555-0205", address: "500 Fast Lane, Commerce Park", creditLimit: 150000, totalOrders: 112, totalRevenue: 567000, status: "active" },
  { id: "6", code: "C-006", name: "Wholesale Partners", email: "orders@wholesalepartners.com", phone: "+1 555-0206", address: "600 Bulk Blvd, Industrial Zone", creditLimit: 200000, totalOrders: 78, totalRevenue: 345600, status: "active" },
];

export default function Customers() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
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
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-muted">
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="font-medium">{customer.name}</span>
        </div>
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
      <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
        <PageHeader
        title="Customers"
        description="Manage your customer relationships"
        actionLabel="Add Customer"
        onAction={() => setModalOpen(true)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Total Customers
            </p>
            <p className="text-2xl font-bold mt-1">{mockCustomers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Active Customers
            </p>
            <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
              {activeCustomers}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Total Revenue
            </p>
            <p className="text-2xl font-bold mt-1 font-mono">
              ${totalRevenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
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
      </div>
    </PageBackground>
  );
}
