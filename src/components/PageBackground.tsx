import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageBackgroundProps {
  children: ReactNode;
  className?: string;
}

export function PageBackground({ 
  children,
  className 
}: PageBackgroundProps) {
  return (
    <div className={cn("relative min-h-full overflow-hidden", className)}>
      {/* Sophisticated fintech grid background */}
      <div 
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary) / 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Subtle dot overlay for texture */}
      <div 
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--primary) / 0.5) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />
      
      {/* Gradient overlays for depth and polish */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-background/50 to-cyan-500/[0.05] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/60 pointer-events-none" />
      
      {/* Animated gradient orbs for fintech aesthetic */}
      <div className="absolute top-0 -left-4 w-[500px] h-[500px] bg-primary/[0.07] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none" />
      <div className="absolute top-0 -right-4 w-[500px] h-[500px] bg-cyan-500/[0.07] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute -bottom-8 left-1/3 w-[500px] h-[500px] bg-blue-500/[0.05] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000 pointer-events-none" />
      
      {/* Professional accent line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none" />
      
      {/* Corner highlights for depth */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/[0.05] via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-cyan-500/[0.05] via-transparent to-transparent pointer-events-none" />
      
      {/* Floating depth elements */}
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary/[0.03] rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/[0.03] rounded-full blur-3xl animate-float-delayed pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
