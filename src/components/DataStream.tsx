import { useEffect, useRef } from "react";

interface DataStreamProps {
  intensity?: "low" | "medium" | "high";
  className?: string;
}

export function DataStream({ intensity = "medium", className = "" }: DataStreamProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Configuration based on intensity
    const config = {
      low: { columns: 30, speed: 0.5, opacity: 0.3 },
      medium: { columns: 50, speed: 1, opacity: 0.5 },
      high: { columns: 80, speed: 1.5, opacity: 0.7 },
    };

    const { columns, speed, opacity } = config[intensity];

    // Matrix rain effect
    const fontSize = 14;
    const columnWidth = canvas.width / columns;
    const drops: number[] = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    // Characters to display (binary and hex)
    const chars = "01アイウエオカキクケコサシスセソタチツテト";

    let animationFrameId: number;
    let lastTime = 0;

    const draw = (currentTime: number) => {
      if (!ctx || !canvas) return;

      const deltaTime = currentTime - lastTime;
      
      // Only update every 33ms (30 FPS) to control speed
      if (deltaTime > 33) {
        // Fade effect for trail
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set text style
        ctx.fillStyle = `rgba(6, 182, 212, ${opacity})`;
        ctx.font = `${fontSize}px monospace`;

        // Draw characters
        for (let i = 0; i < drops.length; i++) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const x = i * columnWidth;
          const y = drops[i] * fontSize;

          ctx.fillText(char, x, y);

          // Reset drop to top randomly
          if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }

          drops[i] += speed * 0.5;
        }

        lastTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ opacity: 0.15, zIndex: 0 }}
    />
  );
}
