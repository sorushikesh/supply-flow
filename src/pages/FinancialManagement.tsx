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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  approvalStatus: "draft" | "pending_approval" | "partially_approved" | "approved" | "rejected";
  approvalLevel?: number;
  totalApprovalLevels?: number;
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
    party: "TechCorp Solutions", 
    issueDate: "2024-01-15", 
    dueDate: "2024-02-14", 
    amount: 25750, 
    paidAmount: 0, 
    status: "pending",
    approvalStatus: "pending_approval",
    approvalLevel: 1,
    totalApprovalLevels: 2,
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "pending" },
      { level: 2, approver: "Sarah Johnson (CFO)", action: "pending" }
    ],
    payments: []
  },
  { 
    id: "2", 
    invoiceNumber: "INV-2024-0099", 
    type: "customer", 
    party: "BestBuy Corporate", 
    issueDate: "2024-01-14", 
    dueDate: "2024-02-13", 
    amount: 65200, 
    paidAmount: 65200, 
    status: "paid",
    approvalStatus: "approved",
    approvalLevel: 2,
    totalApprovalLevels: 2,
    approvedBy: ["John Smith", "Sarah Johnson"],
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "approved", date: "2024-01-14", comments: "Approved for payment" },
      { level: 2, approver: "Sarah Johnson (CFO)", action: "approved", date: "2024-01-14", comments: "Final approval granted" }
    ],
    payments: [
      { id: "p1", paymentNumber: "PAY-2024-0080", paymentDate: "2024-01-15", amount: 65200, method: "Bank Transfer", reference: "TRF-456789", status: "completed", recordedBy: "Jane Doe" }
    ]
  },
  { 
    id: "3", 
    invoiceNumber: "INV-2024-0098", 
    type: "vendor", 
    party: "Dell Technologies", 
    issueDate: "2024-01-13", 
    dueDate: "2024-02-12", 
    amount: 59375, 
    paidAmount: 59375, 
    status: "paid",
    approvalStatus: "approved",
    approvalLevel: 1,
    totalApprovalLevels: 1,
    approvedBy: ["John Smith"],
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "approved", date: "2024-01-13", comments: "Verified and approved" }
    ],
    payments: [
      { id: "p2", paymentNumber: "PAY-2024-0079", paymentDate: "2024-01-14", amount: 59375, method: "ACH Transfer", reference: "ACH-001234", status: "completed", recordedBy: "Mike Wilson" }
    ]
  },
  { 
    id: "4", 
    invoiceNumber: "INV-2024-0097", 
    type: "customer", 
    party: "Micro Center Distribution", 
    issueDate: "2024-01-12", 
    dueDate: "2024-01-27", 
    amount: 18594, 
    paidAmount: 0, 
    status: "overdue",
    approvalStatus: "approved",
    approvalLevel: 1,
    totalApprovalLevels: 1,
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
    party: "Samsung Electronics", 
    issueDate: "2024-01-11", 
    dueDate: "2024-02-25", 
    amount: 31960, 
    paidAmount: 15000, 
    status: "partial",
    approvalStatus: "partially_approved",
    approvalLevel: 1,
    totalApprovalLevels: 2,
    approvedBy: ["John Smith"],
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "approved", date: "2024-01-11", comments: "First level approved" },
      { level: 2, approver: "Sarah Johnson (CFO)", action: "pending" }
    ],
    payments: [
      { id: "p3", paymentNumber: "PAY-2024-0077", paymentDate: "2024-01-12", amount: 15000, method: "Bank Transfer", reference: "TRF-123456", status: "completed", recordedBy: "Jane Doe" }
    ]
  },
  { 
    id: "6", 
    invoiceNumber: "INV-2024-0095", 
    type: "customer", 
    party: "Amazon Business Services", 
    issueDate: "2024-01-10", 
    dueDate: "2024-02-09", 
    amount: 134520, 
    paidAmount: 134520, 
    status: "paid",
    approvalStatus: "approved",
    approvedBy: ["John Smith", "Sarah Johnson"],
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "approved", date: "2024-01-10" },
      { level: 2, approver: "Sarah Johnson (CFO)", action: "approved", date: "2024-01-10" }
    ],
    payments: [
      { id: "p4", paymentNumber: "PAY-2024-0078", paymentDate: "2024-01-13", amount: 134520, method: "Wire Transfer", reference: "WIR-789456", status: "completed", recordedBy: "Mike Wilson" }
    ]
  },
  { 
    id: "7", 
    invoiceNumber: "INV-2024-0089", 
    type: "customer", 
    party: "CompuWorld Retailers", 
    issueDate: "2024-01-01", 
    dueDate: "2024-01-15", 
    amount: 18450, 
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
    party: "HP Inc.", 
    issueDate: "2024-01-09", 
    dueDate: "2024-02-08", 
    amount: 20913, 
    paidAmount: 20913, 
    status: "paid",
    approvalStatus: "approved",
    approvedBy: ["John Smith"],
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "approved", date: "2024-01-09" }
    ],
    payments: [
      { id: "p5", paymentNumber: "PAY-2024-0075", paymentDate: "2024-01-10", amount: 20913, method: "ACH Transfer", reference: "ACH-001233", status: "completed", recordedBy: "Jane Doe" }
    ]
  },
  { 
    id: "9", 
    invoiceNumber: "INV-2024-0093", 
    type: "customer", 
    party: "CDW Corporation", 
    issueDate: "2024-01-08", 
    dueDate: "2024-02-07", 
    amount: 89760, 
    paidAmount: 89760, 
    status: "paid",
    approvalStatus: "approved",
    approvedBy: ["John Smith", "Sarah Johnson"],
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "approved", date: "2024-01-08" },
      { level: 2, approver: "Sarah Johnson (CFO)", action: "approved", date: "2024-01-08" }
    ],
    payments: [
      { id: "p6", paymentNumber: "PAY-2024-0074", paymentDate: "2024-01-09", amount: 89760, method: "Wire Transfer", reference: "WIR-445566", status: "completed", recordedBy: "Mike Wilson" }
    ]
  },
  { 
    id: "10", 
    invoiceNumber: "INV-2024-0092", 
    type: "vendor", 
    party: "Lenovo Group Ltd", 
    issueDate: "2024-01-07", 
    dueDate: "2024-02-21", 
    amount: 77450, 
    paidAmount: 40000, 
    status: "partial",
    approvalStatus: "approved",
    approvedBy: ["John Smith"],
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "approved", date: "2024-01-07" }
    ],
    payments: [
      { id: "p7", paymentNumber: "PAY-2024-0073", paymentDate: "2024-01-08", amount: 40000, method: "Bank Transfer", reference: "TRF-556677", status: "completed", recordedBy: "Jane Doe" }
    ]
  },
  { 
    id: "11", 
    invoiceNumber: "INV-2024-0091", 
    type: "customer", 
    party: "Newegg Business", 
    issueDate: "2024-01-06", 
    dueDate: "2024-02-05", 
    amount: 76540, 
    paidAmount: 0, 
    status: "pending",
    approvalStatus: "pending_approval",
    approvalLevel: 1,
    totalApprovalLevels: 2,
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
    party: "Global Tech Distributors", 
    issueDate: "2024-01-05", 
    dueDate: "2024-02-04", 
    amount: 112340, 
    paidAmount: 112340, 
    status: "paid",
    approvalStatus: "approved",
    approvedBy: ["John Smith", "Sarah Johnson"],
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "approved", date: "2024-01-05" },
      { level: 2, approver: "Sarah Johnson (CFO)", action: "approved", date: "2024-01-05" }
    ],
    payments: [
      { id: "p8", paymentNumber: "PAY-2024-0072", paymentDate: "2024-01-07", amount: 112340, method: "Wire Transfer", reference: "WIR-667788", status: "completed", recordedBy: "Mike Wilson" }
    ]
  },
  { 
    id: "13", 
    invoiceNumber: "INV-2024-0088", 
    type: "vendor", 
    party: "LG Electronics", 
    issueDate: "2023-12-31", 
    dueDate: "2024-01-30", 
    amount: 62840, 
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
    party: "Office Depot Enterprise", 
    issueDate: "2023-12-30", 
    dueDate: "2024-01-29", 
    amount: 11850, 
    paidAmount: 11850, 
    status: "paid",
    approvalStatus: "approved",
    approvedBy: ["John Smith"],
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "approved", date: "2023-12-30" }
    ],
    payments: [
      { id: "p9", paymentNumber: "PAY-2024-0071", paymentDate: "2024-01-06", amount: 11850, method: "ACH Transfer", reference: "ACH-778899", status: "completed", recordedBy: "Jane Doe" }
    ]
  },
  { 
    id: "15", 
    invoiceNumber: "INV-2024-0086", 
    type: "vendor", 
    party: "Acer America", 
    issueDate: "2023-12-29", 
    dueDate: "2024-02-13", 
    amount: 44950, 
    paidAmount: 22000, 
    status: "partial",
    approvalStatus: "approved",
    approvedBy: ["John Smith", "Sarah Johnson"],
    approvalHistory: [
      { level: 1, approver: "John Smith (Finance Manager)", action: "approved", date: "2023-12-29" },
      { level: 2, approver: "Sarah Johnson (CFO)", action: "approved", date: "2023-12-29" }
    ],
    payments: [
      { id: "p10", paymentNumber: "PAY-2024-0070", paymentDate: "2024-01-05", amount: 22000, method: "ACH Transfer", reference: "ACH-001232", status: "completed", recordedBy: "Mike Wilson" }
    ]
  },
];

