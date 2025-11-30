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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Download, 
  Send, 
  Eye, 
  DollarSign, 
  AlertTriangle, 
  History, 
  Filter,
  CreditCard,
  Plus,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  User,
  Calendar,
  Receipt
} from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { BulkActions } from "@/components/BulkActions";
import { ExportDialog } from "@/components/ExportDialog";
import { ActivityLogDialog, generateMockActivityLogs, type ActivityLog } from "@/components/ActivityLog";
import { AdvancedFilterDialog, applyAdvancedFilters, type FilterCondition, type SavedFilter } from "@/components/AdvancedFilter";

// Payment Interface
interface Payment {
  id: string;
  paymentNumber: string;
  paymentDate: string;
  amount: number;
  method: string;
  reference: string;
  status: StatusType;
  recordedBy: string;
}

// Approval Action Interface
interface ApprovalAction {
  level: number;
  approver: string;
  action: "approved" | "rejected" | "pending";
  date?: string;
  comments?: string;
}

// Enhanced Invoice Interface with Approval Workflow
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
  approvalStatus: "draft" | "pending_approval" | "approved" | "rejected";
  approvalLevel?: number;
  approvedBy?: string[];
  rejectedBy?: string;
  rejectionReason?: string;
  payments?: Payment[];
  approvalHistory?: ApprovalAction[];
}

