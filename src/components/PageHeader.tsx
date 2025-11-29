import { Button } from "@/components/ui/button";
import { Plus, type LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  onAction?: () => void;
}

export function PageHeader({
  title,
  description,
  actionLabel,
  actionIcon: ActionIcon = Plus,
  onAction,
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
        <Button onClick={onAction} data-testid="button-page-action">
          <ActionIcon className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
