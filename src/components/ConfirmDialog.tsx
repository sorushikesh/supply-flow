import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Trash2, Info, AlertCircle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive" | "warning";
  itemName?: string;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  itemName,
}: ConfirmDialogProps) {
  const variantConfig = {
    default: {
      icon: Info,
      iconClass: "text-blue-500",
      bgClass: "bg-blue-500/10",
      buttonClass: "",
    },
    destructive: {
      icon: Trash2,
      iconClass: "text-destructive",
      bgClass: "bg-destructive/10",
      buttonClass: "bg-destructive hover:bg-destructive/90",
    },
    warning: {
      icon: AlertTriangle,
      iconClass: "text-amber-500",
      bgClass: "bg-amber-500/10",
      buttonClass: "bg-amber-500 hover:bg-amber-600",
    },
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="animate-scale-in">
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${config.bgClass} shrink-0`}>
              <Icon className={`h-6 w-6 ${config.iconClass}`} aria-hidden="true" />
            </div>
            <div className="flex-1 space-y-2">
              <AlertDialogTitle className="text-xl">{title}</AlertDialogTitle>
              <AlertDialogDescription className="text-base leading-relaxed">
                {description}
                {itemName && (
                  <span className="block mt-2 p-2 rounded-md bg-muted font-medium text-foreground">
                    {itemName}
                  </span>
                )}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel className="sm:mr-0">
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={config.buttonClass}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
