import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Save, X } from "lucide-react";

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
        className={`${maxWidthClasses[maxWidth]} max-h-[90vh] overflow-y-auto animate-scale-in backdrop-blur-sm border-primary/20`}
        aria-describedby={description ? "modal-description" : undefined}
      >
        <DialogHeader className="animate-slide-up-fade pb-4 border-b">
          <DialogTitle data-testid="modal-title" className="text-2xl flex items-center gap-3">
            <div className="h-10 w-1 bg-gradient-to-b from-primary to-primary/40 rounded-full" />
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription id="modal-description" className="text-base mt-2 ml-7">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit?.();
          }}
        >
          <div className="py-6 px-1">{children}</div>
          <DialogFooter className="gap-2 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-modal-cancel"
              disabled={isLoading}
              className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            {onSubmit && (
              <Button 
                type="submit"
                disabled={isLoading} 
                data-testid="button-modal-submit"
                className="relative overflow-hidden group gap-2 hover:scale-105 transition-transform shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>{submitLabel}</span>
                  </>
                )}
                <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" aria-hidden="true" />
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
