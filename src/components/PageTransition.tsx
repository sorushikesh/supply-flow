import { ReactNode, useEffect, useState } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  variant?: "fade" | "slide" | "scale" | "blur";
}

export function PageTransition({ 
  children, 
  className = "", 
  variant = "slide" 
}: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [children]);

  const variants = {
    fade: {
      hidden: "opacity-0",
      visible: "opacity-100",
    },
    slide: {
      hidden: "opacity-0 translate-y-8",
      visible: "opacity-100 translate-y-0",
    },
    scale: {
      hidden: "opacity-0 scale-95",
      visible: "opacity-100 scale-100",
    },
    blur: {
      hidden: "opacity-0 blur-sm",
      visible: "opacity-100 blur-0",
    },
  };

  const currentVariant = variants[variant];

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? currentVariant.visible
          : currentVariant.hidden
      } ${className}`}
    >
      {/* Subtle entrance animation overlay */}
      {!isVisible && (
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent pointer-events-none animate-pulse" />
      )}
      {children}
    </div>
  );
}
