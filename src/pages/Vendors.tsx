import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SearchFilter } from "@/components/SearchFilter";
import { DataTable, type Column } from "@/components/DataTable";
import { FormModal } from "@/components/FormModal";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building2, Mail, Phone } from "lucide-react";

// todo: remove mock functionality
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

const mockVendors: Vendor[] = [
  { id: "1", code: "V-001", name: "Acme Corporation", email: "sales@acme.com", phone: "+1 555-0101", address: "123 Industrial Ave, City", paymentTerms: "Net 30", totalOrders: 45, totalSpent: 156000, status: "active" },
  { id: "2", code: "V-002", name: "Global Supply Co", email: "orders@globalsupply.com", phone: "+1 555-0102", address: "456 Commerce St, Town", paymentTerms: "Net 45", totalOrders: 32, totalSpent: 89500, status: "active" },
  { id: "3", code: "V-003", name: "Quality Parts Inc", email: "info@qualityparts.com", phone: "+1 555-0103", address: "789 Factory Rd, Village", paymentTerms: "Net 15", totalOrders: 28, totalSpent: 67800, status: "active" },
  { id: "4", code: "V-004", name: "Prime Materials Ltd", email: "contact@primematerials.com", phone: "+1 555-0104", address: "321 Supply Lane, Metro", paymentTerms: "Net 30", totalOrders: 18, totalSpent: 45200, status: "inactive" },
  { id: "5", code: "V-005", name: "Tech Components", email: "orders@techcomp.com", phone: "+1 555-0105", address: "654 Tech Park, Hub", paymentTerms: "Net 60", totalOrders: 56, totalSpent: 234000, status: "active" },
];

export default function Vendors() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
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
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-muted">
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="font-medium">{vendor.name}</span>
        </div>
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
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Vendors"
        description="Manage your supplier relationships"
        actionLabel="Add Vendor"
        onAction={() => setModalOpen(true)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Total Vendors
            </p>
            <p className="text-2xl font-bold mt-1">{mockVendors.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Active Vendors
            </p>
            <p className="text-2xl font-bold mt-1 text-green-600">
              {activeVendors}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Total Spent
            </p>
            <p className="text-2xl font-bold mt-1 font-mono">
              ${totalSpent.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
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
            onRowClick={(vendor) => setSelectedVendor(vendor)}
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
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Acme Corporation"
              data-testid="input-vendor-name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sales@company.com"
                data-testid="input-vendor-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 555-0100"
                data-testid="input-vendor-phone"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full address"
              rows={2}
              data-testid="input-vendor-address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Input
              id="paymentTerms"
              value={formData.paymentTerms}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              placeholder="e.g., Net 30"
              data-testid="input-payment-terms"
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
