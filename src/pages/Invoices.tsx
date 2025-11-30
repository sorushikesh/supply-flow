import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { PageBackground } from "@/components/PageBackground";
import { SearchFilter } from "@/components/SearchFilter";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge, type StatusType } from "@/components/StatusBadge";
import { FormModal } from "@/components/FormModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Send, Eye, DollarSign, AlertTriangle } from "lucide-react";

// todo: remove mock functionality
interface Invoice {
  id: string;
  invoiceNumber: string;
  type: "vendor" | "customer";
  party: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: StatusType;
}

const mockInvoices: Invoice[] = [
  { id: "1", invoiceNumber: "INV-2024-0100", type: "customer", party: "TechStart Inc", issueDate: "2024-01-15", dueDate: "2024-02-14", amount: 8750, paidAmount: 0, status: "pending" },
  { id: "2", invoiceNumber: "INV-2024-0099", type: "customer", party: "Metro Retail Group", issueDate: "2024-01-14", dueDate: "2024-02-13", amount: 15600, paidAmount: 15600, status: "paid" },
  { id: "3", invoiceNumber: "INV-2024-0098", type: "vendor", party: "Acme Corporation", issueDate: "2024-01-13", dueDate: "2024-02-12", amount: 12500, paidAmount: 12500, status: "paid" },
  { id: "4", invoiceNumber: "INV-2024-0097", type: "customer", party: "City Stores Ltd", issueDate: "2024-01-12", dueDate: "2024-01-27", amount: 4800, paidAmount: 0, status: "overdue" },
  { id: "5", invoiceNumber: "INV-2024-0096", type: "vendor", party: "Global Supply Co", issueDate: "2024-01-11", dueDate: "2024-02-25", amount: 8750, paidAmount: 4000, status: "partial" },
  { id: "6", invoiceNumber: "INV-2024-0095", type: "customer", party: "Express Outlets", issueDate: "2024-01-10", dueDate: "2024-02-09", amount: 23400, paidAmount: 23400, status: "paid" },
  { id: "7", invoiceNumber: "INV-2024-0089", type: "customer", party: "Beta Industries", issueDate: "2024-01-01", dueDate: "2024-01-15", amount: 5600, paidAmount: 0, status: "overdue" },
];

const mockOrders = [
  { orderNumber: "SO-2024-0123", party: "TechStart Inc", amount: 8750 },
  { orderNumber: "PO-2024-0045", party: "Acme Corporation", amount: 12500 },
];

