import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Settings, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  return (
    <header className="h-14 border-b flex items-center justify-between gap-4 px-4 bg-card/95 backdrop-blur-md sticky top-0 z-50 shadow-sm relative overflow-hidden group">
      {/* Animated gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex items-center gap-4 relative z-10">
        <SidebarTrigger data-testid="button-sidebar-toggle" className="transition-transform duration-300 hover:scale-110 hover:rotate-180" />
        {breadcrumb && (
          <nav className="text-sm text-muted-foreground hidden sm:block animate-fade-in" data-testid="breadcrumb">
            <span className="transition-colors duration-300 hover:text-primary cursor-pointer">Home</span>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent hover:from-primary hover:to-cyan-500 transition-all duration-300">{breadcrumb}</span>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-2 relative z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="relative transition-all duration-300 hover:scale-110 group/bell" data-testid="button-notifications">
              <Bell className="h-4 w-4 group-hover/bell:animate-wiggle" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] animate-pulse"
              >
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 backdrop-blur-md bg-card/95 border border-primary/20 shadow-xl">
            <div className="p-3 border-b border-primary/10">
              <h4 className="font-semibold text-sm bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Notifications</h4>
            </div>
            {mockNotifications.map((notif, index) => (
              <DropdownMenuItem
                key={notif.id}
                className="flex flex-col items-start gap-1 p-3 cursor-pointer transition-all duration-200 hover:bg-primary/10 hover:translate-x-1 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
                data-testid={`notification-${notif.id}`}
              >
                <p className="text-sm font-medium">{notif.title}</p>
                <p className="text-xs text-muted-foreground">{notif.description}</p>
                <p className="text-xs text-muted-foreground">{notif.time}</p>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 h-9 px-2 transition-all duration-300 hover:scale-105 hover:bg-primary/10 group/user"
              data-testid="button-user-menu"
            >
              <Avatar className="h-7 w-7 ring-2 ring-primary/20 group-hover/user:ring-primary/50 transition-all duration-300">
                <AvatarFallback className="bg-gradient-to-br from-primary to-cyan-500 text-primary-foreground text-xs group-hover/user:scale-110 transition-transform duration-300">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium leading-none group-hover/user:text-primary transition-colors duration-300">John Doe</p>
                <p className="text-xs text-muted-foreground leading-none mt-0.5">Admin</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 backdrop-blur-md bg-card/95 border border-primary/20 shadow-xl">
            <DropdownMenuItem data-testid="menu-settings" className="transition-all duration-200 hover:bg-primary/10 hover:translate-x-1">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive transition-all duration-200 hover:bg-destructive/10 hover:translate-x-1" data-testid="menu-logout">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </header>
  );
}
