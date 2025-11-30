import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Command, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShortcutGroup {
  title: string;
  shortcuts: { keys: string[]; description: string; route?: string }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: "Navigation",
    shortcuts: [
      { keys: ["Alt", "D"], description: "Dashboard", route: "/" },
      { keys: ["Alt", "I"], description: "Inventory", route: "/inventory" },
      { keys: ["Alt", "V"], description: "Vendors", route: "/vendors" },
      { keys: ["Alt", "C"], description: "Customers", route: "/customers" },
      { keys: ["Alt", "P"], description: "Purchase Orders", route: "/purchase-orders" },
      { keys: ["Alt", "S"], description: "Sales Orders", route: "/sales-orders" },
    ],
  },
  {
    title: "Global Actions",
    shortcuts: [
      { keys: ["Ctrl", "?"], description: "Show keyboard shortcuts" },
      { keys: ["Esc"], description: "Close dialogs/modals" },
      { keys: ["Ctrl", "K"], description: "Quick search (coming soon)" },
    ],
  },
];

/**
 * Global keyboard navigation shortcuts hook
 * Alt + D: Dashboard
 * Alt + I: Inventory
 * Alt + V: Vendors
 * Alt + C: Customers
 * Alt + P: Purchase Orders
 * Alt + S: Sales Orders
 * Ctrl + ?: Show keyboard shortcuts dialog
 */
export function useGlobalShortcuts() {
  const [, setLocation] = useLocation();
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Show keyboard shortcuts dialog
      if (e.ctrlKey && e.shiftKey && e.key === "?") {
        e.preventDefault();
        setShowDialog(true);
        return;
      }

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
          case "g":
            e.preventDefault();
            setLocation("/grn");
            break;
          case "a":
            e.preventDefault();
            setLocation("/analytics");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [setLocation]);

  return { showDialog, setShowDialog };
}

export function KeyboardShortcutsDialog() {
  const { showDialog, setShowDialog } = useGlobalShortcuts();

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <Keyboard className="h-6 w-6 text-primary" />
            </div>
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription className="text-base">
            Use these shortcuts to navigate and work more efficiently
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {shortcutGroups.map((group, index) => (
            <div key={index} className="space-y-3">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, sIndex) => (
                  <div
                    key={sIndex}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-primary/20"
                  >
                    <span className="text-sm text-foreground font-medium">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {shortcut.keys.map((key, kIndex) => (
                        <div key={kIndex} className="flex items-center gap-1.5">
                          <Badge
                            variant="secondary"
                            className="px-3 py-1.5 font-mono text-xs font-bold shadow-sm"
                          >
                            {key}
                          </Badge>
                          {kIndex < shortcut.keys.length - 1 && (
                            <span className="text-muted-foreground text-xs">+</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {index < shortcutGroups.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </div>

        <div className="pt-4 border-t space-y-3">
          <p className="text-xs text-center text-muted-foreground">
            Press{" "}
            <Badge variant="secondary" className="mx-1 px-2 py-0.5 font-mono text-xs font-semibold">
              Ctrl
            </Badge>
            +
            <Badge variant="secondary" className="mx-1 px-2 py-0.5 font-mono text-xs font-semibold">
              Shift
            </Badge>
            +
            <Badge variant="secondary" className="mx-1 px-2 py-0.5 font-mono text-xs font-semibold">
              ?
            </Badge>
            anytime to view this dialog
          </p>
          <Button 
            onClick={() => setShowDialog(false)} 
            variant="outline" 
            className="w-full"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