// Mock Data with Approval Workflow and Payments
const mockInvoices: Invoice[] = [
  { 
    id: "1", 
    invoiceNumber: "INV-2024-0100", 
    type: "customer", 
    party: "TechStart Inc", 
    issueDate: "2024-01-15", 
    dueDate: "2024-02-14", 
    amount: 8750, 
    paidAmount: 0, 
    status: "pending",
    approvalStatus: "pending_approval",
    approvalLevel: 1,
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "pending" }
    ],
    payments: []
  },
  { 
    id: "2", 
    invoiceNumber: "INV-2024-0099", 
    type: "customer", 
    party: "Metro Retail Group", 
    issueDate: "2024-01-14", 
    dueDate: "2024-02-13", 
    amount: 15600, 
    paidAmount: 15600, 
    status: "paid",
    approvalStatus: "approved",
    approvedBy: ["John Smith", "Sarah Johnson"],
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "approved", date: "2024-01-14", comments: "Approved for payment" },
      { level: 2, approver: "Sarah Johnson (CFO)", action: "approved", date: "2024-01-14", comments: "Final approval granted" }
    ],
    payments: [
      { id: "p1", paymentNumber: "PAY-2024-0080", paymentDate: "2024-01-15", amount: 15600, method: "Bank Transfer", reference: "TRF-456789", status: "completed", recordedBy: "Jane Doe" }
    ]
  },
  { 
    id: "3", 
    invoiceNumber: "INV-2024-0098", 
    type: "vendor", 
    party: "Acme Corporation", 
    issueDate: "2024-01-13", 
    dueDate: "2024-02-12", 
    amount: 12500, 
    paidAmount: 12500, 
    status: "paid",
    approvalStatus: "approved",
    approvedBy: ["John Smith"],
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "approved", date: "2024-01-13", comments: "Verified and approved" }
    ],
    payments: [
      { id: "p2", paymentNumber: "PAY-2024-0079", paymentDate: "2024-01-14", amount: 12500, method: "Check", reference: "CHK-001234", status: "completed", recordedBy: "Mike Wilson" }
    ]
  },
  { 
    id: "4", 
    invoiceNumber: "INV-2024-0097", 
    type: "customer", 
    party: "City Stores Ltd", 
    issueDate: "2024-01-12", 
    dueDate: "2024-01-27", 
    amount: 4800, 
    paidAmount: 0, 
    status: "overdue",
    approvalStatus: "approved",
    approvedBy: ["John Smith"],
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "approved", date: "2024-01-12" }
    ],
    payments: []
  },
  { 
    id: "5", 
    invoiceNumber: "INV-2024-0096", 
    type: "vendor", 
    party: "Global Supply Co", 
    issueDate: "2024-01-11", 
    dueDate: "2024-02-25", 
    amount: 8750, 
    paidAmount: 4000, 
    status: "partial",
    approvalStatus: "approved",
    approvedBy: ["John Smith", "Sarah Johnson"],
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "approved", date: "2024-01-11" },
      { level: 2, approver: "Sarah Johnson (CFO)", action: "approved", date: "2024-01-11" }
    ],
    payments: [
      { id: "p3", paymentNumber: "PAY-2024-0077", paymentDate: "2024-01-12", amount: 4000, method: "Bank Transfer", reference: "TRF-123456", status: "completed", recordedBy: "Jane Doe" }
    ]
  },
  { 
    id: "6", 
    invoiceNumber: "INV-2024-0095", 
    type: "customer", 
    party: "Express Outlets", 
    issueDate: "2024-01-10", 
    dueDate: "2024-02-09", 
    amount: 23400, 
    paidAmount: 23400, 
    status: "paid",
    approvalStatus: "approved",
    approvedBy: ["John Smith", "Sarah Johnson"],
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "approved", date: "2024-01-10" },
      { level: 2, approver: "Sarah Johnson (CFO)", action: "approved", date: "2024-01-10" }
    ],
    payments: [
      { id: "p4", paymentNumber: "PAY-2024-0078", paymentDate: "2024-01-13", amount: 23400, method: "Credit Card", reference: "CC-789456", status: "completed", recordedBy: "Mike Wilson" }
    ]
  },
  { 
    id: "7", 
    invoiceNumber: "INV-2024-0089", 
    type: "customer", 
    party: "Beta Industries", 
    issueDate: "2024-01-01", 
    dueDate: "2024-01-15", 
    amount: 5600, 
    paidAmount: 0, 
    status: "overdue",
    approvalStatus: "approved",
    approvedBy: ["John Smith"],
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "approved", date: "2024-01-01" }
    ],
    payments: []
  },
  { 
    id: "8", 
    invoiceNumber: "INV-2024-0094", 
    type: "vendor", 
    party: "Quality Parts Inc", 
    issueDate: "2024-01-09", 
    dueDate: "2024-02-08", 
    amount: 6700, 
    paidAmount: 6700, 
    status: "paid",
    approvalStatus: "approved",
    approvedBy: ["John Smith"],
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "approved", date: "2024-01-09" }
    ],
    payments: [
      { id: "p5", paymentNumber: "PAY-2024-0075", paymentDate: "2024-01-10", amount: 6700, method: "Check", reference: "CHK-001233", status: "completed", recordedBy: "Jane Doe" }
    ]
  },
  { 
    id: "9", 
    invoiceNumber: "INV-2024-0093", 
    type: "customer", 
    party: "Wholesale Partners", 
    issueDate: "2024-01-08", 
    dueDate: "2024-02-07", 
    amount: 34500, 
    paidAmount: 34500, 
    status: "paid",
    approvalStatus: "approved",
    approvedBy: ["John Smith", "Sarah Johnson"],
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "approved", date: "2024-01-08" },
      { level: 2, approver: "Sarah Johnson (CFO)", action: "approved", date: "2024-01-08" }
    ],
    payments: [
      { id: "p6", paymentNumber: "PAY-2024-0074", paymentDate: "2024-01-09", amount: 34500, method: "Wire Transfer", reference: "WIR-445566", status: "completed", recordedBy: "Mike Wilson" }
    ]
  },
  { 
    id: "10", 
    invoiceNumber: "INV-2024-0092", 
    type: "vendor", 
    party: "Tech Components", 
    issueDate: "2024-01-07", 
    dueDate: "2024-02-21", 
    amount: 15600, 
    paidAmount: 8000, 
    status: "partial",
    approvalStatus: "approved",
    approvedBy: ["John Smith"],
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "approved", date: "2024-01-07" }
    ],
    payments: [
      { id: "p7", paymentNumber: "PAY-2024-0073", paymentDate: "2024-01-08", amount: 8000, method: "Bank Transfer", reference: "TRF-556677", status: "completed", recordedBy: "Jane Doe" }
    ]
  },
  { 
    id: "11", 
    invoiceNumber: "INV-2024-0091", 
    type: "customer", 
    party: "Prime Electronics", 
    issueDate: "2024-01-06", 
    dueDate: "2024-02-05", 
    amount: 19800, 
    paidAmount: 0, 
    status: "pending",
    approvalStatus: "pending_approval",
    approvalLevel: 2,
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "approved", date: "2024-01-06", comments: "Approved, forwarding to CFO" },
      { level: 2, approver: "Sarah Johnson (CFO)", action: "pending" }
    ],
    payments: []
  },
  { 
    id: "12", 
    invoiceNumber: "INV-2024-0090", 
    type: "customer", 
    party: "Global Trade Corp", 
    issueDate: "2024-01-05", 
    dueDate: "2024-02-04", 
    amount: 28900, 
    paidAmount: 28900, 
    status: "paid",
    approvalStatus: "approved",
    approvedBy: ["John Smith", "Sarah Johnson"],
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "approved", date: "2024-01-05" },
      { level: 2, approver: "Sarah Johnson (CFO)", action: "approved", date: "2024-01-05" }
    ],
    payments: [
      { id: "p8", paymentNumber: "PAY-2024-0072", paymentDate: "2024-01-07", amount: 28900, method: "Bank Transfer", reference: "TRF-667788", status: "completed", recordedBy: "Mike Wilson" }
    ]
  },
  { 
    id: "13", 
    invoiceNumber: "INV-2024-0088", 
    type: "vendor", 
    party: "Supreme Electronics", 
    issueDate: "2023-12-31", 
    dueDate: "2024-01-30", 
    amount: 18900, 
    paidAmount: 0, 
    status: "pending",
    approvalStatus: "rejected",
    rejectedBy: "John Smith",
    rejectionReason: "Missing purchase order reference",
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "rejected", date: "2023-12-31", comments: "Missing purchase order reference" }
    ],
    payments: []
  },
  { 
    id: "14", 
    invoiceNumber: "INV-2024-0087", 
    type: "customer", 
    party: "Downtown Supermarket", 
    issueDate: "2023-12-30", 
    dueDate: "2024-01-29", 
    amount: 6700, 
    paidAmount: 6700, 
    status: "paid",
    approvalStatus: "approved",
    approvedBy: ["John Smith"],
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "approved", date: "2023-12-30" }
    ],
    payments: [
      { id: "p9", paymentNumber: "PAY-2024-0071", paymentDate: "2024-01-06", amount: 6700, method: "Credit Card", reference: "CC-778899", status: "completed", recordedBy: "Jane Doe" }
    ]
  },
  { 
    id: "15", 
    invoiceNumber: "INV-2024-0086", 
    type: "vendor", 
    party: "Mega Manufacturing", 
    issueDate: "2023-12-29", 
    dueDate: "2024-02-13", 
    amount: 29400, 
    paidAmount: 15000, 
    status: "partial",
    approvalStatus: "approved",
    approvedBy: ["John Smith", "Sarah Johnson"],
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "approved", date: "2023-12-29" },
      { level: 2, approver: "Sarah Johnson (CFO)", action: "approved", date: "2023-12-29" }
    ],
    payments: [
      { id: "p10", paymentNumber: "PAY-2024-0070", paymentDate: "2024-01-05", amount: 15000, method: "Check", reference: "CHK-001232", status: "completed", recordedBy: "Mike Wilson" }
    ]
  },
];

