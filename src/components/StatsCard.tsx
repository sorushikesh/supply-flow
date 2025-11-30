import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, type LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
}

export function StatsCard({ title, value, change, changeLabel, icon: Icon }: StatsCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card data-testid={`stats-card-${title.toLowerCase().replace(/\s+/g, "-")}`} className="transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-pointer group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {title}
            </p>
            <p className="text-3xl font-bold mt-2 font-mono">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                {isPositive && <ArrowUp className="h-3 w-3 text-green-600 dark:text-green-400" />}
                {isNegative && <ArrowDown className="h-3 w-3 text-red-600 dark:text-red-400" />}
                <span
                  className={`text-xs font-medium ${
                    isPositive
                      ? "text-green-600 dark:text-green-400"
                      : isNegative
                      ? "text-red-600 dark:text-red-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {Math.abs(change)}%
                </span>
                {changeLabel && (
                  <span className="text-xs text-muted-foreground">{changeLabel}</span>
                )}
              </div>
            )}
          </div>
          <div className="p-3 rounded-lg bg-primary/10 transition-all duration-200 hover:bg-primary/20 hover:scale-110">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
