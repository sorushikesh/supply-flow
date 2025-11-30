import { useEffect, useState } from "react";

interface AnimatedStatsProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function AnimatedStats({ 
  value, 
  duration = 1000, 
  prefix = "", 
  suffix = "",
  decimals = 0 
}: AnimatedStatsProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);
      
      setDisplayValue(value * easedProgress);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  const formattedValue = decimals > 0 
    ? displayValue.toFixed(decimals)
    : Math.floor(displayValue).toLocaleString();

  return (
    <span>
      {prefix}{formattedValue}{suffix}
    </span>
  );
}
