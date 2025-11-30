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
import { Bell, Settings, LogOut, Zap, ShoppingCart, FileText, Package, CreditCard, Keyboard, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { CompanySettingsDialog } from "@/components/CompanySettingsDialog";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const mockNotifications = [
  { id: 1, title: "Low Stock Alert", description: "Dell Latitude laptops below reorder level", time: "2 min ago", type: "alert" },
  { id: 2, title: "PO Approved", description: "PO-2024-0042 from HP has been approved", time: "15 min ago", type: "approval" },
  { id: 3, title: "Invoice Overdue", description: "INV-2024-0089 is overdue by 5 days", time: "1 hour ago", type: "alert" },
  { id: 4, title: "Approval Required", description: "Purchase Order PO-2024-0045 awaits your approval", time: "5 min ago", type: "approval" },
];

interface TopHeaderProps {
  breadcrumb?: string;
}

export function TopHeader({ breadcrumb }: TopHeaderProps) {
  const [, setLocation] = useLocation();
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <header className="h-16 border-b flex items-center justify-between gap-4 px-6 bg-background/95 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger data-testid="button-sidebar-toggle" className="h-9 w-9" />
        {breadcrumb && (
          <nav className="text-sm text-muted-foreground hidden md:block" data-testid="breadcrumb">
            <span className="hover:text-foreground cursor-pointer">Home</span>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">{breadcrumb}</span>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Actions Dropdown */}
        <DropdownMenu>
          <Tooltip>
            <DropdownMenuTrigger asChild>
              <TooltipTrigger asChild>
                <Button 
                  variant="default"
                  size="icon"
                  className="h-10 w-10"
                  data-testid="button-quick-actions"
                >
                  <Zap className="h-[18px] w-[18px]" />
                </Button>
              </TooltipTrigger>
            </DropdownMenuTrigger>
            <TooltipContent>
              <p>Quick Actions</p>
            </TooltipContent>
          </Tooltip>
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
              onClick={() => setLocation("/financial")}
              className="flex items-center gap-3 p-3 cursor-pointer"
              data-testid="quick-action-invoice"
            >
              <div className="p-2 rounded-md bg-orange-500/10">
                <CreditCard className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Financial</p>
                <p className="text-xs text-muted-foreground">Invoices & Payments</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-8 w-px bg-border" />

        {/* Approvals */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 relative"
              onClick={() => setLocation("/approvals")}
            >
              <CheckCircle2 className="h-[18px] w-[18px]" />
              <div className="absolute -top-1 -right-1 h-6 min-w-[24px] px-2 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                5
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Approvals (5 pending)</p>
          </TooltipContent>
        </Tooltip>

        <div className="h-8 w-px bg-border" />

        {/* Notifications */}
        <DropdownMenu>
          <Tooltip>
            <DropdownMenuTrigger asChild>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 relative" 
                  data-testid="button-notifications"
                >
                  <Bell className="h-[18px] w-[18px]" />
                  <div className="absolute -top-1 -right-1 h-6 min-w-[24px] px-2 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                    4
                  </div>
                </Button>
              </TooltipTrigger>
            </DropdownMenuTrigger>
            <TooltipContent>
              <p>Notifications (4 unread)</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-3 border-b">
              <h4 className="font-semibold text-sm">Notifications</h4>
            </div>
            {mockNotifications.map((notif) => (
              <DropdownMenuItem
                key={notif.id}
                className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                data-testid={`notification-${notif.id}`}
                onClick={() => {
                  if (notif.type === "approval") {
                    setLocation("/approvals");
                  }
                }}
              >
                <div className="flex items-center gap-2 w-full">
                  <p className="text-sm font-medium flex-1">{notif.title}</p>
                  {notif.type === "approval" && (
                    <Badge variant="secondary" className="text-xs">
                      Approval
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{notif.description}</p>
                <p className="text-xs text-muted-foreground">{notif.time}</p>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-8 w-px bg-border" />

        {/* Company Settings */}
        <CompanySettingsDialog />

        {/* User Menu */}
        <DropdownMenu>
          <Tooltip>
            <DropdownMenuTrigger asChild>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  data-testid="button-user-menu"
                >
                  <Avatar className="h-[18px] w-[18px]">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-[10px] font-bold">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </TooltipTrigger>
            </DropdownMenuTrigger>
            <TooltipContent>
              <p>John Doe - User Menu</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              data-testid="menu-profile" 
              className="cursor-pointer"
              onClick={() => setLocation("/user-profile")}
            >
              <Settings className="h-4 w-4 mr-2" />
              My Profile
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
