import { useState } from "react";
import { PageBackground } from "@/components/PageBackground";
import { SearchFilter } from "@/components/SearchFilter";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge, type StatusType } from "@/components/StatusBadge";
import { FormModal } from "@/components/FormModal";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDownLeft, ArrowUpRight, CreditCard, DollarSign } from "lucide-react";

interface Payment {
  id: string;
  paymentNumber: string;
  type: "received" | "made";
  invoiceNumber: string;
  party: string;
  paymentDate: string;
  amount: number;
  method: string;
  reference: string;
}

const mockPayments: Payment[] = [
  { id: "1", paymentNumber: "PAY-2024-0080", type: "received", invoiceNumber: "INV-2024-0099", party: "Metro Retail Group", paymentDate: "2024-01-15", amount: 15600, method: "Bank Transfer", reference: "TRF-456789" },
  { id: "2", paymentNumber: "PAY-2024-0079", type: "made", invoiceNumber: "INV-2024-0098", party: "Acme Corporation", paymentDate: "2024-01-14", amount: 12500, method: "Check", reference: "CHK-001234" },
  { id: "3", paymentNumber: "PAY-2024-0078", type: "received", invoiceNumber: "INV-2024-0095", party: "Express Outlets", paymentDate: "2024-01-13", amount: 23400, method: "Credit Card", reference: "CC-789456" },
  { id: "4", paymentNumber: "PAY-2024-0077", type: "made", invoiceNumber: "INV-2024-0096", party: "Global Supply Co", paymentDate: "2024-01-12", amount: 4000, method: "Bank Transfer", reference: "TRF-123456" },
  { id: "5", paymentNumber: "PAY-2024-0076", type: "received", invoiceNumber: "INV-2024-0094", party: "TechStart Inc", paymentDate: "2024-01-11", amount: 8750, method: "Bank Transfer", reference: "TRF-987654" },
  { id: "6", paymentNumber: "PAY-2024-0075", type: "made", invoiceNumber: "INV-2024-0093", party: "Quality Parts Inc", paymentDate: "2024-01-10", amount: 6700, method: "Check", reference: "CHK-001233" },
  { id: "7", paymentNumber: "PAY-2024-0074", type: "received", invoiceNumber: "INV-2024-0093", party: "Wholesale Partners", paymentDate: "2024-01-09", amount: 34500, method: "Wire Transfer", reference: "WIR-445566" },
  { id: "8", paymentNumber: "PAY-2024-0073", type: "made", invoiceNumber: "INV-2024-0092", party: "Tech Components", paymentDate: "2024-01-08", amount: 8000, method: "Bank Transfer", reference: "TRF-556677" },
  { id: "9", paymentNumber: "PAY-2024-0072", type: "received", invoiceNumber: "INV-2024-0090", party: "Global Trade Corp", paymentDate: "2024-01-07", amount: 28900, method: "Bank Transfer", reference: "TRF-667788" },
  { id: "10", paymentNumber: "PAY-2024-0071", type: "received", invoiceNumber: "INV-2024-0087", party: "Downtown Supermarket", paymentDate: "2024-01-06", amount: 6700, method: "Credit Card", reference: "CC-778899" },
  { id: "11", paymentNumber: "PAY-2024-0070", type: "made", invoiceNumber: "INV-2024-0086", party: "Mega Manufacturing", paymentDate: "2024-01-05", amount: 15000, method: "Check", reference: "CHK-001232" },
  { id: "12", paymentNumber: "PAY-2024-0069", type: "received", invoiceNumber: "INV-2024-0085", party: "Coastal Distributors", paymentDate: "2024-01-04", amount: 14500, method: "Bank Transfer", reference: "TRF-889900" },
  { id: "13", paymentNumber: "PAY-2024-0068", type: "made", invoiceNumber: "INV-2024-0083", party: "Alpha Distributors", paymentDate: "2024-01-03", amount: 11200, method: "Wire Transfer", reference: "WIR-990011" },
  { id: "14", paymentNumber: "PAY-2024-0067", type: "received", invoiceNumber: "INV-2024-0082", party: "Northern Supplies", paymentDate: "2024-01-02", amount: 17300, method: "Bank Transfer", reference: "TRF-001122" },
  { id: "15", paymentNumber: "PAY-2024-0066", type: "made", invoiceNumber: "INV-2024-0081", party: "Beta Supplies Ltd", paymentDate: "2024-01-01", amount: 9600, method: "Check", reference: "CHK-001231" },
  { id: "16", paymentNumber: "PAY-2024-0065", type: "received", invoiceNumber: "INV-2024-0080", party: "Pacific Retailers", paymentDate: "2023-12-31", amount: 26500, method: "Credit Card", reference: "CC-112233" },
  { id: "17", paymentNumber: "PAY-2024-0064", type: "made", invoiceNumber: "INV-2024-0079", party: "Epsilon Materials", paymentDate: "2023-12-30", amount: 31800, method: "Bank Transfer", reference: "TRF-223344" },
  { id: "18", paymentNumber: "PAY-2024-0063", type: "received", invoiceNumber: "INV-2024-0078", party: "Urban Solutions LLC", paymentDate: "2023-12-29", amount: 9600, method: "Cash", reference: "CSH-334455" },
];

