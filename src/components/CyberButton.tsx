import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CyberButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

export function CyberButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}: CyberButtonProps) {
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400",
    secondary: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400",
    danger: "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative overflow-hidden rounded-lg font-bold text-white
        transition-all duration-300 group
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Animated corner accents */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Scan line effect */}
      <span className="absolute inset-0 overflow-hidden">
        <span className="absolute w-full h-1/3 bg-gradient-to-b from-white/0 via-white/20 to-white/0 -translate-y-full group-hover:translate-y-[300%] transition-transform duration-1000 ease-linear" />
      </span>

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}

// Note: This component requires framer-motion
// Install with: npm install framer-motion
