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
      {/* Futuristic hexagonal grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(30deg, hsl(var(--primary) / 0.4) 2px, transparent 2px),
            linear-gradient(150deg, hsl(var(--primary) / 0.4) 2px, transparent 2px),
            linear-gradient(270deg, hsl(var(--primary) / 0.4) 2px, transparent 2px)
          `,
          backgroundSize: '80px 140px',
        }}
      />
      
      {/* Cyber grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary) / 0.5) 1.5px, transparent 1.5px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.5) 1.5px, transparent 1.5px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Animated scanlines */}
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            hsl(var(--primary) / 0.8) 0px,
            transparent 1px,
            transparent 3px,
            hsl(var(--cyan-500) / 0.6) 4px
          )`,
          animation: 'scan 8s linear infinite',
        }}
      />
      
      {/* Corner accent nodes */}
      <div 
        className="absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 0% 0%, hsl(var(--primary) / 0.6) 3px, transparent 3px),
            radial-gradient(circle at 100% 0%, hsl(var(--cyan-500) / 0.6) 3px, transparent 3px),
            radial-gradient(circle at 0% 100%, hsl(var(--cyan-500) / 0.6) 3px, transparent 3px),
            radial-gradient(circle at 100% 100%, hsl(var(--primary) / 0.6) 3px, transparent 3px),
            radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.4) 2px, transparent 2px)
          `,
          backgroundSize: '60px 60px',
          backgroundPosition: '0 0, 60px 0, 0 60px, 60px 60px, 30px 30px',
        }}
      />
      
      {/* Gradient depth layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-background/40 to-cyan-500/[0.08] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/70 pointer-events-none" />
      
      {/* Animated energy orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/[0.12] rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-blob pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-cyan-500/[0.1] rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 w-[550px] h-[550px] bg-blue-500/[0.08] rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-blob animation-delay-4000 pointer-events-none" />
      
      {/* Cyber accent lines */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent pointer-events-none shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent pointer-events-none" />
      
      {/* Corner energy highlights */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-primary/[0.08] via-primary/[0.02] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-tl from-cyan-500/[0.08] via-cyan-500/[0.02] to-transparent pointer-events-none" />
      
      {/* Floating depth spheres */}
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-primary/[0.05] rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-cyan-500/[0.04] rounded-full blur-3xl animate-float-delayed pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
