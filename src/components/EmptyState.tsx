import { Button } from "@/components/ui/button";
import { Plus, type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="relative p-4 rounded-full bg-muted mb-4 transition-all duration-300 hover:scale-110 group">
        <Icon className="h-8 w-8 text-muted-foreground transition-colors group-hover:text-primary" />
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <h3 className="text-lg font-semibold mb-2" data-testid="empty-state-title">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6" data-testid="empty-state-description">
        {description}
      </p>
      {actionLabel && (
        <Button onClick={onAction} data-testid="button-empty-state-action" className="group relative overflow-hidden transition-all duration-200 hover:scale-105 active:scale-95">
          <Plus className="h-4 w-4 mr-2 transition-transform group-hover:rotate-90" />
          <span className="relative z-10">{actionLabel}</span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </Button>
      )}
    </div>
  );
}
