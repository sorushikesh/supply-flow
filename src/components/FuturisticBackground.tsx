import { useEffect, useRef, useState } from "react";

export function FuturisticBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

    // Mouse tracking for interactive effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Enhanced Particle system with glow
    class Particle {
      x: number = 0;
      y: number = 0;
      baseX: number = 0;
      baseY: number = 0;
      size: number = 0;
      speedX: number = 0;
      speedY: number = 0;
      opacity: number = 0;
      hue: number = 0;
      pulsePhase: number = 0;

      constructor() {
        if (!canvas) return;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.3 - 0.15;
        this.opacity = Math.random() * 0.6 + 0.3;
        this.hue = Math.random() * 60 + 180; // Blue-cyan range
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update(time: number) {
        if (!canvas) return;
        
        // Mouse interaction
        const dx = mousePos.x - this.x;
        const dy = mousePos.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;
        
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 2;
          this.y -= Math.sin(angle) * force * 2;
        } else {
          // Gentle return to base position
          this.x += (this.baseX - this.x) * 0.05;
          this.y += (this.baseY - this.y) * 0.05;
        }

        this.baseX += this.speedX;
        this.baseY += this.speedY;

        if (this.baseX > canvas.width) this.baseX = 0;
        if (this.baseX < 0) this.baseX = canvas.width;
        if (this.baseY > canvas.height) this.baseY = 0;
        if (this.baseY < 0) this.baseY = canvas.height;

        // Pulsing effect
        this.pulsePhase += 0.02;
      }

      draw(time: number) {
        if (!ctx) return;
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        const dynamicOpacity = this.opacity * pulse;
        
        // Glow effect
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 3
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 70%, 60%, ${dynamicOpacity})`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 70%, 60%, ${dynamicOpacity * 0.3})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 70%, 60%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Core particle
        ctx.fillStyle = `hsla(${this.hue}, 70%, 70%, ${dynamicOpacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Animated grid with wave effect
    let gridOffset = 0;
    const drawGrid = (time: number) => {
      if (!ctx || !canvas) return;
      const isDark = document.documentElement.classList.contains("dark");
      const gridColor = isDark
        ? "rgba(6, 182, 212, 0.08)"
        : "rgba(6, 182, 212, 0.04)";

      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;

      const gridSize = 50;
      gridOffset = (gridOffset + 0.3) % gridSize;

      // Vertical lines with wave
      for (let x = -gridSize; x < canvas.width + gridSize; x += gridSize) {
        ctx.beginPath();
        for (let y = 0; y <= canvas.height; y += 10) {
          const wave = Math.sin((y + time * 50) * 0.01) * 5;
          if (y === 0) {
            ctx.moveTo(x + gridOffset + wave, y);
          } else {
            ctx.lineTo(x + gridOffset + wave, y);
          }
        }
        ctx.stroke();
      }

      // Horizontal lines with wave
      for (let y = -gridSize; y < canvas.height + gridSize; y += gridSize) {
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 10) {
          const wave = Math.sin((x + time * 50) * 0.01) * 5;
          if (x === 0) {
            ctx.moveTo(x, y + gridOffset + wave);
          } else {
            ctx.lineTo(x, y + gridOffset + wave);
          }
        }
        ctx.stroke();
      }
    };

    // Energy lines flowing across screen
    class EnergyLine {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      hue: number;

      constructor() {
        if (!canvas) {
          this.x = 0;
          this.y = 0;
          this.length = 0;
          this.speed = 0;
          this.angle = 0;
          this.opacity = 0;
          this.hue = 0;
          return;
        }
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.length = Math.random() * 100 + 50;
        this.speed = Math.random() * 2 + 1;
        this.angle = Math.random() * Math.PI * 2;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.hue = Math.random() * 60 + 180;
      }

      update() {
        if (!canvas) return;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // Wrap around
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        const endX = this.x + Math.cos(this.angle) * this.length;
        const endY = this.y + Math.sin(this.angle) * this.length;

        const gradient = ctx.createLinearGradient(this.x, this.y, endX, endY);
        gradient.addColorStop(0, `hsla(${this.hue}, 70%, 60%, 0)`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 70%, 60%, ${this.opacity})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 70%, 60%, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    }

    // Create particles
    const particleCount = 120;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Create energy lines
    const energyLines: EnergyLine[] = [];
    for (let i = 0; i < 8; i++) {
      energyLines.push(new EnergyLine());
    }

    // Animation loop
    let animationFrameId: number;
    let startTime = Date.now();
    
    const animate = () => {
      if (!ctx || !canvas) return;
      const time = (Date.now() - startTime) / 1000;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw animated grid
      drawGrid(time);

      // Update and draw energy lines
      energyLines.forEach((line) => {
        line.update();
        line.draw();
      });

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update(time);
        particle.draw(time);
      });

      // Connect nearby particles with glowing lines
      const isDark = document.documentElement.classList.contains("dark");
      const baseLineOpacity = isDark ? 0.15 : 0.08;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = (1 - distance / 120) * baseLineOpacity;
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            gradient.addColorStop(0, `rgba(6, 182, 212, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(59, 130, 246, ${opacity * 1.5})`);
            gradient.addColorStop(1, `rgba(6, 182, 212, ${opacity})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos.x, mousePos.y]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.5 }}
    />
  );
}
