import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Trash2, 
  Download, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  MoreHorizontal,
  FileSpreadsheet
} from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface BulkActionsProps {
  selectedCount: number;
  onDelete?: () => void;
  onExport?: () => void;
  onStatusChange?: (status: string) => void;
  onEmail?: () => void;
  statusOptions?: string[];
  actions?: {
    label: string;
    icon: React.ComponentType<any>;
    onClick: () => void;
    variant?: "default" | "destructive" | "warning";
  }[];
}

export function BulkActions({
  selectedCount,
  onDelete,
  onExport,
  onStatusChange,
  onEmail,
  statusOptions = ["Active", "Inactive", "Pending"],
  actions = [],
}: BulkActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out ${
          selectedCount > 0
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-20 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 p-4 border-2 rounded-xl bg-card/95 backdrop-blur-xl shadow-2xl hover:shadow-primary/20 transition-all duration-300 ring-1 ring-primary/20">
        {/* Enhanced Selection Badge */}
        <div className="flex items-center gap-2.5 px-3 py-2 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg border border-primary/30">
          <div className="relative">
            <Checkbox checked={true} className="pointer-events-none h-4 w-4" />
            <div className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-primary rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-primary">{selectedCount}</span>
            <span className="text-[10px] text-muted-foreground font-medium -mt-0.5">selected</span>
          </div>
        </div>

        <div className="h-8 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {onExport && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onExport}
              className="gap-2 h-9 px-3 hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/30 border border-transparent transition-all duration-200 hover:scale-105 hover:shadow-md"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span className="font-medium">Export</span>
            </Button>
          )}

          {onEmail && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onEmail}
              className="gap-2 h-9 px-3 hover:bg-purple-500/10 hover:text-purple-600 hover:border-purple-500/30 border border-transparent transition-all duration-200 hover:scale-105 hover:shadow-md"
            >
              <Mail className="h-4 w-4" />
              <span className="font-medium">Email</span>
            </Button>
          )}

          {onStatusChange && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-2 h-9 px-3 hover:bg-amber-500/10 hover:text-amber-600 hover:border-amber-500/30 border border-transparent transition-all duration-200 hover:scale-105 hover:shadow-md"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="font-medium">Change Status</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Update Status
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statusOptions.map((status) => (
                  <DropdownMenuItem 
                    key={status} 
                    onClick={() => onStatusChange(status)}
                    className="cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary/70" />
                    <span className="font-medium">{status}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {actions.map((action, index) => (
            <Button
              key={index}
              size="sm"
              variant="ghost"
              onClick={action.onClick}
              className={`gap-2 h-9 px-3 border border-transparent transition-all duration-200 hover:scale-105 hover:shadow-md ${
                action.variant === "destructive"
                  ? "hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/30"
                  : "hover:bg-primary/10 hover:border-primary/30"
              }`}
            >
              <action.icon className="h-4 w-4" />
              <span className="font-medium">{action.label}</span>
            </Button>
          ))}

          {onDelete && (
            <>
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setDeleteDialogOpen(true)}
                className="gap-2 h-9 px-3 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 border border-transparent transition-all duration-200 hover:scale-105 hover:shadow-md font-medium"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            </>
          )}
        </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => {
          onDelete?.();
          setDeleteDialogOpen(false);
        }}
        title="Delete Selected Items"
        description={`Are you sure you want to delete ${selectedCount} selected item${selectedCount > 1 ? 's' : ''}? This action cannot be undone.`}
        variant="destructive"
        confirmLabel="Delete All"
      />
    </>
  );
}

interface SelectAllCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  indeterminate?: boolean;
}

export function SelectAllCheckbox({
  checked,
  onCheckedChange,
  indeterminate,
}: SelectAllCheckboxProps) {
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={onCheckedChange}
      aria-label="Select all"
      className="transition-all duration-200"
      {...(indeterminate && { "data-state": "indeterminate" })}
    />
  );
}
