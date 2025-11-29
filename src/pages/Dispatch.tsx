import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
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
import { Truck, MapPin } from "lucide-react";

// todo: remove mock functionality
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
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Dispatch / Delivery"
        description="Manage shipments to customers"
        actionLabel="Create Dispatch"
        onAction={() => setModalOpen(true)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Total Dispatches
            </p>
            <p className="text-2xl font-bold mt-1">{mockDispatches.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              In Transit
            </p>
            <p className="text-2xl font-bold mt-1 text-amber-600">
              {inTransit}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Delivered
            </p>
            <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
              {delivered}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
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
  );
}
