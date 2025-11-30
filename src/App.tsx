import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopHeader } from "@/components/TopHeader";
import { FuturisticBackground } from "@/components/FuturisticBackground";
import { FloatingParticles } from "@/components/FloatingParticles";
import { useGlobalShortcuts } from "@/components/KeyboardShortcuts";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import Vendors from "@/pages/Vendors";
import Customers from "@/pages/Customers";
import PurchaseOrders from "@/pages/PurchaseOrders";
import SalesOrders from "@/pages/SalesOrders";
import GRN from "@/pages/GRN";
import Dispatch from "@/pages/Dispatch";
import Invoices from "@/pages/Invoices";
import Payments from "@/pages/Payments";
import Analytics from "@/pages/Analytics";
import ControlPanel from "@/pages/ControlPanel";
import CompanyOverview from "@/pages/CompanyOverview";
import UserProfile from "@/pages/UserProfile";

const routes = [
  { path: "/", component: Dashboard, breadcrumb: "Dashboard" },
  { path: "/inventory", component: Inventory, breadcrumb: "Inventory" },
  { path: "/vendors", component: Vendors, breadcrumb: "Vendors" },
  { path: "/customers", component: Customers, breadcrumb: "Customers" },
  { path: "/purchase-orders", component: PurchaseOrders, breadcrumb: "Purchase Orders" },
  { path: "/sales-orders", component: SalesOrders, breadcrumb: "Sales Orders" },
  { path: "/grn", component: GRN, breadcrumb: "GRN" },
  { path: "/dispatch", component: Dispatch, breadcrumb: "Dispatch" },
  { path: "/invoices", component: Invoices, breadcrumb: "Invoices" },
  { path: "/payments", component: Payments, breadcrumb: "Payments" },
  { path: "/analytics", component: Analytics, breadcrumb: "Analytics" },
  { path: "/control-panel", component: ControlPanel, breadcrumb: "Control Panel" },
  { path: "/company-overview", component: CompanyOverview, breadcrumb: "Company Overview" },
  { path: "/user-profile", component: UserProfile, breadcrumb: "User Profile" },
];

function Router() {
  return (
    <Switch>
      {routes.map(({ path, component: Component }) => (
        <Route key={path} path={path} component={Component} />
      ))}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  // Enable global keyboard shortcuts
  useGlobalShortcuts();

  return (
    <TooltipProvider>
      <SidebarProvider style={style as React.CSSProperties}>
        {/* Futuristic animated background */}
        <FuturisticBackground />
        
        {/* Optional: Floating particles for extra effect */}
        <FloatingParticles count={15} className="opacity-30" />
        
        <div className="flex h-screen w-full relative z-10">
          <AppSidebar />
          <div className="flex flex-col flex-1 min-w-0">
            <TopHeader />
            <main className="flex-1 overflow-auto bg-background/80 backdrop-blur-sm">
              <Router />
            </main>
          </div>
        </div>
      </SidebarProvider>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
