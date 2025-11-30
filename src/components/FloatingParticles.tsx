import { useEffect, useRef } from "react";

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

export function FloatingParticles({ count = 20, className = "" }: FloatingParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing particles
    container.innerHTML = '';

    // Create floating particles
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 4 + 2;
      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * -20;
      const startX = Math.random() * 100;
      const endX = startX + (Math.random() * 40 - 20);
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(6, 182, 212, 0.8) 0%, rgba(6, 182, 212, 0) 70%);
        left: ${startX}%;
        bottom: -10px;
        animation: float-up-${i} ${duration}s linear ${delay}s infinite;
        pointer-events: none;
        opacity: ${Math.random() * 0.5 + 0.3};
      `;

      // Create unique animation for each particle
      const style = document.createElement('style');
      style.textContent = `
        @keyframes float-up-${i} {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: ${Math.random() * 0.5 + 0.3};
          }
          90% {
            opacity: ${Math.random() * 0.5 + 0.3};
          }
          100% {
            transform: translate(${endX - startX}vw, -100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      
      container.appendChild(style);
      container.appendChild(particle);
    }
  }, [count]);

  return (
    <div 
      ref={containerRef} 
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 1 }}
    />
  );
}
