import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useState } from "react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  selectable?: boolean;
  onRowClick?: (item: T) => void;
  pageSize?: number;
  testIdPrefix?: string;
  isLoading?: boolean;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  selectable = false,
  onRowClick,
  pageSize = 10,
  testIdPrefix = "table",
  isLoading = false,
}: DataTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);

  const toggleAll = () => {
    if (selectedIds.size === data.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.map((d) => d.id)));
    }
  };

  const toggleOne = (id: string | number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const getValue = (item: T, key: string): unknown => {
    const keys = key.split(".");
    let value: unknown = item;
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    return value;
  };

  return (
    <div className="space-y-4" data-testid={`${testIdPrefix}-container`}>
      <div className="rounded-lg border border-card-border overflow-x-auto backdrop-blur-sm bg-card/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-primary/5 to-cyan-500/5 hover:from-primary/10 hover:to-cyan-500/10 transition-all duration-300">
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.size === data.length && data.length > 0}
                    onCheckedChange={toggleAll}
                    data-testid={`${testIdPrefix}-select-all`}
                    className="transition-all duration-200 hover:scale-110"
                  />
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  className={`text-sm font-semibold uppercase tracking-wider ${col.className || ""}`}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="h-24 text-center text-base text-muted-foreground"
                >
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((item, idx) => (
                <TableRow
                  key={item.id}
                  className={`${
                    onRowClick 
                      ? "hover:bg-primary/5 cursor-pointer transition-all duration-200 hover:shadow-md" 
                      : ""
                  } animate-fade-in-up border-b border-card-border/50 hover:border-primary/20`}
                  style={{ animationDelay: `${idx * 40}ms` }}
                  onClick={() => onRowClick?.(item)}
                  data-testid={`${testIdPrefix}-row-${idx}`}
                >
                  {selectable && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(item.id)}
                        onCheckedChange={() => toggleOne(item.id)}
                        data-testid={`${testIdPrefix}-select-${idx}`}
                        className="transition-all duration-200 hover:scale-110"
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell 
                      key={String(col.key)} 
                      className={`${col.className || ""} transition-all duration-200`}
                    >
                      {col.render
                        ? col.render(item)
                        : String(getValue(item, String(col.key)) ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
          <p className="text-base text-muted-foreground font-medium">
            Showing <span className="text-primary font-semibold">{startIndex + 1}</span> to{" "}
            <span className="text-primary font-semibold">{Math.min(endIndex, data.length)}</span> of{" "}
            <span className="text-primary font-semibold">{data.length}</span> entries
          </p>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              data-testid={`${testIdPrefix}-first-page`}
              className="transition-all duration-200 hover:scale-110 h-9 w-9"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              data-testid={`${testIdPrefix}-prev-page`}
              className="transition-all duration-200 hover:scale-110 h-9 w-9"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 sm:px-4 py-2 text-sm font-semibold bg-primary/10 rounded-md border border-primary/20 whitespace-nowrap">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="icon"
              variant="ghost"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              data-testid={`${testIdPrefix}-next-page`}
              className="transition-all duration-200 hover:scale-110 h-9 w-9"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              data-testid={`${testIdPrefix}-last-page`}
              className="transition-all duration-200 hover:scale-110 h-9 w-9"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
