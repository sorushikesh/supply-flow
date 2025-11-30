import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  History, 
  Plus, 
  Pencil, 
  Trash2, 
  User, 
  Clock,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from "lucide-react";

export interface ActivityLog {
  id: string;
  action: "create" | "update" | "delete" | "approve" | "reject";
  entity: string;
  entityId: string;
  description: string;
  user: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface ActivityLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logs: ActivityLog[];
  title?: string;
}

export function ActivityLogDialog({
  open,
  onOpenChange,
  logs,
  title = "Activity Log",
}: ActivityLogDialogProps) {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create":
        return <Plus className="h-4 w-4 text-green-600" />;
      case "update":
        return <Pencil className="h-4 w-4 text-blue-600" />;
      case "delete":
        return <Trash2 className="h-4 w-4 text-red-600" />;
      case "approve":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "reject":
        return <XCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <History className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "update":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "delete":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      case "approve":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "reject":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.description.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.entity.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Complete audit trail of all system activities
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={actionFilter} onValueChange={setActionFilter} className="w-auto">
              <TabsList>
                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                <TabsTrigger value="create" className="text-xs">Created</TabsTrigger>
                <TabsTrigger value="update" className="text-xs">Updated</TabsTrigger>
                <TabsTrigger value="delete" className="text-xs">Deleted</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Activity List */}
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {filteredLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Filter className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">
                    No activities found
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                filteredLogs.map((log, index) => (
                  <div
                    key={log.id}
                    className="flex gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className={`p-2 rounded-full ${getActionColor(log.action)}`}>
                        {getActionIcon(log.action)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <Badge variant="outline" className="text-xs mb-1">
                            {log.entity}
                          </Badge>
                          <p className="text-sm font-medium">{log.description}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{log.user}</span>
                        <span>•</span>
                        <Clock className="h-3 w-3" />
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <div className="mt-2 p-3 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200/30 dark:border-blue-800/30 rounded-lg">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Pencil className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                            <span className="text-xs font-semibold text-blue-900 dark:text-blue-300">Change Details</span>
                          </div>
                          <div className="space-y-2">
                            {Object.entries(log.metadata).map(([key, value]) => {
                              const formattedKey = key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, (str) => str.toUpperCase())
                                .trim();
                              
                              if (key === 'field') {
                                return (
                                  <div key={key} className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-muted-foreground min-w-[80px]">Field Changed:</span>
                                    <Badge variant="secondary" className="text-xs font-mono">
                                      {String(value)}
                                    </Badge>
                                  </div>
                                );
                              }
                              
                              if (key === 'oldValue') {
                                return (
                                  <div key={key} className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-muted-foreground min-w-[80px]">Previous:</span>
                                    <span className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded border border-red-200 dark:border-red-800 font-mono line-through">
                                      {String(value)}
                                    </span>
                                  </div>
                                );
                              }
                              
                              if (key === 'newValue') {
                                return (
                                  <div key={key} className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-muted-foreground min-w-[80px]">Updated To:</span>
                                    <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded border border-green-200 dark:border-green-800 font-mono font-semibold">
                                      {String(value)}
                                    </span>
                                  </div>
                                );
                              }
                              
                              return (
                                <div key={key} className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-muted-foreground min-w-[80px]">{formattedKey}:</span>
                                  <span className="text-xs font-mono text-foreground">{String(value)}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Summary */}
          <div className="flex items-center justify-between pt-4 border-t text-xs text-muted-foreground">
            <span>Showing {filteredLogs.length} of {logs.length} activities</span>
            <Badge variant="secondary">{logs.length} total logs</Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Mock data generator for demonstration
export const generateMockActivityLogs = (): ActivityLog[] => {
  const actions: ActivityLog["action"][] = ["create", "update", "delete", "approve", "reject"];
  const entities = ["Inventory", "Customer", "Vendor", "Order", "Invoice", "Payment"];
  const users = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams"];
  
  const updateMetadataExamples = [
    { field: "status", oldValue: "pending", newValue: "approved" },
    { field: "price", oldValue: "$99.99", newValue: "$89.99" },
    { field: "quantity", oldValue: "50", newValue: "75" },
    { field: "email", oldValue: "old@email.com", newValue: "new@email.com" },
    { field: "creditLimit", oldValue: "$5,000", newValue: "$10,000" },
    { field: "deliveryDate", oldValue: "2024-12-01", newValue: "2024-12-15" },
    { field: "priority", oldValue: "low", newValue: "high" },
    { field: "assignedTo", oldValue: "John Doe", newValue: "Jane Smith" },
  ];
  
  return Array.from({ length: 50 }, (_, i) => {
    const action = actions[Math.floor(Math.random() * actions.length)];
    const entity = entities[Math.floor(Math.random() * entities.length)];
    
    // Only add metadata for update actions
    const hasMetadata = action === "update" && Math.random() > 0.3;
    
    return {
      id: String(i + 1),
      action,
      entity,
      entityId: `ID-${Math.floor(Math.random() * 1000)}`,
      description: `${action.charAt(0).toUpperCase() + action.slice(1)}d ${entity.toLowerCase()} record`,
      user: users[Math.floor(Math.random() * users.length)],
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: hasMetadata 
        ? updateMetadataExamples[Math.floor(Math.random() * updateMetadataExamples.length)]
        : undefined,
    };
  });
};