const mockOrders = [
  { orderNumber: "SO-2024-0123", party: "TechStart Inc", amount: 8750 },
  { orderNumber: "PO-2024-0045", party: "Acme Corporation", amount: 12500 },
];

const paymentMethods = ["Bank Transfer", "Check", "Credit Card", "Cash", "Wire Transfer"];

export default function FinancialManagement() {
  const { toast } = useToast();
  
  // State management
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Modal states
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  
  // Form states
  const [selectedOrder, setSelectedOrder] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [approvalComments, setApprovalComments] = useState("");
  
  // Feature states
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [activityLogOpen, setActivityLogOpen] = useState(false);
  const [advancedFilterOpen, setAdvancedFilterOpen] = useState(false);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);

  // Filter invoices
  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch = search === "" || 
      invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      invoice.party.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || invoice.status === statusFilter;
    const matchesType = typeFilter === "all" || invoice.type === typeFilter;
    const matchesApproval = approvalFilter === "all" || invoice.approvalStatus === approvalFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesApproval;
  });

  // Apply advanced filters
  const finalInvoices = applyAdvancedFilters(filteredInvoices, activeFilters);

  // Calculate stats
  const stats = {
    totalInvoices: mockInvoices.length,
    pendingApproval: mockInvoices.filter(i => i.approvalStatus === "pending_approval").length,
    approved: mockInvoices.filter(i => i.approvalStatus === "approved").length,
    totalOutstanding: mockInvoices.reduce((sum, inv) => sum + (inv.amount - inv.paidAmount), 0),
    overdue: mockInvoices.filter(i => i.status === "overdue").length,
  };

  // Table columns
  const columns: Column<Invoice>[] = [
    {
      key: "invoiceNumber",
      header: "Invoice Number",
      render: (invoice) => (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedItems.includes(invoice.id)}
            onCheckedChange={(checked) => {
              setSelectedItems(checked 
                ? [...selectedItems, invoice.id]
                : selectedItems.filter(id => id !== invoice.id)
              );
            }}
          />
          <span className="font-mono font-semibold">{invoice.invoiceNumber}</span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (invoice) => (
        <Badge variant={invoice.type === "customer" ? "default" : "secondary"}>
          {invoice.type === "customer" ? "Customer" : "Vendor"}
        </Badge>
      ),
    },
    {
      key: "party",
      header: "Party",
    },
    {
      key: "amount",
      header: "Amount",
      render: (invoice) => (
        <span className="font-semibold">${invoice.amount.toLocaleString()}</span>
      ),
    },
    {
      key: "paidAmount",
      header: "Paid",
      render: (invoice) => (
        <span className="text-green-600 font-semibold">
          ${invoice.paidAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
    },
    {
      key: "approvalStatus",
      header: "Approval",
      render: (invoice) => {
        const approvalStatusMap: Record<string, { label: string; variant: StatusType }> = {
          draft: { label: "Draft", variant: "pending" },
          pending_approval: { label: "Pending", variant: "pending" },
          approved: { label: "Approved", variant: "completed" },
          rejected: { label: "Rejected", variant: "cancelled" },
        };
        const { variant } = approvalStatusMap[invoice.approvalStatus];
        return <StatusBadge status={variant} />;
      },
    },
    {
      key: "status",
      header: "Payment Status",
      render: (invoice) => <StatusBadge status={invoice.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (invoice) => {
        const canApprove = invoice.approvalStatus === "pending_approval";
        const canRecordPayment = invoice.approvalStatus === "approved" && invoice.paidAmount < invoice.amount;
        const canSend = invoice.approvalStatus === "approved";
        
        return (
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedInvoice(invoice);
                    setDetailsOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View Details</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!canApprove}
                  className={!canApprove ? "opacity-30 cursor-not-allowed" : ""}
                  onClick={() => {
                    if (canApprove) {
                      setSelectedInvoice(invoice);
                      setApprovalModalOpen(true);
                    }
                  }}
                >
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {canApprove ? "Review Approval" : "Already Approved/Rejected"}
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!canRecordPayment}
                  className={!canRecordPayment ? "opacity-30 cursor-not-allowed" : ""}
                  onClick={() => {
                    if (canRecordPayment) {
                      setSelectedInvoice(invoice);
                      setPaymentModalOpen(true);
                    }
                  }}
                >
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {!canRecordPayment 
                  ? invoice.approvalStatus !== "approved"
                    ? "Requires Approval First"
                    : "Fully Paid"
                  : "Record Payment"}
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!canSend}
                  className={!canSend ? "opacity-30 cursor-not-allowed" : ""}
                  onClick={() => {
                    if (canSend) {
                      toast({
                        title: "Invoice Sent",
                        description: `${invoice.invoiceNumber} has been sent to ${invoice.party}`,
                      });
                    }
                  }}
                >
                  <Send className="h-4 w-4 text-purple-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {canSend ? "Send Invoice" : "Requires Approval First"}
              </TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  // Handlers
  const handleCreateInvoice = () => {
    toast({
      title: "Invoice Created",
      description: `Invoice submitted for approval`,
    });
    setInvoiceModalOpen(false);
  };

  const handleApprove = () => {
    toast({
      title: "Invoice Approved",
      description: `${selectedInvoice?.invoiceNumber} has been approved`,
    });
    setApprovalModalOpen(false);
  };

  const handleReject = () => {
    toast({
      title: "Invoice Rejected",
      description: `${selectedInvoice?.invoiceNumber} has been rejected`,
    });
    setApprovalModalOpen(false);
  };

  const handleRecordPayment = () => {
    toast({
      title: "Payment Recorded",
      description: `Payment of $${paymentAmount} recorded successfully`,
    });
    setPaymentModalOpen(false);
    setPaymentAmount("");
    setPaymentMethod("");
    setPaymentReference("");
  };

  const handleBulkAction = (action: string) => {
    toast({
      title: "Bulk Action",
      description: `${action} applied to ${selectedItems.length} items`,
    });
    setSelectedItems([]);
  };

  const handleExport = (format: string, columns: string[]) => {
    toast({
      title: "Export Started",
      description: `Exporting ${finalInvoices.length} invoices as ${format.toUpperCase()}`,
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
      description: `Filter "${name}" has been saved.`,
    });
  };

  const handleLoadFilter = (filter: SavedFilter) => {
    setActiveFilters(filter.conditions);
    toast({
      title: "Filter Applied",
      description: `Filter "${filter.name}" has been applied.`,
    });
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
    setSearch("");
    setStatusFilter("All");
    setTypeFilter("all");
    setApprovalFilter("all");
  };

  return (
    <PageBackground>
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Financial Management</h1>
          <p className="text-muted-foreground">
            Manage invoices with approval workflow and payment tracking
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{stats.totalInvoices}</p>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Approval
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{stats.pendingApproval}</p>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{stats.approved}</p>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Outstanding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    ${stats.totalOutstanding.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">{stats.overdue} overdue</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Collected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-green-600">
                  ${mockInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0).toLocaleString()}
                </p>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <SearchFilter
                  searchValue={search}
                  onSearchChange={setSearch}
                  searchPlaceholder="Search by invoice number or party..."
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={approvalFilter} onValueChange={setApprovalFilter}>
                  <SelectTrigger className="w-[170px]">
                    <SelectValue placeholder="Approval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Approvals</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending_approval">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setAdvancedFilterOpen(true)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced
                  {activeFilters.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFilters.length}
                    </Badge>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setActivityLogOpen(true)}
                >
                  <History className="h-4 w-4 mr-2" />
                  Activity Log
                </Button>

                {(activeFilters.length > 0 || search || statusFilter !== "All" || typeFilter !== "all" || approvalFilter !== "all") && (
                  <Button variant="ghost" onClick={handleClearFilters}>
                    Clear All
                  </Button>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={() => setInvoiceModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="mb-4">
            <BulkActions
              selectedCount={selectedItems.length}
              actions={[
                { label: "Export Selected", icon: Download, onClick: () => handleBulkAction("export") },
                { label: "Send Reminder", icon: Send, onClick: () => handleBulkAction("remind") },
              ]}
            />
          </div>
        )}

        {/* Data Table */}
        <Card>
          <CardContent className="pt-6">
            {finalInvoices.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No invoices found"
                description="Create your first invoice to get started"
                action={{
                  label: "Create Invoice",
                  onClick: () => setInvoiceModalOpen(true),
                  icon: Plus
                }}
              />
            ) : (
              <DataTable
                data={finalInvoices}
                columns={columns}
              />
            )}
          </CardContent>
        </Card>

        {/* Create Invoice Modal */}
        <FormModal
          open={invoiceModalOpen}
          onOpenChange={setInvoiceModalOpen}
          title="Create New Invoice"
          description="Create a new invoice and submit for approval"
          onSubmit={handleCreateInvoice}
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="order">Link to Order</Label>
              <Select value={selectedOrder} onValueChange={setSelectedOrder}>
                <SelectTrigger>
                  <SelectValue placeholder="Select order" />
                </SelectTrigger>
                <SelectContent>
                  {mockOrders.map(order => (
                    <SelectItem key={order.orderNumber} value={order.orderNumber}>
                      {order.orderNumber} - {order.party} (${order.amount.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="invoiceType">Invoice Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer Invoice</SelectItem>
                  <SelectItem value="vendor">Vendor Invoice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="party">Party Name</Label>
              <Input id="party" placeholder="Enter party name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input id="issueDate" type="date" />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" />
              </div>
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" placeholder="0.00" />
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                Invoice will be submitted for approval after creation
              </p>
            </div>
          </div>
        </FormModal>

        {/* Invoice Details Modal */}
        {selectedInvoice && (
          <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Invoice Details - {selectedInvoice.invoiceNumber}</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[calc(90vh-120px)]">
                <div className="space-y-6 pr-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Party</p>
                      <p className="font-semibold">{selectedInvoice.party}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <Badge variant={selectedInvoice.type === "customer" ? "default" : "secondary"}>
                        {selectedInvoice.type === "customer" ? "Customer" : "Vendor"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Issue Date</p>
                      <p className="font-medium">{selectedInvoice.issueDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p className="font-medium">{selectedInvoice.dueDate}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Financial Summary */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Financial Summary
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-4">
                          <p className="text-sm text-muted-foreground">Total Amount</p>
                          <p className="text-2xl font-bold">${selectedInvoice.amount.toLocaleString()}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <p className="text-sm text-muted-foreground">Paid Amount</p>
                          <p className="text-2xl font-bold text-green-600">
                            ${selectedInvoice.paidAmount.toLocaleString()}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <p className="text-sm text-muted-foreground">Balance Due</p>
                          <p className="text-2xl font-bold text-red-600">
                            ${(selectedInvoice.amount - selectedInvoice.paidAmount).toLocaleString()}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Separator />

                  {/* Approval Workflow */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Approval Workflow
                    </h3>
                    <div className="space-y-3">
                      {selectedInvoice.approvalHistory?.map((action, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                          <div className="mt-1">
                            {action.action === "approved" && (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                            {action.action === "rejected" && (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                            {action.action === "pending" && (
                              <Clock className="h-5 w-5 text-yellow-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">Level {action.level} - {action.approver}</p>
                              <Badge variant={
                                action.action === "approved" ? "default" :
                                action.action === "rejected" ? "destructive" : "secondary"
                              }>
                                {action.action}
                              </Badge>
                            </div>
                            {action.date && (
                              <p className="text-sm text-muted-foreground mt-1">
                                <Calendar className="h-3 w-3 inline mr-1" />
                                {action.date}
                              </p>
                            )}
                            {action.comments && (
                              <p className="text-sm mt-2 text-muted-foreground italic">
                                "{action.comments}"
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Payment History */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Receipt className="h-5 w-5" />
                      Payment History ({selectedInvoice.payments?.length || 0})
                    </h3>
                    {selectedInvoice.payments && selectedInvoice.payments.length > 0 ? (
                      <div className="space-y-3">
                        {selectedInvoice.payments.map((payment) => (
                          <div key={payment.id} className="p-4 rounded-lg border bg-muted/50">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-mono font-semibold">{payment.paymentNumber}</p>
                                <p className="text-sm text-muted-foreground">
                                  {payment.paymentDate} • {payment.method}
                                </p>
                              </div>
                              <StatusBadge status={payment.status} />
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-3">
                              <div>
                                <p className="text-xs text-muted-foreground">Amount</p>
                                <p className="font-bold text-green-600">
                                  ${payment.amount.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Reference</p>
                                <p className="font-mono text-sm">{payment.reference}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Recorded By</p>
                                <p className="text-sm flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {payment.recordedBy}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Receipt className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No payments recorded yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                  Close
                </Button>
                {selectedInvoice.approvalStatus === "approved" && 
                 selectedInvoice.paidAmount < selectedInvoice.amount && (
                  <Button onClick={() => {
                    setDetailsOpen(false);
                    setPaymentModalOpen(true);
                  }}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Record Payment
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Approval Modal */}
        {selectedInvoice && (
          <Dialog open={approvalModalOpen} onOpenChange={setApprovalModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Review Invoice - {selectedInvoice.invoiceNumber}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Party</p>
                    <p className="font-semibold">{selectedInvoice.party}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-lg font-bold">${selectedInvoice.amount.toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="comments">Comments (Optional)</Label>
                  <Textarea
                    id="comments"
                    placeholder="Add approval comments..."
                    value={approvalComments}
                    onChange={(e) => setApprovalComments(e.target.value)}
                  />
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <AlertCircle className="h-4 w-4 inline mr-2" />
                    Current approval level: {selectedInvoice.approvalLevel}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setApprovalModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleReject}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={handleApprove}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Record Payment Modal */}
        {selectedInvoice && (
          <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Payment - {selectedInvoice.invoiceNumber}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-lg font-bold">${selectedInvoice.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Balance Due</p>
                      <p className="text-lg font-bold text-red-600">
                        ${(selectedInvoice.amount - selectedInvoice.paidAmount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="paymentAmount">Payment Amount</Label>
                  <Input
                    id="paymentAmount"
                    type="number"
                    placeholder="0.00"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map(method => (
                        <SelectItem key={method} value={method}>{method}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="reference">Reference Number</Label>
                  <Input
                    id="reference"
                    placeholder="Enter reference number"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPaymentModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRecordPayment}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Export Dialog */}
        <ExportDialog
          open={exportDialogOpen}
          onOpenChange={setExportDialogOpen}
          data={finalInvoices}
          filename="invoices"
          columns={[
            { key: "invoiceNumber", label: "Invoice Number", enabled: true },
            { key: "type", label: "Type", enabled: true },
            { key: "party", label: "Party", enabled: true },
            { key: "issueDate", label: "Issue Date", enabled: true },
            { key: "dueDate", label: "Due Date", enabled: true },
            { key: "amount", label: "Amount", enabled: true },
            { key: "paidAmount", label: "Paid Amount", enabled: true },
            { key: "approvalStatus", label: "Approval Status", enabled: true },
            { key: "status", label: "Payment Status", enabled: true },
          ]}
        />

        {/* Activity Log */}
        <ActivityLogDialog
          open={activityLogOpen}
          onOpenChange={setActivityLogOpen}
          logs={generateMockActivityLogs()}
        />

        {/* Advanced Filter */}
        <AdvancedFilterDialog
          open={advancedFilterOpen}
          onOpenChange={setAdvancedFilterOpen}
          onApplyFilters={setActiveFilters}
          onSaveFilter={handleSaveFilter}
          savedFilters={savedFilters}
          onLoadFilter={handleLoadFilter}
          fields={[
            { value: "invoiceNumber", label: "Invoice Number", type: "text" },
            { value: "party", label: "Party", type: "text" },
            { value: "amount", label: "Amount", type: "number" },
            { value: "status", label: "Payment Status", type: "select" },
            { value: "approvalStatus", label: "Approval Status", type: "select" },
            { value: "type", label: "Type", type: "select" },
          ]}
        />
      </div>
    </PageBackground>
  );
}