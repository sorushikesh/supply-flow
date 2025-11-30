import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { PageBackground } from "@/components/PageBackground";
import { StatsCard } from "@/components/StatsCard";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge, type StatusType } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  ShoppingCart,
  FileText,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Link } from "wouter";

// todo: remove mock functionality
interface RecentOrder {
  id: string;
  orderNumber: string;
  type: "PO" | "SO";
  party: string;
  amount: number;
  status: StatusType;
  date: string;
}

interface LowStockItem {
  id: string;
  sku: string;
  name: string;
  currentStock: number;
  reorderLevel: number;
}

const mockRecentOrders: RecentOrder[] = [
  { id: "1", orderNumber: "PO-2024-0045", type: "PO", party: "Acme Corp", amount: 12500, status: "pending", date: "Today" },
  { id: "2", orderNumber: "SO-2024-0123", type: "SO", party: "TechStart Inc", amount: 8750, status: "approved", date: "Today" },
  { id: "3", orderNumber: "PO-2024-0044", type: "PO", party: "Global Supply", amount: 3200, status: "completed", date: "Yesterday" },
  { id: "4", orderNumber: "SO-2024-0122", type: "SO", party: "Metro Retail", amount: 15600, status: "in_transit", date: "Yesterday" },
  { id: "5", orderNumber: "SO-2024-0121", type: "SO", party: "City Stores", amount: 4800, status: "delivered", date: "2 days ago" },
];

const mockLowStockItems: LowStockItem[] = [
  { id: "1", sku: "WDG-001", name: "Widget Alpha", currentStock: 12, reorderLevel: 50 },
  { id: "2", sku: "GDG-023", name: "Gadget Pro", currentStock: 8, reorderLevel: 25 },
  { id: "3", sku: "CMP-045", name: "Component X", currentStock: 3, reorderLevel: 20 },
];

const mockOverdueInvoices = [
  { id: "1", invoiceNumber: "INV-2024-0089", party: "Beta Industries", amount: 5600, daysOverdue: 15 },
  { id: "2", invoiceNumber: "INV-2024-0076", party: "Delta Corp", amount: 12300, daysOverdue: 8 },
];

export default function Dashboard() {
  const [selectedOrder, setSelectedOrder] = useState<RecentOrder | null>(null);

  const orderColumns: Column<RecentOrder>[] = [
    { key: "orderNumber", header: "Order #", className: "font-mono text-sm" },
    {
      key: "type",
      header: "Type",
      render: (item) => (
        <span className={`text-xs font-medium px-2 py-1 rounded ${
          item.type === "PO" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
        }`}>
          {item.type}
        </span>
      ),
    },
    { key: "party", header: "Party" },
    {
      key: "amount",
      header: "Amount",
      className: "font-mono text-right",
      render: (item) => `$${item.amount.toLocaleString()}`,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    { key: "date", header: "Date", className: "text-muted-foreground" },
  ];

  const lowStockColumns: Column<LowStockItem>[] = [
    { key: "sku", header: "SKU", className: "font-mono text-sm" },
    { key: "name", header: "Product" },
    {
      key: "currentStock",
      header: "Current",
      className: "font-mono text-right text-destructive font-medium",
    },
    {
      key: "reorderLevel",
      header: "Reorder Level",
      className: "font-mono text-right text-muted-foreground",
    },
  ];

  return (
    <PageBackground>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in relative">
        <PageHeader
          title="Dashboard"
          description="Overview of your supply chain operations"
        />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="animate-fade-in" style={{ animationDelay: '0ms' }}>
          <StatsCard
            title="Total Inventory Value"
            value="$284,520"
            change={12.5}
            changeLabel="vs last month"
            icon={Package}
          />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <StatsCard
            title="Pending Orders"
            value="23"
            change={-8}
            changeLabel="vs last week"
            icon={ShoppingCart}
          />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <StatsCard
            title="Open Invoices"
            value="$67,890"
            change={5.2}
            changeLabel="vs last month"
            icon={FileText}
          />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <StatsCard
            title="Payments Received"
            value="$156,340"
            change={18.3}
            changeLabel="vs last month"
            icon={CreditCard}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 animate-slide-up-fade" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
            <Link href="/purchase-orders">
              <Button variant="ghost" size="sm" data-testid="link-view-all-orders" className="transition-all duration-200 hover:translate-x-1">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={orderColumns}
              data={mockRecentOrders}
              onRowClick={(order) => setSelectedOrder(order)}
              pageSize={5}
              testIdPrefix="recent-orders"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 animate-pulse hover:animate-wiggle cursor-pointer" />
              <CardTitle className="text-lg font-semibold">Low Stock Alerts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockLowStockItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover-elevate transition-all duration-200 hover:scale-[1.02] hover:shadow-md cursor-pointer animate-slide-up-fade"
                  style={{ animationDelay: `${index * 50}ms` }}
                  data-testid={`low-stock-item-${item.id}`}
                >
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-medium text-destructive animate-pulse">
                      {item.currentStock} left
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Reorder: {item.reorderLevel}
                    </p>
                  </div>
                </div>
              ))}
              <Link href="/inventory">
                <Button variant="outline" className="w-full" data-testid="link-view-inventory">
                  View Inventory
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold">Overdue Invoices</CardTitle>
            <Link href="/invoices">
              <Button variant="ghost" size="sm" data-testid="link-view-invoices" className="transition-all duration-200 hover:translate-x-1">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockOverdueInvoices.map((inv, index) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-destructive/20 bg-destructive/5 transition-all duration-200 hover:border-destructive/40 hover:shadow-md hover:scale-[1.02] cursor-pointer animate-slide-up-fade"
                  style={{ animationDelay: `${index * 50}ms` }}
                  data-testid={`overdue-invoice-${inv.id}`}
                >
                  <div>
                    <p className="font-medium text-sm">{inv.party}</p>
                    <p className="text-xs text-muted-foreground font-mono">{inv.invoiceNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-medium">${inv.amount.toLocaleString()}</p>
                    <p className="text-xs text-destructive font-medium">
                      {inv.daysOverdue} days overdue
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/purchase-orders">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95 group animate-slide-up-fade" data-testid="quick-action-new-po" style={{ animationDelay: '0ms' }}>
                  <ShoppingCart className="h-5 w-5 transition-transform group-hover:rotate-12" />
                  <span className="text-xs">New Purchase Order</span>
                </Button>
              </Link>
              <Link href="/sales-orders">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95 group animate-slide-up-fade" data-testid="quick-action-new-so" style={{ animationDelay: '50ms' }}>
                  <FileText className="h-5 w-5 transition-transform group-hover:rotate-12" />
                  <span className="text-xs">New Sales Order</span>
                </Button>
              </Link>
              <Link href="/grn">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95 group animate-slide-up-fade" data-testid="quick-action-new-grn" style={{ animationDelay: '100ms' }}>
                  <Package className="h-5 w-5 transition-transform group-hover:rotate-12" />
                  <span className="text-xs">Record GRN</span>
                </Button>
              </Link>
              <Link href="/invoices">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95 group animate-slide-up-fade" data-testid="quick-action-new-invoice" style={{ animationDelay: '150ms' }}>
                  <CreditCard className="h-5 w-5 transition-transform group-hover:rotate-12" />
                  <span className="text-xs">Create Invoice</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </PageBackground>
  );
}
