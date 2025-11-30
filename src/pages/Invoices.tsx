import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Send, Eye, DollarSign, AlertTriangle, FileX, History, Filter } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { BulkActions } from "@/components/BulkActions";
import { ExportDialog } from "@/components/ExportDialog";
import { ActivityLogDialog, generateMockActivityLogs, type ActivityLog } from "@/components/ActivityLog";
import { AdvancedFilterDialog, applyAdvancedFilters, type FilterCondition, type SavedFilter } from "@/components/AdvancedFilter";

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
  { id: "8", invoiceNumber: "INV-2024-0094", type: "vendor", party: "Quality Parts Inc", issueDate: "2024-01-09", dueDate: "2024-02-08", amount: 6700, paidAmount: 6700, status: "paid" },
  { id: "9", invoiceNumber: "INV-2024-0093", type: "customer", party: "Wholesale Partners", issueDate: "2024-01-08", dueDate: "2024-02-07", amount: 34500, paidAmount: 34500, status: "paid" },
  { id: "10", invoiceNumber: "INV-2024-0092", type: "vendor", party: "Tech Components", issueDate: "2024-01-07", dueDate: "2024-02-21", amount: 15600, paidAmount: 8000, status: "partial" },
  { id: "11", invoiceNumber: "INV-2024-0091", type: "customer", party: "Prime Electronics", issueDate: "2024-01-06", dueDate: "2024-02-05", amount: 19800, paidAmount: 0, status: "pending" },
  { id: "12", invoiceNumber: "INV-2024-0090", type: "customer", party: "Global Trade Corp", issueDate: "2024-01-05", dueDate: "2024-02-04", amount: 28900, paidAmount: 28900, status: "paid" },
  { id: "13", invoiceNumber: "INV-2024-0088", type: "vendor", party: "Supreme Electronics", issueDate: "2023-12-31", dueDate: "2024-01-30", amount: 18900, paidAmount: 0, status: "pending" },
  { id: "14", invoiceNumber: "INV-2024-0087", type: "customer", party: "Downtown Supermarket", issueDate: "2023-12-30", dueDate: "2024-01-29", amount: 6700, paidAmount: 6700, status: "paid" },
  { id: "15", invoiceNumber: "INV-2024-0086", type: "vendor", party: "Mega Manufacturing", issueDate: "2023-12-29", dueDate: "2024-02-13", amount: 29400, paidAmount: 15000, status: "partial" },
  { id: "16", invoiceNumber: "INV-2024-0085", type: "customer", party: "Coastal Distributors", issueDate: "2023-12-28", dueDate: "2024-01-27", amount: 14500, paidAmount: 14500, status: "paid" },
  { id: "17", invoiceNumber: "INV-2024-0084", type: "customer", party: "Mountain Retail Chain", issueDate: "2023-12-27", dueDate: "2024-01-26", amount: 31200, paidAmount: 0, status: "overdue" },
  { id: "18", invoiceNumber: "INV-2024-0083", type: "vendor", party: "Alpha Distributors", issueDate: "2023-12-26", dueDate: "2024-02-10", amount: 11200, paidAmount: 11200, status: "paid" },
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
      name: "Overdue Invoices",
      conditions: [{ id: "1", field: "status", operator: "equals", value: "overdue", fieldType: "select" }],
      isFavorite: true,
    },
    {
      id: "2",
      name: "Paid This Month",
      conditions: [
        { id: "1", field: "status", operator: "equals", value: "paid", fieldType: "select" },
        { id: "2", field: "issueDate", operator: "greater", value: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], fieldType: "date" }
      ],
    },
  ]);

  const filteredData = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      invoice.party.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || invoice.status === statusFilter.toLowerCase();
    const matchesType = typeFilter === "all" || invoice.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Apply advanced filters if any
  const finalData = filterConditions.length > 0 
    ? applyAdvancedFilters(filteredData, filterConditions)
    : filteredData;

  const columns: Column<Invoice>[] = [
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
      render: (invoice) => (
        <Checkbox
          checked={selectedItems.includes(invoice.id)}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedItems([...selectedItems, invoice.id]);
            } else {
              setSelectedItems(selectedItems.filter((id) => id !== invoice.id));
            }
          }}
        />
      ),
    },
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedInvoice(invoice);
                  setPreviewOpen(true);
                }}
                data-testid={`button-view-${invoice.id}`}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View invoice details</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-green-500/10 hover:text-green-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  toast({ title: "Downloading...", description: `${invoice.invoiceNumber}.pdf` });
                }}
                data-testid={`button-download-${invoice.id}`}
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download PDF</p>
            </TooltipContent>
          </Tooltip>
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

  // Bulk operation handlers
  const handleBulkExport = () => {
    setExportDialogOpen(true);
  };

  const handleBulkEmail = () => {
    toast({
      title: "Email Sent",
      description: `Report for ${selectedItems.length} invoices has been sent to your email.`,
    });
  };

  const handleBulkStatusChange = (newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `${selectedItems.length} invoices have been updated to ${newStatus}.`,
    });
    setSelectedItems([]);
  };

  const handleBulkDelete = () => {
    toast({
      title: "Invoices Deleted",
      description: `${selectedItems.length} invoices have been deleted successfully.`,
      variant: "destructive",
    });
    setSelectedItems([]);
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

  const customerInvoices = mockInvoices.filter((i) => i.type === "customer");
  const vendorInvoices = mockInvoices.filter((i) => i.type === "vendor");
  const totalReceivable = customerInvoices.reduce((sum, i) => sum + (i.amount - i.paidAmount), 0);
  const totalPayable = vendorInvoices.reduce((sum, i) => sum + (i.amount - i.paidAmount), 0);
  const overdueCount = mockInvoices.filter((i) => i.status === "overdue").length;

  return (
    <PageBackground>
      <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Invoices
            </h1>
            <p className="text-muted-foreground mt-1">Manage invoices and billing</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setAdvancedFilterOpen(true)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Advanced Filter
              {filterConditions.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {filterConditions.length}
                </Badge>
              )}
            </Button>
            <Button 
              variant="outline"
              onClick={() => setActivityLogOpen(true)}
              className="gap-2"
            >
              <History className="h-4 w-4" />
              Activity Log
            </Button>
            <Button 
              variant="outline"
              onClick={() => setExportDialogOpen(true)}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => setModalOpen(true)} className="gap-2">
              <FileText className="h-4 w-4" />
              Create Invoice
            </Button>
          </div>
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

          {filteredData.length === 0 ? (
            <EmptyState
              icon={FileX}
              title={search || statusFilter !== "All" ? "No invoices found" : "No invoices yet"}
              description={
                search || statusFilter !== "All"
                  ? "No invoices match your search criteria. Try adjusting your filters."
                  : "Create your first invoice to start billing customers."
              }
              action={{
                label: "Create Invoice",
                onClick: () => setModalOpen(true),
                icon: FileText,
              }}
            />
          ) : (
            <DataTable
              columns={columns}
              data={finalData}
              testIdPrefix="invoices"
            />
          )}
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
        title={selectedInvoice ? selectedInvoice.invoiceNumber : "Invoice Preview"}
        description={selectedInvoice ? `Invoice for ${selectedInvoice.party}` : undefined}
        maxWidth="2xl"
      >
        {selectedInvoice && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-start pb-4 border-b">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold tracking-tight">INVOICE</h3>
                <p className="font-mono text-lg font-semibold text-primary">{selectedInvoice.invoiceNumber}</p>
                <div className="mt-2">
                  <StatusBadge status={selectedInvoice.status} />
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="font-bold text-lg">SupplyFlow Inc.</p>
                <p className="text-sm text-muted-foreground">123 Business Avenue</p>
                <p className="text-sm text-muted-foreground">Enterprise City, EC 12345</p>
                <p className="text-sm text-muted-foreground">contact@supplyflow.com</p>
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
              </div>
            </div>

            {/* Bill To & Invoice Details */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Bill To</p>
                  <p className="font-semibold text-base">{selectedInvoice.party}</p>
                  <p className="text-sm text-muted-foreground mt-1">Customer Address Line 1</p>
                  <p className="text-sm text-muted-foreground">Customer City, State 12345</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Issue Date</p>
                    <p className="font-medium mt-1">{new Date(selectedInvoice.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Due Date</p>
                    <p className="font-medium mt-1">{new Date(selectedInvoice.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Invoice Type</p>
                  <span className={`inline-block mt-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                    selectedInvoice.type === "vendor" 
                      ? "bg-orange-100 text-orange-700" 
                      : "bg-green-100 text-green-700"
                  }`}>
                    {selectedInvoice.type === "vendor" ? "Accounts Payable" : "Accounts Receivable"}
                  </span>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide p-3">Description</th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide p-3 w-24">Qty</th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide p-3 w-32">Price</th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide p-3 w-32">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 text-sm">Professional Services</td>
                    <td className="p-3 text-sm text-right font-mono">1</td>
                    <td className="p-3 text-sm text-right font-mono">${selectedInvoice.amount.toLocaleString()}</td>
                    <td className="p-3 text-sm text-right font-mono font-medium">${selectedInvoice.amount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment Summary */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono font-medium">${selectedInvoice.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Tax (0%)</span>
                <span className="font-mono font-medium">$0.00</span>
              </div>
              <div className="flex justify-between items-center text-base font-semibold pt-2 border-t">
                <span>Total Amount</span>
                <span className="font-mono text-lg">${selectedInvoice.amount.toLocaleString()}</span>
              </div>
              {selectedInvoice.paidAmount > 0 && (
                <>
                  <div className="flex justify-between items-center text-sm text-green-600">
                    <span>Amount Paid</span>
                    <span className="font-mono font-medium">-${selectedInvoice.paidAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold pt-2 border-t-2 border-primary/20">
                    <span className={selectedInvoice.amount - selectedInvoice.paidAmount > 0 ? "text-destructive" : "text-green-600"}>
                      Balance Due
                    </span>
                    <span className={`font-mono ${selectedInvoice.amount - selectedInvoice.paidAmount > 0 ? "text-destructive" : "text-green-600"}`}>
                      ${(selectedInvoice.amount - selectedInvoice.paidAmount).toLocaleString()}
                    </span>
                  </div>
                </>
              )}
              {selectedInvoice.paidAmount === 0 && (
                <div className="flex justify-between items-center text-lg font-bold pt-2 border-t-2 border-primary/20">
                  <span className="text-destructive">Amount Due</span>
                  <span className="font-mono text-destructive">${selectedInvoice.amount.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Notes Section */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Payment Terms</p>
              <p className="text-sm">Payment is due within 30 days. Please include the invoice number with your payment.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="flex-1 gap-2" data-testid="button-download-preview">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download invoice as PDF</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="flex-1 gap-2" data-testid="button-send-email">
                    <Send className="h-4 w-4" />
                    Send Email
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Email invoice to {selectedInvoice.party}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}
      </FormModal>
      </div>

      {/* Floating Bulk Actions */}
      <BulkActions
        selectedCount={selectedItems.length}
        onExport={handleBulkExport}
        onEmail={handleBulkEmail}
        onStatusChange={handleBulkStatusChange}
        onDelete={handleBulkDelete}
        statusOptions={["Draft", "Sent", "Paid", "Overdue", "Cancelled"]}
      />

      {/* Export Dialog */}
      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        columns={[
          { key: "invoiceNumber", label: "Invoice Number" },
          { key: "issueDate", label: "Date" },
          { key: "party", label: "Customer" },
          { key: "amount", label: "Amount" },
          { key: "dueDate", label: "Due Date" },
          { key: "status", label: "Status" },
          { key: "paidAmount", label: "Payment Status" },
        ]}
        data={finalData.filter((item) => selectedItems.length === 0 || selectedItems.includes(item.id))}
        filename="invoices"
      />

      {/* Activity Log Dialog */}
      <ActivityLogDialog
        open={activityLogOpen}
        onOpenChange={setActivityLogOpen}
        logs={activityLogs}
        title="Invoice Activity Log"
      />

      {/* Advanced Filter Dialog */}
      <AdvancedFilterDialog
        open={advancedFilterOpen}
        onOpenChange={setAdvancedFilterOpen}
        fields={[
          { value: "invoiceNumber", label: "Invoice Number", type: "text" },
          { value: "party", label: "Customer", type: "text" },
          { value: "issueDate", label: "Date", type: "date" },
          { value: "amount", label: "Amount", type: "number" },
          { value: "dueDate", label: "Due Date", type: "date" },
          { value: "status", label: "Status", type: "select" },
        ]}
        onApplyFilters={handleApplyFilters}
        savedFilters={savedFilters}
        onSaveFilter={handleSaveFilter}
      />
    </PageBackground>
  );
}
