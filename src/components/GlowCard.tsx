import { ReactNode, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "cyan" | "blue" | "purple" | "green";
  intensity?: "low" | "medium" | "high";
}

const glowColors = {
  cyan: "rgba(6, 182, 212, 0.5)",
  blue: "rgba(59, 130, 246, 0.5)",
  purple: "rgba(139, 92, 246, 0.5)",
  green: "rgba(34, 197, 94, 0.5)",
};

const intensities = {
  low: "0 0 10px",
  medium: "0 0 20px",
  high: "0 0 30px",
};

export function GlowCard({
  children,
  className,
  glowColor = "cyan",
  intensity = "medium",
}: GlowCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      className={cn("relative group", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Animated gradient border */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColors[glowColor]}, transparent 40%)`,
          }}
        />
        
        {/* Glow effect */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
            style={{
              boxShadow: `${intensities[intensity]} ${glowColors[glowColor]}`,
              borderRadius: "inherit",
            }}
          />
        )}
        
        {/* Content */}
        <div className="relative z-10">{children}</div>
      </Card>
    </div>
  );
}
