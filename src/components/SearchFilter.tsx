import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Download } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFilterProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: {
    key: string;
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
  }[];
  onExport?: () => void;
}

export function SearchFilter({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filters = [],
  onExport,
}: SearchFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <div className="relative flex-1 min-w-[200px] max-w-sm group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input
          type="search"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 transition-all duration-200 focus:shadow-md"
          data-testid="input-search"
          autoComplete="off"
        />
      </div>

      {filters.map((filter) => (
        <Select key={filter.key} value={filter.value} onValueChange={filter.onChange}>
          <SelectTrigger className="w-[150px]" data-testid={`filter-${filter.key}`}>
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {onExport && (
        <Button variant="outline" onClick={onExport} data-testid="button-export" className="group transition-all duration-200 hover:scale-105 active:scale-95">
          <Download className="h-4 w-4 mr-2 transition-transform group-hover:translate-y-0.5" />
          Export
        </Button>
      )}
    </div>
  );
}