const mockPendingInvoices = [
  { invoiceNumber: "INV-2024-0100", party: "TechStart Inc", balance: 8750, type: "receivable" },
  { invoiceNumber: "INV-2024-0097", party: "City Stores Ltd", balance: 4800, type: "receivable" },
  { invoiceNumber: "INV-2024-0096", party: "Global Supply Co", balance: 4750, type: "payable" },
];

const paymentMethods = ["Bank Transfer", "Check", "Credit Card", "Cash", "Wire Transfer"];

export default function Payments() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [reference, setReference] = useState("");

  const filteredData = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.paymentNumber.toLowerCase().includes(search.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      payment.party.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || payment.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const columns: Column<Payment>[] = [
    { 
      key: "paymentNumber", 
      header: "Payment #", 
      className: "font-mono text-sm font-medium",
      render: (payment) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help">{payment.paymentNumber}</span>
          </TooltipTrigger>
          <TooltipContent side="top">
            <div className="space-y-1">
              <p className="text-xs font-semibold">{payment.paymentNumber}</p>
              <p className="text-xs text-muted-foreground">Invoice: {payment.invoiceNumber}</p>
              <p className="text-xs text-muted-foreground">Date: {payment.paymentDate}</p>
              <p className="text-xs text-muted-foreground">Method: {payment.method}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (payment) => (
        <div className="flex items-center gap-2">
          {payment.type === "received" ? (
            <>
              <ArrowDownLeft className="h-4 w-4 text-green-600" />
              <span className="text-green-600 text-sm font-medium">Received</span>
            </>
          ) : (
            <>
              <ArrowUpRight className="h-4 w-4 text-orange-600" />
              <span className="text-orange-600 text-sm font-medium">Made</span>
            </>
          )}
        </div>
      ),
    },
    { key: "invoiceNumber", header: "Invoice", className: "font-mono text-sm" },
    { key: "party", header: "Party" },
    { key: "paymentDate", header: "Date" },
    {
      key: "amount",
      header: "Amount",
      className: "text-right font-mono font-medium",
      render: (payment) => (
        <span className={payment.type === "received" ? "text-green-600" : ""}>
          ${payment.amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: "method",
      header: "Method",
      render: (payment) => <Badge variant="secondary">{payment.method}</Badge>,
    },
    { key: "reference", header: "Reference", className: "font-mono text-sm text-muted-foreground" },
  ];

  const handleSubmit = () => {
    const invoice = mockPendingInvoices.find((i) => i.invoiceNumber === selectedInvoice);
    toast({
      title: "Payment Recorded",
      description: `Payment of $${amount} for ${selectedInvoice} has been recorded.`,
    });
    setModalOpen(false);
    setSelectedInvoice("");
    setAmount("");
    setMethod("");
    setReference("");
  };

  const totalReceived = mockPayments
    .filter((p) => p.type === "received")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalMade = mockPayments
    .filter((p) => p.type === "made")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <PageBackground>
      <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Payments
            </h1>
            <p className="text-muted-foreground mt-1">Track payment receipts and disbursements</p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="gap-2">
            <CreditCard className="h-4 w-4" />
            Record Payment
          </Button>
        </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Total Transactions</p>
            <p className="text-2xl font-bold mt-1">{mockPayments.length}</p>
          </CardContent>
        </Card>
        <Card className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Total Received</p>
            <p className="text-2xl font-bold mt-1 font-mono text-green-600">${totalReceived.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-4 w-4 text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Total Paid Out</p>
            <p className="text-2xl font-bold mt-1 font-mono text-orange-600">${totalMade.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <Tabs value={typeFilter} onValueChange={setTypeFilter} className="mb-4">
            <TabsList>
              <TabsTrigger value="all" data-testid="tab-all-payments">All Payments</TabsTrigger>
              <TabsTrigger value="received" data-testid="tab-received">Received</TabsTrigger>
              <TabsTrigger value="made" data-testid="tab-made">Made</TabsTrigger>
            </TabsList>
          </Tabs>

          <SearchFilter
            searchPlaceholder="Search by payment, invoice or party..."
            searchValue={search}
            onSearchChange={setSearch}
          />

          <DataTable
            columns={columns}
            data={filteredData}
            testIdPrefix="payments"
          />
        </CardContent>
      </Card>

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Record Payment"
        description="Record a payment for an invoice."
        onSubmit={handleSubmit}
        submitLabel="Record Payment"
      >
        {/* Invoice Selection Section */}
        <div className="space-y-4">
          <div className="pb-2 border-b">
            <h3 className="text-sm font-semibold text-foreground">Invoice Selection</h3>
            <p className="text-xs text-muted-foreground mt-1">Choose invoice to record payment for</p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              Select Invoice <span className="text-destructive">*</span>
            </Label>
            <Select value={selectedInvoice} onValueChange={setSelectedInvoice}>
              <SelectTrigger data-testid="select-invoice">
                <SelectValue placeholder="Select pending invoice" />
              </SelectTrigger>
              <SelectContent>
                {mockPendingInvoices.map((inv) => (
                  <SelectItem key={inv.invoiceNumber} value={inv.invoiceNumber}>
                    <div className="flex justify-between gap-4 w-full">
                      <span className="font-mono">{inv.invoiceNumber}</span>
                      <span className="text-muted-foreground">
                        Balance: ${inv.balance.toLocaleString()}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Select from pending invoices</p>
          </div>

          {selectedInvoice && (
            <div className="p-3 rounded-lg bg-muted/50 flex justify-between items-center animate-fade-in">
              <div>
                <p className="font-medium">
                  {mockPendingInvoices.find((i) => i.invoiceNumber === selectedInvoice)?.party}
                </p>
                <Badge variant="secondary" className="mt-1">
                  {mockPendingInvoices.find((i) => i.invoiceNumber === selectedInvoice)?.type === "receivable"
                    ? "Payment to Receive"
                    : "Payment to Make"}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-lg font-bold font-mono">
                  ${mockPendingInvoices.find((i) => i.invoiceNumber === selectedInvoice)?.balance.toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Payment Details Section */}
        <div className="space-y-4 pt-4">
          <div className="pb-2 border-b">
            <h3 className="text-sm font-semibold text-foreground">Payment Details</h3>
            <p className="text-xs text-muted-foreground mt-1">Amount and payment information</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium flex items-center gap-1">
                Amount <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                data-testid="input-payment-amount"
                className="pl-7 transition-all duration-200"
              />
            </div>
            <p className="text-xs text-muted-foreground">Payment amount received</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1">
                Payment Method <span className="text-destructive">*</span>
              </Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger data-testid="select-method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">How payment was received</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference" className="text-sm font-medium">
              Reference Number
            </Label>
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g., TRF-123456, CHK-001234"
              data-testid="input-reference"
              className="transition-all duration-200"
            />
            <p className="text-xs text-muted-foreground">Transaction or check number</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Payment Date
            </Label>
            <Input 
              type="date" 
              defaultValue={new Date().toISOString().split("T")[0]} 
              data-testid="input-payment-date"
              className="transition-all duration-200"
            />
            <p className="text-xs text-muted-foreground">Date payment was received</p>
          </div>
        </div>
      </FormModal>
      </div>
    </PageBackground>
  );
}
