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
                className="transition-all duration-200 hover:translate-x-1 hover:bg-accent/80 active:scale-95"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar className="transition-all duration-300 ease-in-out">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary">
            <Package className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-base">SupplyFlow</h2>
            <p className="text-xs text-muted-foreground">Management System</p>
          </div>
        </div>
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
