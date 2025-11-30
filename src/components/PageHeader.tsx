import { Button } from "@/components/ui/button";
import { Plus, type LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  onAction?: () => void;
  shortcut?: string;
}

export function PageHeader({
  title,
  description,
  actionLabel,
  actionIcon: ActionIcon = Plus,
  onAction,
  shortcut,
}: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="page-title">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1" data-testid="page-description">
            {description}
          </p>
        )}
      </div>
      {actionLabel && (
        <div className="transition-transform duration-200 hover:scale-105">
          <Button onClick={onAction} data-testid="button-page-action" className="relative overflow-hidden group gap-2">
            <ActionIcon className="h-4 w-4 mr-2 transition-transform group-hover:rotate-12" />
            <span className="relative z-10">{actionLabel}</span>
            {shortcut && (
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                {shortcut}
              </kbd>
            )}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </Button>
        </div>
      )}
    </div>
  );
}
