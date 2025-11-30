import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
  isLoading?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  submitLabel = "Save",
  isLoading = false,
  maxWidth = "lg",
}: FormModalProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`${maxWidthClasses[maxWidth]} max-h-[90vh] overflow-y-auto animate-scale-in backdrop-blur-sm`}
        aria-describedby={description ? "modal-description" : undefined}
      >
        <DialogHeader className="animate-slide-up-fade">
          <DialogTitle data-testid="modal-title">{title}</DialogTitle>
          {description && <DialogDescription id="modal-description">{description}</DialogDescription>}
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit?.();
          }}
        >
          <div className="py-4">{children}</div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-modal-cancel"
              disabled={isLoading}
            >
              Cancel
            </Button>
            {onSubmit && (
              <Button 
                type="submit"
                disabled={isLoading} 
                data-testid="button-modal-submit"
                className="relative overflow-hidden group"
              >
                <span className="relative z-10">{isLoading ? "Saving..." : submitLabel}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" aria-hidden="true" />
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
