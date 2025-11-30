import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NeonBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: "cyan" | "blue" | "purple" | "green" | "red";
  animated?: boolean;
  thickness?: number;
}

export function NeonBorder({
  children,
  className,
  color = "cyan",
  animated = true,
  thickness = 2,
}: NeonBorderProps) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!animated) return;

    const interval = setInterval(() => {
      setOffset((prev) => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, [animated]);

  const colors = {
    cyan: "rgba(6, 182, 212, 0.8)",
    blue: "rgba(59, 130, 246, 0.8)",
    purple: "rgba(139, 92, 246, 0.8)",
    green: "rgba(34, 197, 94, 0.8)",
    red: "rgba(239, 68, 68, 0.8)",
  };

  const selectedColor = colors[color];

  return (
    <div className={cn("relative", className)}>
      {/* Animated neon border */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          padding: `${thickness}px`,
          background: `linear-gradient(${offset}deg, ${selectedColor}, transparent, ${selectedColor})`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-lg blur-sm opacity-50"
        style={{
          background: `linear-gradient(${offset}deg, ${selectedColor}, transparent, ${selectedColor})`,
          padding: `${thickness}px`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 rounded-lg overflow-hidden">
        {children}
      </div>
    </div>
  );
}
