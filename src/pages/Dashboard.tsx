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
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  RefreshCw,
  Boxes,
  Users,
  Building2,
} from "lucide-react";
import { Link } from "wouter";

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
  { id: "1", orderNumber: "PO-2024-0045", type: "PO", party: "Dell Technologies", amount: 59375, status: "pending", date: "Today" },
  { id: "2", orderNumber: "SO-2024-0123", type: "SO", party: "TechCorp Solutions", amount: 25750, status: "approved", date: "Today" },
  { id: "3", orderNumber: "PO-2024-0044", type: "PO", party: "Samsung Electronics", amount: 31960, status: "completed", date: "Yesterday" },
  { id: "4", orderNumber: "SO-2024-0122", type: "SO", party: "BestBuy Corporate", amount: 65200, status: "in_transit", date: "Yesterday" },
  { id: "5", orderNumber: "SO-2024-0121", type: "SO", party: "Micro Center Distribution", amount: 18594, status: "delivered", date: "2 days ago" },
];

const mockLowStockItems: LowStockItem[] = [
  { id: "1", sku: "LTP-0001", name: "Dell Latitude 5540 15.6\" Laptop", currentStock: 12, reorderLevel: 50 },
  { id: "2", sku: "MON-0023", name: "Samsung 27\" 4K Monitor", currentStock: 8, reorderLevel: 25 },
  { id: "3", sku: "PWR-0045", name: "Laptop Power Adapter 65W", currentStock: 3, reorderLevel: 20 },
];

const mockOverdueInvoices = [
  { id: "1", invoiceNumber: "INV-2024-0089", party: "CompuWorld Retailers", amount: 18450, daysOverdue: 15 },
  { id: "2", invoiceNumber: "INV-2024-0076", party: "Insight Enterprises", amount: 42800, daysOverdue: 8 },
];

export default function Dashboard() {
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
      <div className="relative z-10 p-6">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
                Dashboard
              </span>
            </h1>
            <p className="text-muted-foreground">Real-time supply chain intelligence and operational insights</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-2 px-4 py-2 border-green-500/30 bg-green-500/10 animate-pulse-subtle">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium">Live</span>
            </Badge>
            <Button variant="outline" size="icon" className="h-10 w-10 hover:rotate-180 transition-transform duration-500">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Link href="/inventory" className="group block">
            <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Inventory
                  </CardTitle>
                  <Package className="h-4 w-4 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold">$284.5K</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-500 font-medium">+12.5%</span>
                    </div>
                  </div>
                  <Package className="h-8 w-8 text-primary opacity-20 group-hover:opacity-30 transition-opacity" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/purchase-orders" className="group block">
            <Card className="border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Orders
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-blue-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold">23</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowDownRight className="h-3 w-3 text-orange-500" />
                      <span className="text-xs text-orange-500 font-medium">-8%</span>
                    </div>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-blue-500 opacity-20 group-hover:opacity-30 transition-opacity" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/financial" className="group block">
            <Card className="border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Open Invoices
                  </CardTitle>
                  <FileText className="h-4 w-4 text-purple-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold">$67.9K</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-500 font-medium">+5.2%</span>
                    </div>
                  </div>
                  <FileText className="h-8 w-8 text-purple-500 opacity-20 group-hover:opacity-30 transition-opacity" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/analytics" className="group block">
            <Card className="border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 hover:-translate-y-1">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Revenue MTD
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-green-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold">$156.3K</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-500 font-medium">+18.3%</span>
                    </div>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500 opacity-20 group-hover:opacity-30 transition-opacity" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="xl:col-span-2 space-y-6">
            {/* Performance Metrics */}
            <Card className="border-primary/20 hover:border-primary/30 transition-colors duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">System Performance</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">Real-time operational metrics</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="gap-1.5">
                    <Zap className="h-3 w-3 text-yellow-500 animate-pulse" />
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
            <Card className="border-primary/20 hover:border-primary/30 transition-colors duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">Recent Transactions</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Latest order activity</p>
                    </div>
                  </div>
                  <Link href="/purchase-orders">
                    <Button variant="ghost" size="sm" className="gap-2 hover:gap-3 transition-all">
                      <span className="text-xs">View All</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
                <DataTable
                  columns={orderColumns}
                  data={mockRecentOrders}
                  pageSize={5}
                  testIdPrefix="recent-orders"
                />
              </CardContent>
            </Card>

            {/* Overdue Invoices */}
            <Card className="border-red-500/30 bg-gradient-to-br from-red-500/5 to-orange-500/5 hover:border-red-500/40 transition-colors duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">Overdue Payments</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Requires immediate attention</p>
                    </div>
                  </div>
                  <Link href="/financial">
                    <Button variant="ghost" size="sm" className="gap-2 hover:gap-3 transition-all">
                      <span className="text-xs">View All</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {mockOverdueInvoices.map((inv, index) => (
                    <div
                      key={inv.id}
                      className="group relative rounded-lg border border-red-500/20 bg-background/80 backdrop-blur-sm p-4 hover:border-red-500/40 hover:bg-red-500/5 transition-all cursor-pointer hover:scale-[1.02] duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
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
            <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-red-500/5 hover:border-amber-500/40 transition-colors duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <AlertTriangle className="h-5 w-5 text-amber-500 animate-pulse" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">Critical Stock Alerts</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Reorder required</p>
                    </div>
                  </div>
                  <Badge variant="destructive" className="animate-pulse-subtle">{mockLowStockItems.length}</Badge>
                </div>
                {mockLowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="group rounded-lg border border-amber-500/20 bg-background/80 backdrop-blur-sm p-3 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all cursor-pointer hover:scale-[1.02] duration-200"
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
            <Card className="border-primary/20 hover:border-primary/30 transition-colors duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Activity className="h-4 w-4 text-primary animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Live Activity</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Last 24 hours</p>
                  </div>
                </div>
                <div className="space-y-3">
                <div className="flex gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20 hover:bg-green-500/15 transition-colors cursor-pointer">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">Order delivered successfully</p>
                    <p className="text-xs text-muted-foreground">#SO-2024-0125 • 2m ago</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/15 transition-colors cursor-pointer">
                  <Clock className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">Processing payment</p>
                    <p className="text-xs text-muted-foreground">$8,750 • 5m ago</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/15 transition-colors cursor-pointer">
                  <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">Invoice sent to customer</p>
                    <p className="text-xs text-muted-foreground">#INV-2024-0101 • 12m ago</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/15 transition-colors cursor-pointer">
                  <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5 animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">Payment overdue alert</p>
                    <p className="text-xs text-muted-foreground">Delta Corp • 1h ago</p>
                  </div>
                </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageBackground>
  );
}
