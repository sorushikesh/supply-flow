import { ReactNode, useState, MouseEvent } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface HolographicCardProps {
  children: ReactNode;
  className?: string;
  intensity?: "subtle" | "medium" | "strong";
}

export function HolographicCard({ 
  children, 
  className, 
  intensity = "medium" 
}: HolographicCardProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const intensityMap = {
    subtle: 5,
    medium: 10,
    strong: 15,
  };

  const maxRotation = intensityMap[intensity];

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -maxRotation;
    const rotateY = ((x - centerX) / centerX) * maxRotation;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div 
      className={cn("perspective-1000", className)}
      style={{ perspective: "1000px" }}
    >
      <Card
        className="relative overflow-hidden transition-all duration-300 ease-out"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(${isHovered ? 20 : 0}px)`,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        {/* Holographic overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `
              radial-gradient(
                circle at ${isHovered ? '50%' : '0%'} ${isHovered ? '50%' : '0%'},
                rgba(6, 182, 212, 0.15) 0%,
                rgba(59, 130, 246, 0.1) 25%,
                rgba(139, 92, 246, 0.05) 50%,
                transparent 70%
              )
            `,
          }}
        />

        {/* Animated shimmer */}
        {isHovered && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(
                ${rotation.y + 90}deg,
                transparent 0%,
                rgba(255, 255, 255, 0.1) 45%,
                rgba(255, 255, 255, 0.2) 50%,
                rgba(255, 255, 255, 0.1) 55%,
                transparent 100%
              )`,
              transform: `translateX(${rotation.y * 2}%) translateY(${rotation.x * 2}%)`,
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </Card>
    </div>
  );
}
