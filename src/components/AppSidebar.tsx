import { useLocation, Link } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Package,
  Users,
  Building2,
  ShoppingCart,
  ClipboardList,
  FileCheck,
  Truck,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
} from "lucide-react";

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Inventory", url: "/inventory", icon: Package },
];

const partiesNavItems = [
  { title: "Vendors", url: "/vendors", icon: Building2 },
  { title: "Customers", url: "/customers", icon: Users },
];

const ordersNavItems = [
  { title: "Purchase Orders", url: "/purchase-orders", icon: ShoppingCart },
  { title: "Sales Orders", url: "/sales-orders", icon: ClipboardList },
  { title: "GRN", url: "/grn", icon: FileCheck },
  { title: "Dispatch", url: "/dispatch", icon: Truck },
];

const financeNavItems = [
  { title: "Invoices", url: "/invoices", icon: FileText },
  { title: "Payments", url: "/payments", icon: CreditCard },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

const systemNavItems = [
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [location, setLocation] = useLocation();

  const renderNavGroup = (
    label: string,
    items: typeof mainNavItems,
    testIdPrefix: string
  ) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={location === item.url}
                data-testid={`${testIdPrefix}-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setLocation(item.url)}
                className="transition-all duration-200 hover:translate-x-1 hover:bg-accent/80 active:scale-95 group"
              >
                <item.icon className="h-4 w-4 group-hover:animate-wiggle" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar className="transition-all duration-300 ease-in-out backdrop-blur-md">
      <SidebarHeader className="p-4 border-b border-sidebar-border relative overflow-hidden group">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2 rounded-lg bg-primary relative overflow-hidden group/icon">
            {/* Icon glow effect */}
            <div className="absolute inset-0 bg-primary/50 blur-md opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300" />
            <Package className="h-5 w-5 text-primary-foreground relative z-10 transition-transform duration-300 group-hover/icon:rotate-12 group-hover/icon:scale-110" />
          </div>
          <div className="transition-all duration-300 group-hover:translate-x-1">
            <h2 className="font-semibold text-base bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-cyan-500 transition-all duration-500">SupplyFlow</h2>
            <p className="text-xs text-muted-foreground group-hover:text-primary/70 transition-colors duration-300">Management System</p>
          </div>
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </SidebarHeader>

      <SidebarContent className="px-2">
        {renderNavGroup("Overview", mainNavItems, "nav-main")}
        {renderNavGroup("Parties", partiesNavItems, "nav-parties")}
        {renderNavGroup("Orders", ordersNavItems, "nav-orders")}
        {renderNavGroup("Finance", financeNavItems, "nav-finance")}
        {renderNavGroup("System", systemNavItems, "nav-system")}
      </SidebarContent>
    </Sidebar>
  );
}