export default function Invoices() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedOrder, setSelectedOrder] = useState("");

  const filteredData = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      invoice.party.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || invoice.status === statusFilter.toLowerCase();
    const matchesType = typeFilter === "all" || invoice.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const columns: Column<Invoice>[] = [
    { 
      key: "invoiceNumber", 
      header: "Invoice #", 
      className: "font-mono text-sm font-medium",
      render: (invoice) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help">{invoice.invoiceNumber}</span>
          </TooltipTrigger>
          <TooltipContent side="top">
            <div className="space-y-1">
              <p className="text-xs font-semibold">{invoice.invoiceNumber}</p>
              <p className="text-xs text-muted-foreground">Party: {invoice.party}</p>
              <p className="text-xs text-muted-foreground">Due Date: {invoice.dueDate}</p>
              <p className="text-xs text-muted-foreground">Amount: ${invoice.amount.toLocaleString()}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (invoice) => (
        <span className={`text-xs font-medium px-2 py-1 rounded ${
          invoice.type === "vendor" 
            ? "bg-orange-100 text-orange-700" 
            : "bg-green-100 text-green-700"
        }`}>
          {invoice.type === "vendor" ? "Payable" : "Receivable"}
        </span>
      ),
    },
    { key: "party", header: "Party" },
    { key: "issueDate", header: "Issue Date" },
    { key: "dueDate", header: "Due Date" },
    {
      key: "amount",
      header: "Amount",
      className: "text-right font-mono",
      render: (invoice) => `$${invoice.amount.toLocaleString()}`,
    },
    {
      key: "balance",
      header: "Balance",
      className: "text-right font-mono",
      render: (invoice) => {
        const balance = invoice.amount - invoice.paidAmount;
        return (
          <span className={balance > 0 ? "text-destructive" : "text-green-600"}>
            ${balance.toLocaleString()}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (invoice) => <StatusBadge status={invoice.status} />,
    },
    {
      key: "actions",
      header: "",
      render: (invoice) => (
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedInvoice(invoice);
              setPreviewOpen(true);
            }}
            data-testid={`button-view-${invoice.id}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              toast({ title: "Downloading...", description: `${invoice.invoiceNumber}.pdf` });
            }}
            data-testid={`button-download-${invoice.id}`}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleSubmit = () => {
    toast({
      title: "Invoice Created",
      description: `Invoice has been generated.`,
    });
    setModalOpen(false);
    setSelectedOrder("");
  };

  const customerInvoices = mockInvoices.filter((i) => i.type === "customer");
  const vendorInvoices = mockInvoices.filter((i) => i.type === "vendor");
  const totalReceivable = customerInvoices.reduce((sum, i) => sum + (i.amount - i.paidAmount), 0);
  const totalPayable = vendorInvoices.reduce((sum, i) => sum + (i.amount - i.paidAmount), 0);
  const overdueCount = mockInvoices.filter((i) => i.status === "overdue").length;

  return (
    <PageBackground>
      <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Invoices
            </h1>
            <p className="text-muted-foreground mt-1">Manage invoices and billing</p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="gap-2">
            <FileText className="h-4 w-4" />
            Create Invoice
          </Button>
        </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Total Invoices</p>
            <p className="text-2xl font-bold mt-1">{mockInvoices.length}</p>
          </CardContent>
        </Card>
        <Card className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Receivable</p>
            <p className="text-2xl font-bold mt-1 font-mono text-green-600">${totalReceivable.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-4 w-4 text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Payable</p>
            <p className="text-2xl font-bold mt-1 font-mono text-orange-600">${totalPayable.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Overdue</p>
            <p className="text-2xl font-bold mt-1 text-red-600">{overdueCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <Tabs value={typeFilter} onValueChange={setTypeFilter} className="mb-4">
            <TabsList>
              <TabsTrigger value="all" data-testid="tab-all">All Invoices</TabsTrigger>
              <TabsTrigger value="customer" data-testid="tab-receivable">Receivable</TabsTrigger>
              <TabsTrigger value="vendor" data-testid="tab-payable">Payable</TabsTrigger>
            </TabsList>
          </Tabs>

          <SearchFilter
            searchPlaceholder="Search by invoice number or party..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={[
              {
                key: "status",
                label: "Status",
                options: [
                  { value: "All", label: "All Status" },
                  { value: "Pending", label: "Pending" },
                  { value: "Paid", label: "Paid" },
                  { value: "Partial", label: "Partial" },
                  { value: "Overdue", label: "Overdue" },
                ],
                value: statusFilter,
                onChange: setStatusFilter,
              },
            ]}
          />

          <DataTable
            columns={columns}
            data={filteredData}
            testIdPrefix="invoices"
          />
        </CardContent>
      </Card>

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Create Invoice"
        description="Generate an invoice from an order."
        onSubmit={handleSubmit}
        submitLabel="Create Invoice"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Order *</Label>
            <Select value={selectedOrder} onValueChange={setSelectedOrder}>
              <SelectTrigger data-testid="select-order">
                <SelectValue placeholder="Select an order" />
              </SelectTrigger>
              <SelectContent>
                {mockOrders.map((order) => (
                  <SelectItem key={order.orderNumber} value={order.orderNumber}>
                    <div className="flex justify-between gap-4">
                      <span className="font-mono">{order.orderNumber}</span>
                      <span className="text-muted-foreground">
                        ${order.amount.toLocaleString()}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedOrder && (
            <div className="p-4 rounded-lg border bg-muted/30">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Order</span>
                <span className="font-mono text-sm">{selectedOrder}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Party</span>
                <span className="text-sm">
                  {mockOrders.find((o) => o.orderNumber === selectedOrder)?.party}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Amount</span>
                <span className="font-bold font-mono">
                  ${mockOrders.find((o) => o.orderNumber === selectedOrder)?.amount.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Issue Date</Label>
              <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} data-testid="input-issue-date" />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input type="date" data-testid="input-due-date" />
            </div>
          </div>
        </div>
      </FormModal>

      <FormModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        title="Invoice Preview"
      >
        {selectedInvoice && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">INVOICE</h3>
                <p className="font-mono text-sm">{selectedInvoice.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">SupplyFlow Inc.</p>
                <p className="text-sm text-muted-foreground">123 Business Ave</p>
                <p className="text-sm text-muted-foreground">Enterprise City, EC 12345</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Bill To</p>
                <p className="font-medium">{selectedInvoice.party}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase">Amount Due</p>
                <p className="text-2xl font-bold font-mono">
                  ${(selectedInvoice.amount - selectedInvoice.paidAmount).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Issue Date</p>
                <p className="font-medium">{selectedInvoice.issueDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Due Date</p>
                <p className="font-medium">{selectedInvoice.dueDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <StatusBadge status={selectedInvoice.status} />
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1" data-testid="button-download-preview">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" className="flex-1" data-testid="button-send-email">
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
        )}
      </FormModal>
      </div>
    </PageBackground>
  );
}
