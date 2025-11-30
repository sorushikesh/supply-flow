import { useEffect } from "react";
import { useLocation } from "wouter";

interface ShortcutConfig {
  key: string;
  action: () => void;
  description: string;
}

interface KeyboardShortcutsProps {
  shortcuts: ShortcutConfig[];
}

export function KeyboardShortcuts({ shortcuts }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Check for Ctrl/Cmd + key combinations
      if (e.ctrlKey || e.metaKey) {
        const shortcut = shortcuts.find(s => s.key.toLowerCase() === e.key.toLowerCase());
        if (shortcut) {
          e.preventDefault();
          shortcut.action();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [shortcuts]);

  return null; // This component doesn't render anything
}

// Global keyboard navigation shortcuts
export function useGlobalShortcuts() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Global shortcuts (Alt + key for navigation)
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case "d":
            e.preventDefault();
            setLocation("/");
            break;
          case "i":
            e.preventDefault();
            setLocation("/inventory");
            break;
          case "v":
            e.preventDefault();
            setLocation("/vendors");
            break;
          case "c":
            e.preventDefault();
            setLocation("/customers");
            break;
          case "p":
            e.preventDefault();
            setLocation("/purchase-orders");
            break;
          case "s":
            e.preventDefault();
            setLocation("/sales-orders");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [setLocation]);
}
