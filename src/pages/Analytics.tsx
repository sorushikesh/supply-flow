import { PageHeader } from "@/components/PageHeader";
import { PageBackground } from "@/components/PageBackground";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  ShoppingCart,
  FileText,
  TrendingUp,
  Users,
  Building2,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { useState } from "react";

// todo: remove mock functionality - simplified chart representation
const mockSalesData = [
  { month: "Jan", sales: 45000, purchases: 32000 },
  { month: "Feb", sales: 52000, purchases: 38000 },
  { month: "Mar", sales: 48000, purchases: 35000 },
  { month: "Apr", sales: 61000, purchases: 42000 },
  { month: "May", sales: 55000, purchases: 39000 },
  { month: "Jun", sales: 67000, purchases: 45000 },
];

const mockTopProducts = [
  { name: "Widget Alpha", revenue: 45600, units: 1520 },
  { name: "Gadget Pro", revenue: 38900, units: 260 },
  { name: "Widget Beta", revenue: 32400, units: 1012 },
  { name: "Component X", revenue: 28700, units: 2296 },
  { name: "Accessory Pack", revenue: 21500, units: 1433 },
];

const mockTopVendors = [
  { name: "Tech Components", spend: 234000, orders: 56 },
  { name: "Acme Corporation", spend: 156000, orders: 45 },
  { name: "Global Supply Co", spend: 89500, orders: 32 },
];

const mockTopCustomers = [
  { name: "Express Outlets", revenue: 567000, orders: 112 },
  { name: "Metro Retail Group", revenue: 456000, orders: 89 },
  { name: "Wholesale Partners", revenue: 345600, orders: 78 },
];

export default function Analytics() {
  const [period, setPeriod] = useState("6months");

  const maxSales = Math.max(...mockSalesData.map((d) => d.sales));

  return (
    <PageBackground>
      <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Analytics
            </h1>
            <p className="text-muted-foreground mt-1">Business insights and performance metrics</p>
          </div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]" data-testid="select-period">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value="$328,000"
          change={15.3}
          changeLabel="vs last period"
          icon={DollarSign}
        />
        <StatsCard
          title="Total Orders"
          value="342"
          change={8.2}
          changeLabel="vs last period"
          icon={ShoppingCart}
        />
        <StatsCard
          title="Inventory Turnover"
          value="4.2x"
          change={12.5}
          changeLabel="vs last period"
          icon={Package}
        />
        <StatsCard
          title="Profit Margin"
          value="24.8%"
          change={-2.1}
          changeLabel="vs last period"
          icon={TrendingUp}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Sales vs Purchases Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSalesData.map((data) => (
                <div key={data.month} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{data.month}</span>
                    <span className="text-muted-foreground">
                      Sales: ${(data.sales / 1000).toFixed(0)}k | Purchases: ${(data.purchases / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div className="flex gap-1 h-6">
                    <div
                      className="bg-primary rounded-sm transition-all"
                      style={{ width: `${(data.sales / maxSales) * 60}%` }}
                      title={`Sales: $${data.sales.toLocaleString()}`}
                    />
                    <div
                      className="bg-orange-500 rounded-sm transition-all"
                      style={{ width: `${(data.purchases / maxSales) * 60}%` }}
                      title={`Purchases: $${data.purchases.toLocaleString()}`}
                    />
                  </div>
                </div>
              ))}
              <div className="flex gap-4 pt-4 border-t text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-primary" />
                  <span>Sales</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-orange-500" />
                  <span>Purchases</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTopProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  data-testid={`top-product-${index}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-muted-foreground w-6">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.units.toLocaleString()} units sold
                      </p>
                    </div>
                  </div>
                  <p className="font-mono font-bold">
                    ${product.revenue.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Top Vendors by Spend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTopVendors.map((vendor, index) => {
                const maxSpend = mockTopVendors[0].spend;
                return (
                  <div key={vendor.name} className="space-y-2" data-testid={`top-vendor-${index}`}>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-muted-foreground">
                          #{index + 1}
                        </span>
                        <span className="font-medium">{vendor.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold">
                          ${vendor.spend.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {vendor.orders} orders
                        </p>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all"
                        style={{ width: `${(vendor.spend / maxSpend) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Top Customers by Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTopCustomers.map((customer, index) => {
                const maxRevenue = mockTopCustomers[0].revenue;
                return (
                  <div key={customer.name} className="space-y-2" data-testid={`top-customer-${index}`}>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-muted-foreground">
                          #{index + 1}
                        </span>
                        <span className="font-medium">{customer.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-green-600 dark:text-green-400">
                          ${customer.revenue.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {customer.orders} orders
                        </p>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${(customer.revenue / maxRevenue) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </PageBackground>
  );
}
