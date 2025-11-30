import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Settings, LogOut, Zap, ShoppingCart, FileText, Package, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

// todo: remove mock functionality
const mockNotifications = [
  { id: 1, title: "Low Stock Alert", description: "Widget A is below reorder level", time: "2 min ago" },
  { id: 2, title: "PO Approved", description: "PO-2024-0042 has been approved", time: "15 min ago" },
  { id: 3, title: "Invoice Overdue", description: "INV-2024-0089 is overdue by 5 days", time: "1 hour ago" },
];

interface TopHeaderProps {
  breadcrumb?: string;
}

export function TopHeader({ breadcrumb }: TopHeaderProps) {
  const [, setLocation] = useLocation();

  return (
    <header className="h-14 border-b flex items-center justify-between gap-4 px-4 lg:px-6 bg-background/95 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-3">
        <SidebarTrigger data-testid="button-sidebar-toggle" className="transition-transform duration-200 hover:scale-110 h-8 w-8" />
        {breadcrumb && (
          <nav className="text-sm text-muted-foreground hidden md:block" data-testid="breadcrumb">
            <span className="transition-colors duration-200 hover:text-foreground cursor-pointer">Home</span>
            <span className="mx-2 text-muted-foreground/50">/</span>
            <span className="text-foreground font-medium">{breadcrumb}</span>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        {/* Quick Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost"
              size="sm"
              className="gap-1.5 h-8 px-2.5 font-medium hover:bg-accent transition-all text-xs"
              data-testid="button-quick-actions"
            >
              <Zap className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Quick Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
              Create New
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setLocation("/purchase-orders")}
              className="flex items-center gap-3 p-3 cursor-pointer"
              data-testid="quick-action-purchase-order"
            >
              <div className="p-2 rounded-md bg-blue-500/10">
                <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Purchase Order</p>
                <p className="text-xs text-muted-foreground">Order from vendors</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setLocation("/sales-orders")}
              className="flex items-center gap-3 p-3 cursor-pointer"
              data-testid="quick-action-sales-order"
            >
              <div className="p-2 rounded-md bg-green-500/10">
                <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Sales Order</p>
                <p className="text-xs text-muted-foreground">Create customer order</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setLocation("/grn")}
              className="flex items-center gap-3 p-3 cursor-pointer"
              data-testid="quick-action-grn"
            >
              <div className="p-2 rounded-md bg-purple-500/10">
                <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Goods Receipt</p>
                <p className="text-xs text-muted-foreground">Record incoming stock</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setLocation("/invoices")}
              className="flex items-center gap-3 p-3 cursor-pointer"
              data-testid="quick-action-invoice"
            >
              <div className="p-2 rounded-md bg-orange-500/10">
                <CreditCard className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Invoice</p>
                <p className="text-xs text-muted-foreground">Generate invoice</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Divider */}
        <div className="h-6 w-px bg-border hidden lg:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              size="icon" 
              variant="ghost" 
              className="relative h-8 w-8 hover:bg-accent transition-colors" 
              data-testid="button-notifications"
            >
              <Bell className="h-4 w-4" />
              <Badge
                variant="destructive"
                className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[9px] font-bold"
              >
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-3 border-b">
              <h4 className="font-semibold text-sm">Notifications</h4>
            </div>
            {mockNotifications.map((notif) => (
              <DropdownMenuItem
                key={notif.id}
                className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                data-testid={`notification-${notif.id}`}
              >
                <p className="text-sm font-medium">{notif.title}</p>
                <p className="text-xs text-muted-foreground">{notif.description}</p>
                <p className="text-xs text-muted-foreground">{notif.time}</p>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Divider */}
        <div className="h-6 w-px bg-border hidden lg:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 h-8 px-2 hover:bg-accent transition-colors"
              data-testid="button-user-menu"
            >
              <Avatar className="h-6 w-6 ring-1 ring-border">
                <AvatarFallback className="bg-gradient-to-br from-primary via-blue-600 to-purple-600 text-primary-foreground text-[10px] font-bold">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden xl:block">
                <p className="text-xs font-medium leading-tight">John Doe</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem data-testid="menu-settings" className="cursor-pointer">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive cursor-pointer" data-testid="menu-logout">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
