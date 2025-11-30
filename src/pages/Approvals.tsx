import { useState } from "react";
import { PageBackground } from "@/components/PageBackground";
import { SearchFilter } from "@/components/SearchFilter";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge, type StatusType } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  FileText,
  ShoppingCart,
  ClipboardList,
  TrendingUp,
  Eye,
} from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { 
  ApprovalDialog, 
  generateMockApprovalRequests, 
  type ApprovalRequest 
} from "@/components/ApprovalDialog";

export default function Approvals() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>(
    generateMockApprovalRequests()
  );

  const handleApprove = (requestId: string, comments: string) => {
    setApprovalRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: req.approvalLevel === req.totalLevels ? "approved" : "partially_approved",
              approvalLevel: req.approvalLevel + 1,
              history: [
                ...req.history,
                {
                  id: `hist-${Date.now()}`,
                  approver: "John Doe (You)",
                  role: req.currentApprover,
                  action: "approved" as const,
                  timestamp: new Date().toISOString(),
                  comments: comments || undefined,
                },
              ],
            }
          : req
      )
    );

    toast({
      title: "Request Approved",
      description: `${selectedRequest?.documentNumber} has been approved successfully.`,
    });
  };

  const handleReject = (requestId: string, comments: string) => {
    setApprovalRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: "rejected",
              history: [
                ...req.history,
                {
                  id: `hist-${Date.now()}`,
                  approver: "John Doe (You)",
                  role: req.currentApprover,
                  action: "rejected" as const,
                  timestamp: new Date().toISOString(),
                  comments: comments || "Request rejected",
                },
              ],
            }
          : req
      )
    );

    toast({
      title: "Request Rejected",
      description: `${selectedRequest?.documentNumber} has been rejected.`,
      variant: "destructive",
    });
  };

  const handleRequestChanges = (requestId: string, comments: string) => {
    setApprovalRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              history: [
                ...req.history,
                {
                  id: `hist-${Date.now()}`,
                  approver: "John Doe (You)",
                  role: req.currentApprover,
                  action: "requested_changes" as const,
                  timestamp: new Date().toISOString(),
                  comments: comments || "Changes requested",
                },
              ],
            }
          : req
      )
    );

    toast({
      title: "Changes Requested",
      description: `Requester will be notified to make changes to ${selectedRequest?.documentNumber}.`,
    });
  };

  const handleViewDetails = (request: ApprovalRequest) => {
    setSelectedRequest(request);
    setApprovalDialogOpen(true);
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case "purchase_order":
        return <ShoppingCart className="h-4 w-4" />;
      case "sales_order":
        return <ClipboardList className="h-4 w-4" />;
      case "invoice":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case "purchase_order":
        return "Purchase Order";
      case "sales_order":
        return "Sales Order";
      case "invoice":
        return "Invoice";
      default:
        return type;
    }
  };

  const getStatusBadge = (status: ApprovalRequest["status"]) => {
    switch (status) {
      case "pending":
        return <StatusBadge status="pending" />;
      case "approved":
        return <StatusBadge status="approved" />;
      case "rejected":
        return <StatusBadge status="rejected" />;
      case "partially_approved":
        return <StatusBadge status="processing" />;
      default:
        return <StatusBadge status="pending" />;
    }
  };

  const columns: Column<ApprovalRequest>[] = [
    {
      key: "documentNumber",
      header: "Document",
      className: "font-mono text-sm",
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-primary/10">
            {getDocumentTypeIcon(item.documentType)}
          </div>
          <div>
            <p className="font-semibold">{item.documentNumber}</p>
            <p className="text-xs text-muted-foreground">
              {getDocumentTypeLabel(item.documentType)}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      className: "font-mono text-right",
      render: (item) => (
        <span className="text-base font-bold text-primary">
          ${item.amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: "requestedBy",
      header: "Requested By",
      render: (item) => (
        <div>
          <p className="font-medium">{item.requestedBy}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(item.requestedDate).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => getStatusBadge(item.status),
    },
    {
      key: "approvalLevel",
      header: "Progress",
      render: (item) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Level {item.approvalLevel} of {item.totalLevels}
            </Badge>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: item.totalLevels }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  i < item.approvalLevel - 1
                    ? "bg-green-500"
                    : i === item.approvalLevel - 1
                    ? item.status === "rejected"
                      ? "bg-red-500"
                      : "bg-green-500"
                    : "bg-blue-900"
                }`}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      key: "currentApprover",
      header: "Current Approver",
      render: (item) => (
        <Badge variant="secondary" className="font-medium">
          {item.currentApprover}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleViewDetails(item)}
                className="hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Review approval request</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ];

  const filteredData = approvalRequests.filter((item) => {
    const matchesSearch =
      item.documentNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.requestedBy.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All" || item.documentType === typeFilter;
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const pendingRequests = filteredData.filter((r) => r.status === "pending");
  const approvedRequests = filteredData.filter((r) => r.status === "approved");
  const partiallyApprovedRequests = filteredData.filter(
    (r) => r.status === "partially_approved"
  );
  const rejectedRequests = filteredData.filter((r) => r.status === "rejected");

  const totalPendingAmount = pendingRequests.reduce((sum, r) => sum + r.amount, 0);

  return (
    <PageBackground>
      <div className="relative z-10 p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Approvals</h1>
          <p className="text-muted-foreground">
            Review and manage pending approval requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Approval
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold">{pendingRequests.length}</p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    ${totalPendingAmount.toLocaleString()}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-amber-500 opacity-70" />
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
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold">{approvedRequests.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500 opacity-70" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold">{partiallyApprovedRequests.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Multi-level</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500 opacity-70" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold">{rejectedRequests.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500 opacity-70" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <SearchFilter
                  searchValue={search}
                  onSearchChange={setSearch}
                  searchPlaceholder="Search by document number or requester..."
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Document Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="purchase_order">Purchase Orders</SelectItem>
                  <SelectItem value="sales_order">Sales Orders</SelectItem>
                  <SelectItem value="invoice">Invoices</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partially_approved">In Progress</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Approval Requests Tabs */}
        <Tabs defaultValue="pending" className="mt-6 space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Pending
              {pendingRequests.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {pendingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="in-progress" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              In Progress
              {partiallyApprovedRequests.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {partiallyApprovedRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              <XCircle className="h-4 w-4" />
              Rejected
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardContent className="pt-6">
                {pendingRequests.length > 0 ? (
                  <DataTable
                    columns={columns}
                    data={pendingRequests}
                    pageSize={10}
                    testIdPrefix="pending-approvals"
                  />
                ) : (
                  <EmptyState
                    icon={Clock}
                    title="No Pending Approvals"
                    description="All approval requests have been processed. Great job!"
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="in-progress">
            <Card>
              <CardContent className="pt-6">
                {partiallyApprovedRequests.length > 0 ? (
                  <DataTable
                    columns={columns}
                    data={partiallyApprovedRequests}
                    pageSize={10}
                    testIdPrefix="inprogress-approvals"
                  />
                ) : (
                  <EmptyState
                    icon={TrendingUp}
                    title="No In-Progress Approvals"
                    description="No multi-level approvals are currently in progress."
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved">
            <Card>
              <CardContent className="pt-6">
                {approvedRequests.length > 0 ? (
                  <DataTable
                    columns={columns}
                    data={approvedRequests}
                    pageSize={10}
                    testIdPrefix="approved-approvals"
                  />
                ) : (
                  <EmptyState
                    icon={CheckCircle2}
                    title="No Approved Requests"
                    description="Approved requests will appear here."
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected">
            <Card>
              <CardContent className="pt-6">
                {rejectedRequests.length > 0 ? (
                  <DataTable
                    columns={columns}
                    data={rejectedRequests}
                    pageSize={10}
                    testIdPrefix="rejected-approvals"
                  />
                ) : (
                  <EmptyState
                    icon={XCircle}
                    title="No Rejected Requests"
                    description="Rejected requests will appear here."
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Approval Dialog */}
        <ApprovalDialog
          open={approvalDialogOpen}
          onOpenChange={setApprovalDialogOpen}
          request={selectedRequest}
          onApprove={handleApprove}
          onReject={handleReject}
          onRequestChanges={handleRequestChanges}
        />
      </div>
    </PageBackground>
  );
}
