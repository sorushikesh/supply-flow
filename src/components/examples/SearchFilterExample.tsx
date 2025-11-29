import { useState } from "react";
import { SearchFilter } from "../SearchFilter";

export default function SearchFilterExample() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");

  return (
    <div className="p-4">
      <SearchFilter
        searchPlaceholder="Search orders..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { value: "All", label: "All Status" },
              { value: "Pending", label: "Pending" },
              { value: "Completed", label: "Completed" },
            ],
            value: status,
            onChange: setStatus,
          },
          {
            key: "category",
            label: "Category",
            options: [
              { value: "All", label: "All Categories" },
              { value: "Electronics", label: "Electronics" },
              { value: "Widgets", label: "Widgets" },
            ],
            value: category,
            onChange: setCategory,
          },
        ]}
        onExport={() => console.log("Export clicked")}
      />
      <p className="mt-4 text-sm text-muted-foreground">
        Search: "{search}" | Status: {status} | Category: {category}
      </p>
    </div>
  );
}
