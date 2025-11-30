import { PageBackground } from "@/components/PageBackground";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge, type StatusType } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  ShoppingCart,
  FileText,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  DollarSign,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  RefreshCw,
  Boxes,
  Users,
  Building2,
} from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

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
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

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
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="xl" text="Loading dashboard..." />
        </div>
      ) : (
      <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Hero Header Section */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-blue-500/5 to-purple-500/10 p-6 sm:p-8">
          <div className="absolute inset-0 bg-grid-white/5" aria-hidden="true" />
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Supply Flow
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
                  Real-time supply chain intelligence and operational insights
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="gap-2 px-4 py-2 border-green-500/30 bg-green-500/10">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium">Live</span>
                </Badge>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/inventory" className="group relative overflow-hidden rounded-xl border border-primary/30 bg-background/50 backdrop-blur-xl p-4 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" aria-label="View inventory details">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 rounded-lg bg-primary/10">
                    <Package className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-green-500" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Total Inventory</p>
                  <p className="text-2xl font-bold">$284.5K</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-green-500 font-medium" aria-label="Increased by 12.5 percent">+12.5%</span>
                    <span className="text-muted-foreground">vs last month</span>
                  </div>
                </div>
              </Link>

              <Link href="/purchase-orders" className="group relative overflow-hidden rounded-xl border border-blue-500/30 bg-background/50 backdrop-blur-xl p-4 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" aria-label="View active orders">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 rounded-lg bg-blue-500/10">
                    <ShoppingCart className="h-5 w-5 text-blue-500" aria-hidden="true" />
                  </div>
                  <ArrowDownRight className="h-4 w-4 text-orange-500" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Active Orders</p>
                  <p className="text-2xl font-bold">23</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-orange-500 font-medium" aria-label="Decreased by 8 percent">-8%</span>
                    <span className="text-muted-foreground">vs last week</span>
                  </div>
                </div>
              </Link>

              <Link href="/financial" className="group relative overflow-hidden rounded-xl border border-purple-500/30 bg-background/50 backdrop-blur-xl p-4 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2" aria-label="View open invoices">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 rounded-lg bg-purple-500/10">
                    <FileText className="h-5 w-5 text-purple-500" aria-hidden="true" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-green-500" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Open Invoices</p>
                  <p className="text-2xl font-bold">$67.9K</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-green-500 font-medium" aria-label="Increased by 5.2 percent">+5.2%</span>
                    <span className="text-muted-foreground">12 pending</span>
                  </div>
                </div>
              </Link>

              <Link href="/analytics" className="group relative overflow-hidden rounded-xl border border-green-500/30 bg-background/50 backdrop-blur-xl p-4 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2" aria-label="View revenue analytics">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 rounded-lg bg-green-500/10">
                    <DollarSign className="h-5 w-5 text-green-500" aria-hidden="true" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-green-500" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Revenue MTD</p>
                  <p className="text-2xl font-bold">$156.3K</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-green-500 font-medium" aria-label="Increased by 18.3 percent">+18.3%</span>
                    <span className="text-muted-foreground">trending up</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="xl:col-span-2 space-y-6">
            {/* Performance Metrics */}
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">System Performance</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">Real-time operational metrics</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="gap-1.5">
                    <Zap className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs">Optimal</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Order Fulfillment</span>
                      <span className="text-sm font-bold text-green-600">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                    <p className="text-xs text-muted-foreground">342 of 364 orders delivered on time</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Inventory Accuracy</span>
                      <span className="text-sm font-bold text-blue-600">98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                    <p className="text-xs text-muted-foreground">1,245 items verified this month</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Supplier Performance</span>
                      <span className="text-sm font-bold text-purple-600">91%</span>
                    </div>
                    <Progress value={91} className="h-2" />
                    <p className="text-xs text-muted-foreground">28 of 31 suppliers on schedule</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Payment Collection</span>
                      <span className="text-sm font-bold text-orange-600">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                    <p className="text-xs text-muted-foreground">$156K collected of $179K due</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Recent Transactions</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">Latest order activity</p>
                    </div>
                  </div>
                  <Link href="/purchase-orders">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <span className="text-xs">View All</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={orderColumns}
                  data={mockRecentOrders}
                  pageSize={5}
                  testIdPrefix="recent-orders"
                />
              </CardContent>
            </Card>

            {/* Overdue Invoices */}
            <Card className="border-red-500/30 bg-gradient-to-br from-red-500/5 to-orange-500/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-500/10">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Overdue Payments</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">Requires immediate attention</p>
                    </div>
                  </div>
                  <Link href="/financial">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <span className="text-xs">View All</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockOverdueInvoices.map((inv, index) => (
                    <div
                      key={inv.id}
                      className="group relative rounded-lg border border-red-500/20 bg-background/80 backdrop-blur-sm p-4 hover:border-red-500/40 hover:bg-red-500/5 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-red-500/10">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{inv.party}</p>
                            <p className="text-xs text-muted-foreground font-mono">{inv.invoiceNumber}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-red-600">${inv.amount.toLocaleString()}</p>
                          <Badge variant="destructive" className="text-xs mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {inv.daysOverdue} days overdue
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Critical Alerts */}
            <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-red-500/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">Critical Stock Alerts</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">Reorder required</p>
                    </div>
                  </div>
                  <Badge variant="destructive">{mockLowStockItems.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockLowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="group rounded-lg border border-amber-500/20 bg-background/80 backdrop-blur-sm p-3 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{item.sku}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Progress 
                          value={(item.currentStock / item.reorderLevel) * 100} 
                          className="h-2"
                        />
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-red-600">{item.currentStock}</p>
                        <p className="text-xs text-muted-foreground">/{item.reorderLevel}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Link href="/inventory">
                  <Button variant="outline" className="w-full border-amber-500/30 hover:bg-amber-500/10">
                    <Boxes className="h-4 w-4 mr-2" />
                    Manage Inventory
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">Live Activity</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Last 24 hours</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">Order delivered successfully</p>
                    <p className="text-xs text-muted-foreground">#SO-2024-0125 • 2m ago</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Loader2 className="h-4 w-4 text-blue-500 animate-spin flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">Processing payment</p>
                    <p className="text-xs text-muted-foreground">$8,750 • 5m ago</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">Invoice sent to customer</p>
                    <p className="text-xs text-muted-foreground">#INV-2024-0101 • 12m ago</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">Payment overdue alert</p>
                    <p className="text-xs text-muted-foreground">Delta Corp • 1h ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
              <CardHeader>
                <CardTitle className="text-sm">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Active Customers</span>
                  </div>
                  <span className="text-sm font-bold">248</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Active Vendors</span>
                  </div>
                  <span className="text-sm font-bold">87</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Products in Stock</span>
                  </div>
                  <span className="text-sm font-bold">1,245</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Orders This Month</span>
                  </div>
                  <span className="text-sm font-bold">364</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      )}
    </PageBackground>
  );
}
