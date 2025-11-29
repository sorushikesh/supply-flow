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

// todo: remove mock functionality
interface GRNRecord {
  id: string;
  grnNumber: string;
  poNumber: string;
  vendor: string;
  receivedDate: string;
  orderedQty: number;
  receivedQty: number;
  status: StatusType;
}

const mockGRNs: GRNRecord[] = [
  { id: "1", grnNumber: "GRN-2024-0030", poNumber: "PO-2024-0044", vendor: "Global Supply Co", receivedDate: "2024-01-15", orderedQty: 100, receivedQty: 100, status: "completed" },
  { id: "2", grnNumber: "GRN-2024-0029", poNumber: "PO-2024-0043", vendor: "Quality Parts Inc", receivedDate: "2024-01-14", orderedQty: 250, receivedQty: 245, status: "partial" },
  { id: "3", grnNumber: "GRN-2024-0028", poNumber: "PO-2024-0042", vendor: "Tech Components", receivedDate: "2024-01-13", orderedQty: 50, receivedQty: 50, status: "completed" },
  { id: "4", grnNumber: "GRN-2024-0027", poNumber: "PO-2024-0040", vendor: "Acme Corporation", receivedDate: "2024-01-12", orderedQty: 200, receivedQty: 200, status: "completed" },
  { id: "5", grnNumber: "GRN-2024-0026", poNumber: "PO-2024-0039", vendor: "Prime Materials Ltd", receivedDate: "2024-01-11", orderedQty: 75, receivedQty: 70, status: "partial" },
];

const mockPendingPOs = [
  { poNumber: "PO-2024-0045", vendor: "Acme Corporation", items: "Widget Alpha x 50, Widget Beta x 30" },
  { poNumber: "PO-2024-0046", vendor: "Global Supply Co", items: "Gadget Pro x 25" },
];

export default function GRN() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState("");
  const [receivedQty, setReceivedQty] = useState("");
  const [notes, setNotes] = useState("");

  const filteredData = mockGRNs.filter((grn) => {
    const matchesSearch =
      grn.grnNumber.toLowerCase().includes(search.toLowerCase()) ||
      grn.poNumber.toLowerCase().includes(search.toLowerCase()) ||
      grn.vendor.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || grn.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const columns: Column<GRNRecord>[] = [
    { key: "grnNumber", header: "GRN Number", className: "font-mono text-sm font-medium" },
    { key: "poNumber", header: "PO Number", className: "font-mono text-sm" },
    { key: "vendor", header: "Vendor" },
    { key: "receivedDate", header: "Received Date" },
    {
      key: "orderedQty",
      header: "Ordered",
      className: "text-right font-mono",
    },
    {
      key: "receivedQty",
      header: "Received",
      className: "text-right font-mono",
      render: (grn) => (
        <span className={grn.receivedQty < grn.orderedQty ? "text-amber-600" : ""}>
          {grn.receivedQty}
        </span>
      ),
    },
    {
      key: "variance",
      header: "Variance",
      className: "text-right font-mono",
      render: (grn) => {
        const variance = grn.receivedQty - grn.orderedQty;
        return (
          <span className={variance < 0 ? "text-destructive" : "text-muted-foreground"}>
            {variance >= 0 ? "+" : ""}{variance}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (grn) => <StatusBadge status={grn.status} />,
    },
  ];

  const handleSubmit = () => {
    toast({
      title: "GRN Created",
      description: `Goods received for ${selectedPO}.`,
    });
    setModalOpen(false);
    setSelectedPO("");
    setReceivedQty("");
    setNotes("");
  };

  const completedGRNs = mockGRNs.filter((grn) => grn.status === "completed").length;
  const partialGRNs = mockGRNs.filter((grn) => grn.status === "partial").length;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Goods Received Notes"
        description="Record and track goods received from vendors"
        actionLabel="Record GRN"
        onAction={() => setModalOpen(true)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Total GRNs
            </p>
            <p className="text-2xl font-bold mt-1">{mockGRNs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Complete Receipts
            </p>
            <p className="text-2xl font-bold mt-1 text-green-600">
              {completedGRNs}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Partial Receipts
            </p>
            <p className="text-2xl font-bold mt-1 text-amber-600">
              {partialGRNs}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <SearchFilter
            searchPlaceholder="Search by GRN, PO number or vendor..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={[
              {
                key: "status",
                label: "Status",
                options: [
                  { value: "All", label: "All Status" },
                  { value: "Completed", label: "Complete" },
                  { value: "Partial", label: "Partial" },
                ],
                value: statusFilter,
                onChange: setStatusFilter,
              },
            ]}
          />

          <DataTable
            columns={columns}
            data={filteredData}
            testIdPrefix="grn"
          />
        </CardContent>
      </Card>

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Record Goods Received"
        description="Select a PO and record received quantities."
        onSubmit={handleSubmit}
        submitLabel="Record GRN"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Purchase Order *</Label>
            <Select value={selectedPO} onValueChange={setSelectedPO}>
              <SelectTrigger data-testid="select-po">
                <SelectValue placeholder="Select pending PO" />
              </SelectTrigger>
              <SelectContent>
                {mockPendingPOs.map((po) => (
                  <SelectItem key={po.poNumber} value={po.poNumber}>
                    <div className="flex flex-col">
                      <span className="font-mono">{po.poNumber}</span>
                      <span className="text-xs text-muted-foreground">{po.vendor}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPO && (
            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
              <p className="text-sm font-medium">PO Details</p>
              <p className="text-xs text-muted-foreground">
                {mockPendingPOs.find((p) => p.poNumber === selectedPO)?.items}
              </p>
              <Badge variant="secondary">Pending Receipt</Badge>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="receivedQty">Received Quantity *</Label>
            <Input
              id="receivedQty"
              type="number"
              value={receivedQty}
              onChange={(e) => setReceivedQty(e.target.value)}
              placeholder="Enter total quantity received"
              data-testid="input-received-qty"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Quality check, damages, etc.)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes about the received goods..."
              rows={3}
              data-testid="input-grn-notes"
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
