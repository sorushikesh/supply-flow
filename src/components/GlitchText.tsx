import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export function GlitchText({ text, className, intensity = "low" }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const intervals = {
      low: 8000,
      medium: 5000,
      high: 3000,
    };

    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, intervals[intensity]);

    return () => clearInterval(interval);
  }, [intensity]);

  return (
    <span className={cn("relative inline-block", className)}>
      <span className={cn(
        "relative z-10",
        isGlitching && "animate-glitch"
      )}>
        {text}
      </span>
      
      {/* Glitch layers */}
      {isGlitching && (
        <>
          <span 
            className="absolute inset-0 text-cyan-500 opacity-70"
            style={{
              transform: "translate(-2px, 1px)",
              clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
            }}
          >
            {text}
          </span>
          <span 
            className="absolute inset-0 text-red-500 opacity-70"
            style={{
              transform: "translate(2px, -1px)",
              clipPath: "polygon(0 45%, 100% 45%, 100% 100%, 0 100%)",
            }}
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
}
