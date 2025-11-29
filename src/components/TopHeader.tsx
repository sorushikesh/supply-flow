import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="h-14 border-b flex items-center justify-between gap-4 px-4 bg-card sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger data-testid="button-sidebar-toggle" />
        {breadcrumb && (
          <nav className="text-sm text-muted-foreground hidden sm:block" data-testid="breadcrumb">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">{breadcrumb}</span>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-2">
        {searchOpen ? (
          <div className="relative">
            <Input
              type="search"
              placeholder="Search anything..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-64 pr-8"
              autoFocus
              data-testid="input-global-search"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-full"
              onClick={() => {
                setSearchOpen(false);
                setSearchValue("");
              }}
              data-testid="button-close-search"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setSearchOpen(true)}
            data-testid="button-open-search"
          >
            <Search className="h-4 w-4" />
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="relative" data-testid="button-notifications">
              <Bell className="h-4 w-4" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
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

        <ThemeToggle />
      </div>
    </header>
  );
}
