import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  FileSpreadsheet, 
  FileText, 
  Download, 
  Calendar,
  Filter
} from "lucide-react";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  data: any[];
  filename?: string;
  columns?: { key: string; label: string; enabled?: boolean }[];
}

export function ExportDialog({
  open,
  onOpenChange,
  title = "Export Data",
  data,
  filename = "export",
  columns = [],
}: ExportDialogProps) {
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    columns.filter(c => c.enabled !== false).map(c => c.key)
  );
  const [includeHeaders, setIncludeHeaders] = useState(true);

  const handleExport = () => {
    if (format === "csv") {
      exportToCSV();
    } else {
      exportToJSON();
    }
    onOpenChange(false);
  };

  const exportToCSV = () => {
    const headers = columns
      .filter(c => selectedColumns.includes(c.key))
      .map(c => c.label);
    
    const rows = data.map(item =>
      selectedColumns.map(key => {
        const value = item[key];
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value).replace(/"/g, '""');
      })
    );

    let csv = '';
    if (includeHeaders) {
      csv = headers.map(h => `"${h}"`).join(',') + '\n';
    }
    csv += rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToJSON = () => {
    const filteredData = data.map(item => {
      const filtered: any = {};
      selectedColumns.forEach(key => {
        filtered[key] = item[key];
      });
      return filtered;
    });

    const json = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const toggleColumn = (key: string) => {
    setSelectedColumns(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Choose export format and customize the data to include
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Export Format</Label>
            <RadioGroup value={format} onValueChange={(v: any) => setFormat(v)}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex-1 cursor-pointer flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium">CSV (Comma Separated)</p>
                    <p className="text-xs text-muted-foreground">Compatible with Excel and spreadsheets</p>
                  </div>
                  <Badge variant="secondary">Recommended</Badge>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="flex-1 cursor-pointer flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium">JSON</p>
                    <p className="text-xs text-muted-foreground">Structured data format for developers</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Column Selection */}
          {columns.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Select Columns</Label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    setSelectedColumns(
                      selectedColumns.length === columns.length
                        ? []
                        : columns.map(c => c.key)
                    )
                  }
                >
                  {selectedColumns.length === columns.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                {columns.map(col => (
                  <div key={col.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={col.key}
                      checked={selectedColumns.includes(col.key)}
                      onCheckedChange={() => toggleColumn(col.key)}
                    />
                    <Label
                      htmlFor={col.key}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {col.label}
                    </Label>
                  </div>
                ))}
              </div>
              <Badge variant="outline" className="gap-1">
                <Filter className="h-3 w-3" />
                {selectedColumns.length} of {columns.length} columns selected
              </Badge>
            </div>
          )}

          {/* Options */}
          {format === 'csv' && (
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <Checkbox
                id="headers"
                checked={includeHeaders}
                onCheckedChange={(checked) => setIncludeHeaders(checked as boolean)}
              />
              <Label htmlFor="headers" className="text-sm cursor-pointer flex-1">
                Include column headers in first row
              </Label>
            </div>
          )}

          {/* Info */}
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Exporting {data.length} record{data.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={selectedColumns.length === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
