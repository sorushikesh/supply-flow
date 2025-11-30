import { useState } from "react";
import { PageBackground } from "@/components/PageBackground";
import { SearchFilter } from "@/components/SearchFilter";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge, type StatusType } from "@/components/StatusBadge";
import { FormModal } from "@/components/FormModal";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, MapPin, Package, CheckCircle2 } from "lucide-react";

interface DispatchRecord {
  id: string;
  dispatchNumber: string;
  soNumber: string;
  customer: string;
  dispatchDate: string;
  carrier: string;
  trackingNumber: string;
  status: StatusType;
}

const mockDispatches: DispatchRecord[] = [
  { id: "1", dispatchNumber: "DSP-2024-0050", soNumber: "SO-2024-0122", customer: "Metro Retail Group", dispatchDate: "2024-01-15", carrier: "FedEx", trackingNumber: "FX123456789", status: "in_transit" },
  { id: "2", dispatchNumber: "DSP-2024-0049", soNumber: "SO-2024-0121", customer: "City Stores Ltd", dispatchDate: "2024-01-14", carrier: "UPS", trackingNumber: "UP987654321", status: "delivered" },
  { id: "3", dispatchNumber: "DSP-2024-0048", soNumber: "SO-2024-0120", customer: "Express Outlets", dispatchDate: "2024-01-13", carrier: "DHL", trackingNumber: "DH456789123", status: "delivered" },
  { id: "4", dispatchNumber: "DSP-2024-0047", soNumber: "SO-2024-0119", customer: "Wholesale Partners", dispatchDate: "2024-01-12", carrier: "FedEx", trackingNumber: "FX789123456", status: "delivered" },
  { id: "5", dispatchNumber: "DSP-2024-0046", soNumber: "SO-2024-0118", customer: "TechStart Inc", dispatchDate: "2024-01-11", carrier: "UPS", trackingNumber: "UP654321987", status: "delivered" },
  { id: "6", dispatchNumber: "DSP-2024-0045", soNumber: "SO-2024-0117", customer: "Prime Electronics", dispatchDate: "2024-01-10", carrier: "DHL", trackingNumber: "DH321654987", status: "pending" },
  { id: "7", dispatchNumber: "DSP-2024-0044", soNumber: "SO-2024-0116", customer: "Global Trade Corp", dispatchDate: "2024-01-09", carrier: "FedEx", trackingNumber: "FX987456123", status: "in_transit" },
  { id: "8", dispatchNumber: "DSP-2024-0043", soNumber: "SO-2024-0115", customer: "Downtown Supermarket", dispatchDate: "2024-01-08", carrier: "Local Delivery", trackingNumber: "LD123789456", status: "delivered" },
  { id: "9", dispatchNumber: "DSP-2024-0042", soNumber: "SO-2024-0114", customer: "Coastal Distributors", dispatchDate: "2024-01-07", carrier: "UPS", trackingNumber: "UP456123789", status: "delivered" },
  { id: "10", dispatchNumber: "DSP-2024-0041", soNumber: "SO-2024-0113", customer: "Mountain Retail Chain", dispatchDate: "2024-01-06", carrier: "FedEx", trackingNumber: "FX654987321", status: "delivered" },
  { id: "11", dispatchNumber: "DSP-2024-0040", soNumber: "SO-2024-0112", customer: "Urban Solutions LLC", dispatchDate: "2024-01-05", carrier: "DHL", trackingNumber: "DH789321654", status: "pending" },
  { id: "12", dispatchNumber: "DSP-2024-0039", soNumber: "SO-2024-0111", customer: "Northern Supplies", dispatchDate: "2024-01-04", carrier: "UPS", trackingNumber: "UP321789654", status: "in_transit" },
  { id: "13", dispatchNumber: "DSP-2024-0038", soNumber: "SO-2024-0110", customer: "Eastern Markets", dispatchDate: "2024-01-03", carrier: "FedEx", trackingNumber: "FX147258369", status: "in_transit" },
  { id: "14", dispatchNumber: "DSP-2024-0037", soNumber: "SO-2024-0109", customer: "Central Warehouse Hub", dispatchDate: "2024-01-02", carrier: "DHL", trackingNumber: "DH963852741", status: "delivered" },
  { id: "15", dispatchNumber: "DSP-2024-0036", soNumber: "SO-2024-0108", customer: "Pacific Retailers", dispatchDate: "2024-01-01", carrier: "UPS", trackingNumber: "UP741963852", status: "delivered" },
  { id: "16", dispatchNumber: "DSP-2024-0035", soNumber: "SO-2024-0107", customer: "TechStart Inc", dispatchDate: "2023-12-31", carrier: "Local Delivery", trackingNumber: "LD852741963", status: "delivered" },
  { id: "17", dispatchNumber: "DSP-2024-0034", soNumber: "SO-2024-0106", customer: "Metro Retail Group", dispatchDate: "2023-12-30", carrier: "FedEx", trackingNumber: "FX258963147", status: "pending" },
  { id: "18", dispatchNumber: "DSP-2024-0033", soNumber: "SO-2024-0105", customer: "Express Outlets", dispatchDate: "2023-12-29", carrier: "UPS", trackingNumber: "UP369147258", status: "delivered" },
];

