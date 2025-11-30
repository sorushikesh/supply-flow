import { cn } from "@/lib/utils";

interface PulseLoaderProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "cyan" | "blue" | "purple";
  className?: string;
}

export function PulseLoader({ 
  size = "md", 
  color = "primary",
  className 
}: PulseLoaderProps) {
  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const colors = {
    primary: "bg-primary",
    cyan: "bg-cyan-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
  };

  const glowColors = {
    primary: "shadow-primary/50",
    cyan: "shadow-cyan-500/50",
    blue: "shadow-blue-500/50",
    purple: "shadow-purple-500/50",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div 
        className={cn(
          sizes[size], 
          colors[color],
          glowColors[color],
          "rounded-full animate-pulse shadow-lg"
        )}
        style={{ animationDelay: "0ms" }}
      />
      <div 
        className={cn(
          sizes[size], 
          colors[color],
          glowColors[color],
          "rounded-full animate-pulse shadow-lg"
        )}
        style={{ animationDelay: "150ms" }}
      />
      <div 
        className={cn(
          sizes[size], 
          colors[color],
          glowColors[color],
          "rounded-full animate-pulse shadow-lg"
        )}
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}
