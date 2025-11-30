import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Filter,
  X,
  Plus,
  Search,
  Calendar,
  Hash,
  Type,
  CheckSquare,
  Star,
} from "lucide-react";

export interface FilterCondition {
  id: string;
  field: string;
  operator: "equals" | "contains" | "greater" | "less" | "between" | "in";
  value: string | string[];
  fieldType?: "text" | "number" | "date" | "select";
}

export interface SavedFilter {
  id: string;
  name: string;
  conditions: FilterCondition[];
  isFavorite?: boolean;
}

interface AdvancedFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: { value: string; label: string; type?: string }[];
  onApplyFilters: (conditions: FilterCondition[]) => void;
  savedFilters?: SavedFilter[];
  onSaveFilter?: (name: string, conditions: FilterCondition[]) => void;
  onLoadFilter?: (filter: SavedFilter) => void;
}

export function AdvancedFilterDialog({
  open,
  onOpenChange,
  fields,
  onApplyFilters,
  savedFilters = [],
  onSaveFilter,
  onLoadFilter,
}: AdvancedFilterDialogProps) {
  const [conditions, setConditions] = useState<FilterCondition[]>([
    {
      id: "1",
      field: fields[0]?.value || "",
      operator: "equals",
      value: "",
      fieldType: fields[0]?.type as any || "text",
    },
  ]);
  const [filterName, setFilterName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const getOperatorsByType = (type: string) => {
    switch (type) {
      case "number":
        return [
          { value: "equals", label: "Equals" },
          { value: "greater", label: "Greater than" },
          { value: "less", label: "Less than" },
          { value: "between", label: "Between" },
        ];
      case "date":
        return [
          { value: "equals", label: "On" },
          { value: "greater", label: "After" },
          { value: "less", label: "Before" },
          { value: "between", label: "Between" },
        ];
      case "select":
        return [
          { value: "equals", label: "Is" },
          { value: "in", label: "In" },
        ];
      default:
        return [
          { value: "equals", label: "Equals" },
          { value: "contains", label: "Contains" },
        ];
    }
  };

  const getFieldIcon = (type?: string) => {
    switch (type) {
      case "number":
        return <Hash className="h-4 w-4" />;
      case "date":
        return <Calendar className="h-4 w-4" />;
      case "select":
        return <CheckSquare className="h-4 w-4" />;
      default:
        return <Type className="h-4 w-4" />;
    }
  };

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        id: String(Date.now()),
        field: fields[0]?.value || "",
        operator: "equals",
        value: "",
        fieldType: fields[0]?.type as any || "text",
      },
    ]);
  };

  const removeCondition = (id: string) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter((c) => c.id !== id));
    }
  };

  const updateCondition = (
    id: string,
    updates: Partial<FilterCondition>
  ) => {
    setConditions(
      conditions.map((c) => {
        if (c.id === id) {
          // If field changed, reset operator and update fieldType
          if (updates.field) {
            const field = fields.find((f) => f.value === updates.field);
            return {
              ...c,
              ...updates,
              fieldType: field?.type as any || "text",
              operator: "equals",
            };
          }
          return { ...c, ...updates };
        }
        return c;
      })
    );
  };

  const handleApply = () => {
    const validConditions = conditions.filter((c) => c.value);
    onApplyFilters(validConditions);
    onOpenChange(false);
  };

  const handleSaveFilter = () => {
    if (filterName && onSaveFilter) {
      onSaveFilter(filterName, conditions);
      setFilterName("");
      setShowSaveDialog(false);
    }
  };

  const handleLoadFilter = (filter: SavedFilter) => {
    setConditions(filter.conditions);
    if (onLoadFilter) {
      onLoadFilter(filter);
    }
  };

  const clearAll = () => {
    setConditions([
      {
        id: "1",
        field: fields[0]?.value || "",
        operator: "equals",
        value: "",
        fieldType: fields[0]?.type as any || "text",
      },
    ]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Advanced Filters
          </DialogTitle>
          <DialogDescription>
            Create complex filter combinations to find exactly what you need
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-6">
              {/* Saved Filters */}
              {savedFilters.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Saved Filters
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {savedFilters.map((filter) => (
                      <Badge
                        key={filter.id}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10 transition-colors"
                        onClick={() => handleLoadFilter(filter)}
                      >
                        {filter.isFavorite && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />}
                        {filter.name}
                        <span className="ml-1 text-muted-foreground">
                          ({filter.conditions.length})
                        </span>
                      </Badge>
                    ))}
                  </div>
                  <Separator className="mt-4" />
                </div>
              )}

              {/* Filter Conditions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Filter Conditions</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addCondition}
                    className="h-8"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Condition
                  </Button>
                </div>

                {conditions.map((condition, index) => (
                  <div
                    key={condition.id}
                    className="flex gap-2 p-4 border rounded-lg bg-muted/30"
                  >
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      {/* Field Selection */}
                      <div>
                        <Label className="text-xs mb-1.5 flex items-center gap-1">
                          {getFieldIcon(condition.fieldType)}
                          Field
                        </Label>
                        <Select
                          value={condition.field}
                          onValueChange={(value) =>
                            updateCondition(condition.id, { field: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fields.map((field) => (
                              <SelectItem key={field.value} value={field.value}>
                                {field.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Operator Selection */}
                      <div>
                        <Label className="text-xs mb-1.5">Operator</Label>
                        <Select
                          value={condition.operator}
                          onValueChange={(value: any) =>
                            updateCondition(condition.id, { operator: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getOperatorsByType(condition.fieldType || "text").map(
                              (op) => (
                                <SelectItem key={op.value} value={op.value}>
                                  {op.label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Value Input */}
                      <div>
                        <Label className="text-xs mb-1.5">Value</Label>
                        <Input
                          type={condition.fieldType === "number" ? "number" : condition.fieldType === "date" ? "date" : "text"}
                          value={condition.value as string}
                          onChange={(e) =>
                            updateCondition(condition.id, { value: e.target.value })
                          }
                          placeholder="Enter value..."
                        />
                      </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCondition(condition.id)}
                      disabled={conditions.length === 1}
                      className="mt-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Save Filter Section */}
              {onSaveFilter && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Save This Filter</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Filter name..."
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                      />
                      <Button
                        onClick={handleSaveFilter}
                        disabled={!filterName}
                        variant="secondary"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">
              {conditions.filter((c) => c.value).length} active
            </Badge>
            {conditions.filter((c) => c.value).length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear All
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply}>
              <Search className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to apply filters to data
export function applyAdvancedFilters<T extends Record<string, any>>(
  data: T[],
  conditions: FilterCondition[]
): T[] {
  return data.filter((item) => {
    return conditions.every((condition) => {
      const value = item[condition.field];
      const filterValue = condition.value;

      if (!filterValue) return true;

      switch (condition.operator) {
        case "equals":
          return String(value).toLowerCase() === String(filterValue).toLowerCase();
        case "contains":
          return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
        case "greater":
          return Number(value) > Number(filterValue);
        case "less":
          return Number(value) < Number(filterValue);
        case "between":
          // Expects filterValue to be "min,max"
          const [min, max] = String(filterValue).split(",").map(Number);
          return Number(value) >= min && Number(value) <= max;
        case "in":
          // Expects filterValue to be comma-separated
          const values = String(filterValue).split(",").map((v) => v.trim().toLowerCase());
          return values.includes(String(value).toLowerCase());
        default:
          return true;
      }
    });
  });
}
