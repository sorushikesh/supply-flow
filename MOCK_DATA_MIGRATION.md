# Centralized Mock Data Migration Guide

This guide shows how all pages have been updated to use centralized mock data from `src/data/mockData.ts` and `src/data/dataTransformers.ts`.

## Completed Updates

### ✅ 1. Inventory Page (`src/pages/Inventory.tsx`)
**Status:** COMPLETE
- Now imports: `getInventoryData()`, `getStockMovements()` from `@/data/dataTransformers`
- Removed local mock data arrays
- All inventory items and stock movements now come from centralized source

### ✅ 2. Vendors Page (`src/pages/Vendors.tsx`)
**Status:** COMPLETE
- Now imports: `getVendorsData()`, `getVendorPurchaseHistory()` from `@/data/dataTransformers`
- Removed local vendor and purchase order mock data
- Vendor information matches centralized vendor list

### ✅ 3. Purchase Orders Page (`src/pages/PurchaseOrders.tsx`)
**Status:** COMPLETE
- Now imports: `getPurchaseOrdersData()`, `getVendorNames()`, `getProductNames()` from `@/data/dataTransformers`
- Purchase orders linked to actual vendors and products

### ✅ 4. Sales Orders Page (`src/pages/SalesOrders.tsx`)
**Status:** COMPLETE
- Now imports: `getSalesOrdersData()`, `getCustomerNames()`, `getProductNames()` from `@/data/dataTransformers`
- Sales orders linked to actual customers and products

## Remaining Pages to Update

### ⏳ 5. Customers Page (`src/pages/Customers.tsx`)
**Required Changes:**
The Customer interface in Customers.tsx has slightly different fields than the centralized data.
Current fields in page: `code`, `totalOrders`, `totalRevenue`
Centralized data fields: `totalPurchases` (no code or totalRevenue)

**Solution:** Update dataTransformers.ts Customer interface to match page requirements or update page to match centralized data structure.

### ⏳ 6. GRN Page (`src/pages/GRN.tsx`)  
**Required Changes:**
```typescript
// Add at top of file
import { getGRNData, getPendingPOs, type GRNRecord } from "@/data/dataTransformers";

const mockGRNs = getGRNData();
const mockPendingPOs = getPendingPOs();
```

### ⏳ 7. Dispatch Page (`src/pages/Dispatch.tsx`)
**Required Changes:**
```typescript
// Add at top of file
import { getDispatchData, getPendingSOs, type DispatchRecord } from "@/data/dataTransformers";

const mockDispatches = getDispatchData();
const mockPendingSOs = getPendingSOs();
```

### ⏳ 8. Financial Management Page (`src/pages/FinancialManagement.tsx`)
**Required Changes:**
This page already has custom invoice data with approval workflows and payments. 
The dataTransformers.ts file has `getInvoicesData()` which generates this data from centralized sources.

```typescript
// Replace mock invoice array with:
import { getInvoicesData, type Invoice } from "@/data/dataTransformers";

const mockInvoices = getInvoicesData();
```

### ⏳ 9. Dashboard Page (`src/pages/Dashboard.tsx`)
**Required Changes:**
Dashboard shows aggregate data from multiple sources. Create dashboard-specific transformer functions:

```typescript
// In dataTransformers.ts, add:
export const getDashboardData = () => {
  return {
    recentOrders: salesOrders.slice(0, 5).map(so => ({...})),
    lowStockItems: products.filter(p => p.stockQuantity <= p.reorderLevel),
    overdueInvoices: invoices.filter(inv => inv.status === 'overdue')
  };
};
```

## Benefits of Centralized Data

1. **Data Consistency:** All pages use the same products, customers, vendors
2. **Referential Integrity:** Purchase orders reference real vendors and products
3. **Single Source of Truth:** Update data in one place, reflects everywhere
4. **Realistic Relationships:** Invoice line items match actual product catalog
5. **Easy Maintenance:** Add new products/customers once, available everywhere

## Data Flow

```
mockData.ts (Base Data)
    ↓
dataTransformers.ts (Page-Specific Formats)
    ↓
Page Components (Ready-to-Use Data)
```

## Next Steps

1. Complete remaining page updates (Customers, GRN, Dispatch, Financial, Dashboard)
2. Test all pages to ensure data displays correctly
3. Verify relationships between pages (e.g., clicking a PO shows correct vendor)
4. Add more sample data if needed (currently 20 products, 11 vendors, 10 customers)

## File Locations

- **Base Data:** `src/data/mockData.ts`
- **Transformers:** `src/data/dataTransformers.ts`
- **Updated Pages:**
  - `src/pages/Inventory.tsx` ✅
  - `src/pages/Vendors.tsx` ✅
  - `src/pages/PurchaseOrders.tsx` ✅
  - `src/pages/SalesOrders.tsx` ✅
