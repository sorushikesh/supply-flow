import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  MessageSquare,
  AlertCircle,
  Send
} from "lucide-react";

export interface ApprovalRequest {
  id: string;
  documentType: "purchase_order" | "sales_order" | "invoice";
  documentNumber: string;
  documentId: string;
  amount: number;
  requestedBy: string;
  requestedDate: string;
  currentApprover: string;
  approvalLevel: number;
  totalLevels: number;
  status: "pending" | "approved" | "rejected" | "partially_approved";
  description: string;
  history: ApprovalHistory[];
}

export interface ApprovalHistory {
  id: string;
  approver: string;
  role: string;
  action: "approved" | "rejected" | "requested_changes";
  timestamp: string;
  comments?: string;
}

interface ApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: ApprovalRequest | null;
  onApprove: (requestId: string, comments: string) => void;
  onReject: (requestId: string, comments: string) => void;
  onRequestChanges: (requestId: string, comments: string) => void;
  currentUserRole?: string;
}

export function ApprovalDialog({
  open,
  onOpenChange,
  request,
  onApprove,
  onReject,
  onRequestChanges,
  currentUserRole = "Manager",
}: ApprovalDialogProps) {
  const [comments, setComments] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (action: "approve" | "reject" | "request_changes") => {
    if (!request) return;
    
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (action === "approve") {
      onApprove(request.id, comments);
    } else if (action === "reject") {
      onReject(request.id, comments);
    } else {
      onRequestChanges(request.id, comments);
    }
    
    setComments("");
    setIsProcessing(false);
    onOpenChange(false);
  };

  if (!request) return null;

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

  const getActionIcon = (action: string) => {
    switch (action) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "requested_changes":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "approved":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      case "requested_changes":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>Approval Request</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {request.documentNumber}
                </Badge>
              </div>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                {getDocumentTypeLabel(request.documentType)} • Level {request.approvalLevel} of {request.totalLevels}
              </p>
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Review and take action on the approval request for {request.documentNumber}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="space-y-6 py-4">
            {/* Request Details */}
            <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-primary" />
                Request Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Requested By</p>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-3 w-3 text-primary" />
                    <p className="text-sm font-medium">{request.requestedBy}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Request Date</p>
                  <p className="text-sm font-medium mt-1">
                    {new Date(request.requestedDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Amount</p>
                  <p className="text-lg font-bold text-primary mt-1">
                    ${request.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Current Approver</p>
                  <Badge variant="secondary" className="mt-1">
                    {request.currentApprover}
                  </Badge>
                </div>
              </div>
              {request.description && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{request.description}</p>
                </div>
              )}
            </div>

            {/* Approval Progress */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Approval Progress
              </h3>
              <div className="flex items-center gap-2">
                {Array.from({ length: request.totalLevels }).map((_, index) => {
                  const level = index + 1;
                  const isCompleted = level < request.approvalLevel;
                  const isCurrent = level === request.approvalLevel;
                  
                  return (
                    <div key={level} className="flex items-center flex-1">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                          isCompleted
                            ? "bg-green-500 border-green-500 text-white"
                            : isCurrent
                            ? "bg-primary border-primary text-primary-foreground animate-pulse"
                            : "bg-muted border-muted-foreground/30 text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <span className="text-xs font-bold">{level}</span>
                        )}
                      </div>
                      {level < request.totalLevels && (
                        <div
                          className={`flex-1 h-0.5 mx-1 ${
                            isCompleted ? "bg-green-500" : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Level 1</span>
                <span>Level {request.totalLevels}</span>
              </div>
            </div>

            {/* Approval History */}
            {request.history.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  Approval History
                </h3>
                <div className="space-y-3">
                  {request.history.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-lg border p-3 ${getActionColor(item.action)}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {getActionIcon(item.action)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold">{item.approver}</p>
                              <Badge variant="outline" className="text-xs">
                                {item.role}
                              </Badge>
                              <span className="text-xs capitalize font-medium">
                                {item.action.replace("_", " ")}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(item.timestamp).toLocaleString()}
                            </p>
                            {item.comments && (
                              <div className="mt-2 p-2 rounded bg-background/50 border border-border/50">
                                <p className="text-xs italic">{item.comments}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Comments Section */}
            <div className="space-y-3">
              <Label htmlFor="approval-comments" className="flex items-center gap-2 text-sm font-semibold">
                <Send className="h-4 w-4 text-primary" />
                Your Comments {request.status === "pending" ? "(Optional)" : ""}
              </Label>
              <Textarea
                id="approval-comments"
                placeholder={`Add comments or notes about this ${getDocumentTypeLabel(request.documentType).toLowerCase()}...`}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Your comments will be visible to all approvers and the requester
              </p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAction("request_changes")}
            disabled={isProcessing}
            className="border-amber-500/50 text-amber-600 hover:bg-amber-500/10"
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Request Changes
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleAction("reject")}
            disabled={isProcessing}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
          <Button
            onClick={() => handleAction("approve")}
            disabled={isProcessing}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Mock data generator for approval requests
export function generateMockApprovalRequests(): ApprovalRequest[] {
  const documentTypes: ApprovalRequest["documentType"][] = ["purchase_order", "sales_order", "invoice"];
  const requesters = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams"];
  const approvers = ["Manager", "Director", "Finance Head", "CEO"];
  const statuses: ApprovalRequest["status"][] = ["pending", "approved", "rejected", "partially_approved"];

  return Array.from({ length: 15 }, (_, i) => {
    const docType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
    const level = Math.floor(Math.random() * 3) + 1;
    const totalLevels = Math.floor(Math.random() * 2) + 2; // 2 or 3 levels
    const historyCount = Math.max(0, level - 1);
    
    let docPrefix = "";
    switch (docType) {
      case "purchase_order":
        docPrefix = "PO";
        break;
      case "sales_order":
        docPrefix = "SO";
        break;
      case "invoice":
        docPrefix = "INV";
        break;
    }

    const history: ApprovalHistory[] = Array.from({ length: historyCount }, (_, j) => ({
      id: `hist-${i}-${j}`,
      approver: requesters[Math.floor(Math.random() * requesters.length)],
      role: approvers[j],
      action: "approved" as const,
      timestamp: new Date(Date.now() - (historyCount - j) * 24 * 60 * 60 * 1000).toISOString(),
      comments: Math.random() > 0.5 ? "Approved. All details verified." : undefined,
    }));

    return {
      id: `approval-${i + 1}`,
      documentType: docType,
      documentNumber: `${docPrefix}-2024-${String(100 + i).padStart(4, "0")}`,
      documentId: String(i + 1),
      amount: Math.floor(Math.random() * 50000) + 5000,
      requestedBy: requesters[Math.floor(Math.random() * requesters.length)],
      requestedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      currentApprover: approvers[level - 1],
      approvalLevel: level,
      totalLevels,
      status: level === 1 ? "pending" : statuses[Math.floor(Math.random() * statuses.length)],
      description: `Request for approval of ${docType.replace("_", " ")} with total amount of $${(Math.floor(Math.random() * 50000) + 5000).toLocaleString()}`,
      history,
    };
  });
}
