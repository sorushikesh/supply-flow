import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card 
      data-testid={`stats-card-${title.toLowerCase().replace(/\s+/g, "-")}`} 
      className="relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer group overflow-hidden border-2 hover:border-primary/20"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Scan line effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
        <div className="absolute w-full h-1/3 bg-gradient-to-b from-transparent via-primary/10 to-transparent animate-scan" 
             style={{ animation: "scan 3s ease-in-out infinite" }} />
      </div>
      
      {/* Glow corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-16 translate-x-16" />
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2 group-hover:text-primary transition-colors duration-300">
              {title}
            </p>
            <div className="text-4xl md:text-5xl font-bold mt-1 font-mono overflow-hidden">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-cyan-500 transition-all duration-500">
                {value}
              </span>
            </div>
            {change !== undefined && (
              <div className={`flex items-center gap-1.5 mt-3 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-md ${
                  isPositive
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : isNegative
                    ? "bg-red-500/10 text-red-600 dark:text-red-400"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {isPositive && <ArrowUp className="h-3.5 w-3.5 animate-bounce-subtle" />}
                  {isNegative && <ArrowDown className="h-3.5 w-3.5 animate-bounce-subtle" />}
                  <span className="text-sm font-bold font-mono">
                    {Math.abs(change)}%
                  </span>
                </div>
                {changeLabel && (
                  <span className="text-sm text-muted-foreground ml-1">{changeLabel}</span>
                )}
              </div>
            )}
          </div>
          <div className="relative p-3.5 rounded-xl bg-gradient-to-br from-primary/10 to-cyan-500/10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-lg group-hover:shadow-primary/20">
            {/* Icon glow effect */}
            <div className="absolute inset-0 rounded-xl bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Icon className="h-7 w-7 text-primary relative z-10 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </div>
        </div>
      </CardContent>
      
      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Card>
  );
}
