import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  const ActionIcon = action?.icon;
  
  return (
    <Card className={cn("border-primary/20 bg-gradient-to-br from-muted/30 to-transparent animate-fade-in", className)}>
      <CardContent className="flex flex-col items-center justify-center p-12 sm:p-16 text-center">
        <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-500/10 animate-scale-in shadow-lg">
          <Icon className="h-16 w-16 text-primary/70 animate-pulse" aria-hidden="true" strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {title}
        </h3>
        <p className="text-muted-foreground max-w-md mb-8 text-base leading-relaxed">
          {description}
        </p>
        {action && (
          <Button 
            onClick={action.onClick} 
            size="lg"
            className="gap-2 hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-xl"
            aria-label={action.label}
          >
            {ActionIcon && <ActionIcon className="h-4 w-4" />}
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