const mockPendingSOs = [
  { soNumber: "SO-2024-0123", customer: "TechStart Inc", address: "100 Innovation Blvd, Tech City", items: 3 },
  { soNumber: "SO-2024-0124", customer: "Metro Retail Group", address: "200 Shopping Center, Mall Town", items: 5 },
];

const carriers = ["FedEx", "UPS", "DHL", "USPS", "Local Delivery"];

export default function Dispatch() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSO, setSelectedSO] = useState("");
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");

  const filteredData = mockDispatches.filter((dispatch) => {
    const matchesSearch =
      dispatch.dispatchNumber.toLowerCase().includes(search.toLowerCase()) ||
      dispatch.soNumber.toLowerCase().includes(search.toLowerCase()) ||
      dispatch.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || dispatch.status === statusFilter.toLowerCase().replace(" ", "_");
    return matchesSearch && matchesStatus;
  });

  const columns: Column<DispatchRecord>[] = [
    { key: "dispatchNumber", header: "Dispatch #", className: "font-mono text-sm font-medium" },
    { key: "soNumber", header: "SO Number", className: "font-mono text-sm" },
    { key: "customer", header: "Customer" },
    { key: "dispatchDate", header: "Dispatch Date" },
    {
      key: "carrier",
      header: "Carrier",
      render: (dispatch) => (
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-muted-foreground" />
          {dispatch.carrier}
        </div>
      ),
    },
    {
      key: "trackingNumber",
      header: "Tracking",
      className: "font-mono text-sm",
      render: (dispatch) => (
        <span className="text-primary hover:underline cursor-pointer">
          {dispatch.trackingNumber}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (dispatch) => <StatusBadge status={dispatch.status} />,
    },
  ];

  const handleSubmit = () => {
    toast({
      title: "Dispatch Created",
      description: `Shipment created for ${selectedSO}.`,
    });
    setModalOpen(false);
    setSelectedSO("");
    setCarrier("");
    setTrackingNumber("");
    setNotes("");
  };

  const inTransit = mockDispatches.filter((d) => d.status === "in_transit").length;
  const delivered = mockDispatches.filter((d) => d.status === "delivered").length;

  return (
    <PageBackground>
      <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Dispatch Management
            </h1>
            <p className="text-muted-foreground mt-1">Track outgoing shipments</p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="gap-2">
            <Package className="h-4 w-4" />
            Create Dispatch
          </Button>
        </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Total Dispatches</p>
            <p className="text-2xl font-bold mt-1">{mockDispatches.length}</p>
          </CardContent>
        </Card>
        <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Truck className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">In Transit</p>
            <p className="text-2xl font-bold mt-1 text-amber-600">{inTransit}</p>
          </CardContent>
        </Card>
        <Card className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Delivered</p>
            <p className="text-2xl font-bold mt-1 text-green-600">{delivered}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <SearchFilter
            searchPlaceholder="Search by dispatch, SO number or customer..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={[
              {
                key: "status",
                label: "Status",
                options: [
                  { value: "All", label: "All Status" },
                  { value: "In Transit", label: "In Transit" },
                  { value: "Delivered", label: "Delivered" },
                ],
                value: statusFilter,
                onChange: setStatusFilter,
              },
            ]}
          />

          <DataTable
            columns={columns}
            data={filteredData}
            testIdPrefix="dispatch"
          />
        </CardContent>
      </Card>

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Create Dispatch"
        description="Select a sales order and enter shipping details."
        onSubmit={handleSubmit}
        submitLabel="Create Dispatch"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Sales Order *</Label>
            <Select value={selectedSO} onValueChange={setSelectedSO}>
              <SelectTrigger data-testid="select-so">
                <SelectValue placeholder="Select pending SO" />
              </SelectTrigger>
              <SelectContent>
                {mockPendingSOs.map((so) => (
                  <SelectItem key={so.soNumber} value={so.soNumber}>
                    <div className="flex flex-col">
                      <span className="font-mono">{so.soNumber}</span>
                      <span className="text-xs text-muted-foreground">{so.customer}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSO && (
            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
              <p className="text-sm font-medium">Delivery Address</p>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  {mockPendingSOs.find((s) => s.soNumber === selectedSO)?.address}
                </p>
              </div>
              <Badge variant="secondary">
                {mockPendingSOs.find((s) => s.soNumber === selectedSO)?.items} items
              </Badge>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Carrier *</Label>
              <Select value={carrier} onValueChange={setCarrier}>
                <SelectTrigger data-testid="select-carrier">
                  <SelectValue placeholder="Select carrier" />
                </SelectTrigger>
                <SelectContent>
                  {carriers.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tracking">Tracking Number</Label>
              <Input
                id="tracking"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g., FX123456789"
                data-testid="input-tracking"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Shipping Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special delivery instructions..."
              rows={2}
              data-testid="input-dispatch-notes"
            />
          </div>
        </div>
      </FormModal>
      </div>
    </PageBackground>
  );
}