const mockOrders = [
  { orderNumber: "SO-2024-0123", party: "TechCorp Solutions", amount: 25750 },
  { orderNumber: "PO-2024-0045", party: "Dell Technologies", amount: 59375 },
];

const paymentMethods = ["Bank Transfer", "ACH Transfer", "Check", "Wire Transfer", "Credit Card"];

export default function FinancialManagement() {
  const { toast } = useToast();
  
  // State management
  const [activeTab, setActiveTab] = useState<"customer" | "vendor">("customer");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [approvalFilter, setApprovalFilter] = useState("all");
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

  // Filter invoices based on active tab
  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch = search === "" || 
      invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      invoice.party.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || invoice.status === statusFilter;
    const matchesTab = invoice.type === activeTab;
    const matchesApproval = approvalFilter === "all" || invoice.approvalStatus === approvalFilter;
    
    return matchesSearch && matchesStatus && matchesTab && matchesApproval;
  });

  // Apply advanced filters
  const finalInvoices = applyAdvancedFilters(filteredInvoices, activeFilters);

  // Calculate stats for active tab
  const tabInvoices = mockInvoices.filter(i => i.type === activeTab);
  const stats = {
    totalInvoices: tabInvoices.length,
    pendingApproval: tabInvoices.filter(i => i.approvalStatus === "pending_approval").length,
    partiallyApproved: tabInvoices.filter(i => i.approvalStatus === "partially_approved").length,
    approved: tabInvoices.filter(i => i.approvalStatus === "approved").length,
    totalOutstanding: tabInvoices.reduce((sum, inv) => sum + (inv.amount - inv.paidAmount), 0),
    overdue: tabInvoices.filter(i => i.status === "overdue").length,
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
      key: "approvalProgress",
      header: "Approval Progress",
      render: (invoice) => {
        const totalLevels = invoice.totalApprovalLevels || 1;
        const currentLevel = invoice.approvalStatus === "approved" 
          ? totalLevels 
          : invoice.approvalStatus === "rejected"
          ? invoice.approvalLevel - 1
          : invoice.approvalLevel || 1;
        
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Level {currentLevel} of {totalLevels}
              </Badge>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: totalLevels }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${
                    i < currentLevel - 1
                      ? "bg-green-500"
                      : i === currentLevel - 1
                      ? invoice.approvalStatus === "rejected"
                        ? "bg-red-500"
                        : "bg-green-500"
                      : "bg-blue-900"
                  }`}
                />
              ))}
            </div>
          </div>
        );
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
        const canApprove = invoice.approvalStatus === "pending_approval" || invoice.approvalStatus === "partially_approved";
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
    setApprovalFilter("all");
  };

  return (
    <PageBackground>
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Financial Management</h1>
            <p className="text-muted-foreground">
              Manage invoices with approval workflow and payment tracking
            </p>
          </div>
          
          {/* Tabs for Vendor and Customer */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "customer" | "vendor")}>
            <TabsList className="h-11 p-1 bg-muted/50">
              <TabsTrigger 
                value="customer" 
                className="px-6 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <User className="h-4 w-4 mr-2" />
                Customer Invoices
              </TabsTrigger>
              <TabsTrigger 
                value="vendor" 
                className="px-6 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <FileText className="h-4 w-4 mr-2" />
                Vendor Invoices
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
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
                Partially Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{stats.partiallyApproved}</p>
                <AlertCircle className="h-8 w-8 text-orange-500" />
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
                  ${tabInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0).toLocaleString()}
                </p>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <Card>
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

                {(activeFilters.length > 0 || search || statusFilter !== "All" || approvalFilter !== "all") && (
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
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl">{selectedInvoice.invoiceNumber}</DialogTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedInvoice.type === "customer" ? "Customer Invoice" : "Vendor Invoice"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedInvoice.type === "customer" ? "default" : "secondary"}>
                      {selectedInvoice.type === "customer" ? "Receivable" : "Payable"}
                    </Badge>
                    <StatusBadge status={selectedInvoice.status} />
                  </div>
                </div>
              </DialogHeader>
              <ScrollArea className="max-h-[calc(90vh-120px)]">
                <div className="pr-4">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="activity">Activity Log</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                      {/* Basic Info */}
                      <div className="grid grid-cols-2 gap-4">
                    <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Party</p>
                        </div>
                        <p className="font-semibold text-lg">{selectedInvoice.party}</p>
                      </CardContent>
                    </Card>
                    <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Issue Date</p>
                        </div>
                        <p className="font-semibold text-lg">{selectedInvoice.issueDate}</p>
                      </CardContent>
                    </Card>
                    <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Due Date</p>
                        </div>
                        <p className="font-semibold text-lg">{selectedInvoice.dueDate}</p>
                      </CardContent>
                    </Card>
                    <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <History className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Payment Terms</p>
                        </div>
                        <p className="font-semibold text-lg">Net 30</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Separator />

                  {/* Financial Summary */}
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      Financial Summary
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-blue-500/10 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                            <FileText className="h-5 w-5 text-blue-500 opacity-50" />
                          </div>
                          <p className="text-3xl font-bold">${selectedInvoice.amount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground mt-1">Invoice value</p>
                        </CardContent>
                      </Card>
                      <Card className="border-green-500/30 bg-gradient-to-br from-green-500/5 to-green-500/10 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-muted-foreground">Paid Amount</p>
                            <CheckCircle className="h-5 w-5 text-green-500 opacity-50" />
                          </div>
                          <p className="text-3xl font-bold text-green-600">
                            ${selectedInvoice.paidAmount.toLocaleString()}
                          </p>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>Payment progress</span>
                              <span>{Math.round((selectedInvoice.paidAmount / selectedInvoice.amount) * 100)}%</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 transition-all duration-500"
                                style={{ width: `${(selectedInvoice.paidAmount / selectedInvoice.amount) * 100}%` }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-red-500/30 bg-gradient-to-br from-red-500/5 to-red-500/10 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-muted-foreground">Balance Due</p>
                            <AlertTriangle className="h-5 w-5 text-red-500 opacity-50" />
                          </div>
                          <p className="text-3xl font-bold text-red-600">
                            ${(selectedInvoice.amount - selectedInvoice.paidAmount).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {selectedInvoice.paidAmount === 0 ? "Unpaid" : 
                             selectedInvoice.paidAmount >= selectedInvoice.amount ? "Fully paid" : "Partial payment"}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Separator />

                  {/* Approval Workflow */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Approval Workflow
                      </h3>
                      <Badge variant={
                        selectedInvoice.approvalStatus === "approved" ? "default" :
                        selectedInvoice.approvalStatus === "partially_approved" ? "secondary" :
                        selectedInvoice.approvalStatus === "pending_approval" ? "outline" :
                        selectedInvoice.approvalStatus === "rejected" ? "destructive" : "outline"
                      }>
                        {selectedInvoice.approvalStatus === "pending_approval" ? "Pending" :
                         selectedInvoice.approvalStatus === "partially_approved" ? "Partially Approved" :
                         selectedInvoice.approvalStatus === "approved" ? "Approved" :
                         selectedInvoice.approvalStatus === "rejected" ? "Rejected" : "Draft"}
                      </Badge>
                    </div>

                    {/* Approval Progress Bar */}
                    {selectedInvoice.totalApprovalLevels && (
                      <div className="mb-4 p-3 rounded-lg bg-muted/50 border">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">Level {selectedInvoice.approvalLevel || 1} of {selectedInvoice.totalApprovalLevels}</span>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: selectedInvoice.totalApprovalLevels }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 flex-1 rounded-full transition-all ${
                                i < (selectedInvoice.approvalLevel || 1) - 1
                                  ? "bg-green-500"
                                  : i === (selectedInvoice.approvalLevel || 1) - 1
                                  ? "bg-primary"
                                  : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {selectedInvoice.approvalHistory?.map((action, index) => (
                        <div key={index} className="group flex items-start gap-3 p-4 rounded-lg border hover:border-primary/40 hover:shadow-md transition-all duration-200 bg-gradient-to-r hover:from-primary/5">
                          <div className="mt-1 p-2 rounded-lg bg-muted/50 group-hover:scale-110 transition-transform duration-200">
                            {action.action === "approved" && (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                            {action.action === "rejected" && (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                            {action.action === "pending" && (
                              <Clock className="h-5 w-5 text-yellow-600 animate-pulse" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <div>
                                <p className="font-semibold text-sm">Level {action.level}</p>
                                <p className="text-sm text-muted-foreground">{action.approver}</p>
                              </div>
                              <Badge variant={
                                action.action === "approved" ? "default" :
                                action.action === "rejected" ? "destructive" : "secondary"
                              } className="font-medium">
                                {action.action === "approved" ? "✓ Approved" :
                                 action.action === "rejected" ? "✗ Rejected" : "⏳ Pending"}
                              </Badge>
                            </div>
                            {action.date && (
                              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {action.date}
                              </p>
                            )}
                            {action.comments && (
                              <div className="mt-3 p-2 rounded bg-muted/30 border-l-2 border-primary">
                                <p className="text-sm text-muted-foreground italic">
                                  "{action.comments}"
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Approval Actions */}
                    {(selectedInvoice.approvalStatus === "pending_approval" || selectedInvoice.approvalStatus === "partially_approved") && (
                      <Card className="mt-4 border-primary/30 bg-gradient-to-br from-primary/5 via-primary/10 to-blue-500/5">
                        <CardContent className="pt-6 pb-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/20">
                              <AlertCircle className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-base">Action Required</p>
                              <p className="text-xs text-muted-foreground">
                                This invoice is awaiting your approval at Level {selectedInvoice.approvalLevel || 1}
                              </p>
                            </div>
                          </div>

                          <Separator className="mb-4" />

                          {/* Comments Section */}
                          <div className="mb-4">
                            <Label htmlFor="approval-comments" className="text-sm font-medium mb-2 flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Comments (Optional)
                            </Label>
                            <Textarea
                              id="approval-comments"
                              placeholder="Add your comments or reason for this decision..."
                              className="min-h-[80px] resize-none"
                              value={approvalComments}
                              onChange={(e) => setApprovalComments(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Your comments will be visible in the approval history
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-3 gap-3">
                            <Button 
                              className="gap-2 hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md" 
                              variant="default"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span className="font-semibold">Approve</span>
                            </Button>
                            <Button 
                              className="gap-2 hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md" 
                              variant="destructive"
                            >
                              <XCircle className="h-4 w-4" />
                              <span className="font-semibold">Reject</span>
                            </Button>
                            <Button 
                              className="gap-2 hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md" 
                              variant="outline"
                            >
                              <AlertCircle className="h-4 w-4" />
                              <span className="font-semibold">Request Changes</span>
                            </Button>
                          </div>

                          {/* Quick Info */}
                          <div className="mt-4 p-3 rounded-lg bg-muted/30 border">
                            <div className="flex items-start gap-2 text-xs text-muted-foreground">
                              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <div className="space-y-1">
                                <p><strong>Approve:</strong> Move invoice to next approval level or mark as fully approved</p>
                                <p><strong>Reject:</strong> Decline the invoice and send back to requester</p>
                                <p><strong>Request Changes:</strong> Ask for modifications before approval</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
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
                        {selectedInvoice.payments.map((payment, idx) => (
                          <Card key={payment.id} className="border-green-500/20 hover:border-green-500/40 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-green-500/5">
                            <CardContent className="pt-4 pb-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-lg bg-green-500/10">
                                    <CreditCard className="h-5 w-5 text-green-600" />
                                  </div>
                                  <div>
                                    <p className="font-mono font-semibold text-sm">{payment.paymentNumber}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                                      <Calendar className="h-3 w-3" />
                                      {payment.paymentDate}
                                      <span>•</span>
                                      {payment.method}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <StatusBadge status={payment.status} />
                                  <Badge variant="outline" className="text-xs">Payment {idx + 1}</Badge>
                                </div>
                              </div>
                              <Separator className="my-3" />
                              <div className="grid grid-cols-3 gap-4">
                                <div className="flex items-center gap-2">
                                  <div className="p-2 rounded bg-green-500/10">
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Amount</p>
                                    <p className="font-bold text-green-600 text-lg">
                                      ${payment.amount.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="p-2 rounded bg-muted">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Reference</p>
                                    <p className="font-mono text-sm font-medium">{payment.reference}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="p-2 rounded bg-muted">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Recorded By</p>
                                    <p className="text-sm font-medium">{payment.recordedBy}</p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="border-dashed">
                        <CardContent className="py-12">
                          <div className="text-center text-muted-foreground">
                            <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                              <Receipt className="h-8 w-8 opacity-50" />
                            </div>
                            <p className="font-medium">No payments recorded yet</p>
                            <p className="text-sm mt-1">Payment history will appear here</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                    </TabsContent>

                    <TabsContent value="activity" className="space-y-4">
                      <div className="rounded-lg border bg-card">
                        <div className="p-4 border-b">
                          <h3 className="font-semibold flex items-center gap-2">
                            <History className="h-5 w-5 text-primary" />
                            Complete Activity Timeline
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Full history of all actions and events for this invoice
                          </p>
                        </div>
                        <div className="p-4">
                          <div className="space-y-4">
                            {/* Invoice Created */}
                            <div className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
                              <div className="flex flex-col items-center">
                                <div className="p-2 rounded-full bg-blue-500/10 border-2 border-blue-500/20">
                                  <FileText className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="w-px h-full bg-border mt-2"></div>
                              </div>
                              <div className="flex-1 pt-1">
                                <div className="flex items-start justify-between mb-1">
                                  <div>
                                    <p className="font-semibold text-sm">Invoice Created</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      Invoice {selectedInvoice.invoiceNumber} was generated
                                    </p>
                                  </div>
                                  <Badge variant="outline" className="text-xs">Created</Badge>
                                </div>
                                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {selectedInvoice.issueDate}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    System
                                  </span>
                                </div>
                                <div className="mt-2 p-2 rounded bg-muted/30 text-xs">
                                  <p><strong>Party:</strong> {selectedInvoice.party}</p>
                                  <p><strong>Amount:</strong> ${selectedInvoice.amount.toLocaleString()}</p>
                                  <p><strong>Type:</strong> {selectedInvoice.type === "customer" ? "Customer Invoice (Receivable)" : "Vendor Invoice (Payable)"}</p>
                                </div>
                              </div>
                            </div>

                            {/* Approval History */}
                            {selectedInvoice.approvalHistory?.map((action, index) => (
                              <div key={index} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
                                <div className="flex flex-col items-center">
                                  <div className={`p-2 rounded-full border-2 ${
                                    action.action === "approved" ? "bg-green-500/10 border-green-500/20" :
                                    action.action === "rejected" ? "bg-red-500/10 border-red-500/20" :
                                    "bg-yellow-500/10 border-yellow-500/20"
                                  }`}>
                                    {action.action === "approved" && <CheckCircle className="h-4 w-4 text-green-600" />}
                                    {action.action === "rejected" && <XCircle className="h-4 w-4 text-red-600" />}
                                    {action.action === "pending" && <Clock className="h-4 w-4 text-yellow-600" />}
                                  </div>
                                  <div className="w-px h-full bg-border mt-2"></div>
                                </div>
                                <div className="flex-1 pt-1">
                                  <div className="flex items-start justify-between mb-1">
                                    <div>
                                      <p className="font-semibold text-sm">
                                        {action.action === "approved" ? "Approval Granted" :
                                         action.action === "rejected" ? "Approval Rejected" : "Pending Approval"}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-0.5">
                                        Level {action.level} approval {action.action === "pending" ? "is pending" : action.action}
                                      </p>
                                    </div>
                                    <Badge variant={
                                      action.action === "approved" ? "default" :
                                      action.action === "rejected" ? "destructive" : "secondary"
                                    } className="text-xs">
                                      {action.action === "approved" ? "✓ Approved" :
                                       action.action === "rejected" ? "✗ Rejected" : "⏳ Pending"}
                                    </Badge>
                                  </div>
                                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                                    {action.date && (
                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {action.date}
                                      </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      {action.approver}
                                    </span>
                                  </div>
                                  {action.comments && (
                                    <div className="mt-2 p-2 rounded bg-muted/30 border-l-2 border-primary text-xs">
                                      <p className="text-muted-foreground italic">"{action.comments}"</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}

                            {/* Payment History */}
                            {selectedInvoice.payments && selectedInvoice.payments.length > 0 && selectedInvoice.payments.map((payment, idx) => (
                              <div key={payment.id} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
                                <div className="flex flex-col items-center">
                                  <div className="p-2 rounded-full bg-green-500/10 border-2 border-green-500/20">
                                    <CreditCard className="h-4 w-4 text-green-600" />
                                  </div>
                                  <div className="w-px h-full bg-border mt-2"></div>
                                </div>
                                <div className="flex-1 pt-1">
                                  <div className="flex items-start justify-between mb-1">
                                    <div>
                                      <p className="font-semibold text-sm">Payment Recorded</p>
                                      <p className="text-xs text-muted-foreground mt-0.5">
                                        Payment #{idx + 1} received and processed
                                      </p>
                                    </div>
                                    <Badge variant="default" className="text-xs bg-green-600">
                                      ${payment.amount.toLocaleString()}
                                    </Badge>
                                  </div>
                                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {payment.paymentDate}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      {payment.recordedBy}
                                    </span>
                                  </div>
                                  <div className="mt-2 p-2 rounded bg-muted/30 text-xs">
                                    <p><strong>Payment Number:</strong> {payment.paymentNumber}</p>
                                    <p><strong>Method:</strong> {payment.method}</p>
                                    <p><strong>Reference:</strong> {payment.reference}</p>
                                    <p><strong>Status:</strong> {payment.status}</p>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* Current Status */}
                            <div className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <div className={`p-2 rounded-full border-2 ${
                                  selectedInvoice.paidAmount >= selectedInvoice.amount 
                                    ? "bg-green-500/10 border-green-500/20" 
                                    : "bg-blue-500/10 border-blue-500/20"
                                }`}>
                                  {selectedInvoice.paidAmount >= selectedInvoice.amount 
                                    ? <CheckCircle className="h-4 w-4 text-green-600" />
                                    : <AlertTriangle className="h-4 w-4 text-blue-600" />
                                  }
                                </div>
                              </div>
                              <div className="flex-1 pt-1">
                                <div className="flex items-start justify-between mb-1">
                                  <div>
                                    <p className="font-semibold text-sm">Current Status</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {selectedInvoice.paidAmount >= selectedInvoice.amount 
                                        ? "Invoice fully paid and closed" 
                                        : selectedInvoice.paidAmount > 0
                                        ? "Partial payment received, balance pending"
                                        : "Awaiting payment"}
                                    </p>
                                  </div>
                                  <StatusBadge status={selectedInvoice.status} />
                                </div>
                                <div className="mt-2 p-2 rounded bg-muted/30 text-xs">
                                  <div className="flex justify-between mb-1">
                                    <span>Total Amount:</span>
                                    <span className="font-semibold">${selectedInvoice.amount.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between mb-1">
                                    <span>Paid Amount:</span>
                                    <span className="font-semibold text-green-600">${selectedInvoice.paidAmount.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between pt-1 border-t">
                                    <span>Balance Due:</span>
                                    <span className="font-semibold text-red-600">
                                      ${(selectedInvoice.amount - selectedInvoice.paidAmount).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
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
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-blue-500/20">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">Review Invoice</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedInvoice.invoiceNumber} • Level {selectedInvoice.approvalLevel || 1} Approval
                    </p>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Invoice Summary */}
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Party</p>
                          <p className="font-semibold text-sm">{selectedInvoice.party}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/10">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Amount</p>
                          <p className="text-lg font-bold text-green-600">${selectedInvoice.amount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                          <Calendar className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Due Date</p>
                          <p className="font-semibold text-sm">{selectedInvoice.dueDate}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Approval Progress */}
                {selectedInvoice.totalApprovalLevels && selectedInvoice.totalApprovalLevels > 1 && (
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Approval Progress
                      </p>
                      <Badge variant="outline">
                        Level {selectedInvoice.approvalLevel || 1} of {selectedInvoice.totalApprovalLevels}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {Array.from({ length: selectedInvoice.totalApprovalLevels }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full transition-all ${
                            i < (selectedInvoice.approvalLevel || 1) - 1
                              ? "bg-green-500"
                              : i === (selectedInvoice.approvalLevel || 1) - 1
                              ? "bg-primary animate-pulse"
                              : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {selectedInvoice.approvalLevel === selectedInvoice.totalApprovalLevels
                        ? "This is the final approval level"
                        : `${selectedInvoice.totalApprovalLevels - (selectedInvoice.approvalLevel || 1)} more level(s) required after this`}
                    </p>
                  </div>
                )}

                {/* Previous Approvals */}
                {selectedInvoice.approvalHistory && selectedInvoice.approvalHistory.filter(a => a.action === "approved").length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Previous Approvals
                    </p>
                    <div className="space-y-2">
                      {selectedInvoice.approvalHistory
                        .filter(a => a.action === "approved")
                        .map((approval, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm p-2 rounded bg-green-500/5 border border-green-500/20">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="font-medium">Level {approval.level}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">{approval.approver}</span>
                            {approval.date && (
                              <>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">{approval.date}</span>
                              </>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Comments Section */}
                <div className="space-y-2">
                  <Label htmlFor="approval-comments-modal" className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Your Decision & Comments
                  </Label>
                  <Textarea
                    id="approval-comments-modal"
                    placeholder="Provide your feedback, reasoning, or any additional notes for this decision..."
                    className="min-h-[100px] resize-none"
                    value={approvalComments}
                    onChange={(e) => setApprovalComments(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Comments will be added to approval history and visible to all stakeholders
                  </p>
                </div>

                {/* Action Guidance */}
                <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2 text-sm">
                        <p className="font-medium text-amber-900 dark:text-amber-100">Before you decide:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Verify invoice details and amount are correct</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Ensure party information matches your records</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Check if additional documentation is required</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setApprovalModalOpen(false)} className="gap-2">
                  <XCircle className="h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleReject}
                  className="gap-2 hover:scale-105 transition-transform"
                >
                  <XCircle className="h-4 w-4" />
                  Reject Invoice
                </Button>
                <Button 
                  onClick={handleApprove}
                  className="gap-2 hover:scale-105 transition-transform shadow-md hover:shadow-lg"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve Invoice
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Record Payment Modal */}
        {selectedInvoice && (
          <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">Record Payment</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedInvoice.invoiceNumber} • {selectedInvoice.party}
                    </p>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Invoice Summary */}
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <p className="text-xs text-muted-foreground mb-1">Invoice Total</p>
                        <p className="text-2xl font-bold">${selectedInvoice.amount.toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                        <p className="text-xs text-muted-foreground mb-1">Already Paid</p>
                        <p className="text-2xl font-bold text-green-600">
                          ${selectedInvoice.paidAmount.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                        <p className="text-xs text-muted-foreground mb-1">Balance Due</p>
                        <p className="text-2xl font-bold text-red-600">
                          ${(selectedInvoice.amount - selectedInvoice.paidAmount).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Payment Progress */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>Payment Progress</span>
                        <span className="font-medium">
                          {Math.round((selectedInvoice.paidAmount / selectedInvoice.amount) * 100)}% Complete
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                          style={{ width: `${(selectedInvoice.paidAmount / selectedInvoice.amount) * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Details Form */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="paymentAmount" className="text-sm font-medium flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4" />
                      Payment Amount
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                      <Input
                        id="paymentAmount"
                        type="number"
                        placeholder="0.00"
                        className="pl-7 text-lg font-semibold"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPaymentAmount(((selectedInvoice.amount - selectedInvoice.paidAmount) / 2).toFixed(2))}
                        className="text-xs"
                      >
                        50% Balance
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPaymentAmount((selectedInvoice.amount - selectedInvoice.paidAmount).toFixed(2))}
                        className="text-xs"
                      >
                        Full Balance
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="paymentMethod" className="text-sm font-medium flex items-center gap-2 mb-2">
                      <CreditCard className="h-4 w-4" />
                      Payment Method
                    </Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger id="paymentMethod">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map(method => (
                          <SelectItem key={method} value={method}>
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              {method}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="reference" className="text-sm font-medium flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4" />
                      Reference / Transaction Number
                    </Label>
                    <Input
                      id="reference"
                      placeholder="e.g., TRN-123456, Check #789"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter transaction ID, check number, or any reference for this payment
                    </p>
                  </div>
                </div>

                {/* Payment Info */}
                <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2 text-sm">
                        <p className="font-medium text-blue-900 dark:text-blue-100">Payment Information:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Payment will be recorded immediately upon submission</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Invoice status will update based on the payment amount</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Payment history will be visible in invoice details</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <DialogFooter className="gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setPaymentModalOpen(false)}
                  className="gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleRecordPayment}
                  className="gap-2 hover:scale-105 transition-transform shadow-md hover:shadow-lg"
                  disabled={!paymentAmount || !paymentMethod || !paymentReference}
                >
                  <CheckCircle className="h-4 w-4" />
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
            { key: "approvalProgress", label: "Approval Progress", enabled: true },
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