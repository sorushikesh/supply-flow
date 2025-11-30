import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Global keyboard navigation shortcuts hook
 * Alt + D: Dashboard
 * Alt + I: Inventory
 * Alt + V: Vendors
 * Alt + C: Customers
 * Alt + P: Purchase Orders
 * Alt + S: Sales Orders
 */
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
