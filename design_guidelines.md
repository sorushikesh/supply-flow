# Design Guidelines: Supply Chain & Inventory Management Application

## Design Approach: Enterprise Data System

**Selected Framework**: Material Design principles with Ant Design component patterns
**Justification**: This is a data-intensive enterprise application requiring proven patterns for tables, forms, and complex workflows. Material Design provides strong information hierarchy and familiar patterns, while Ant Design offers enterprise-specific components ideal for business applications.

**Core Design Principles**:
- Data clarity over visual flair
- Consistent, predictable interactions
- Dense information display with breathing room
- Clear status indicators and action feedback
- Scannable layouts for quick decision-making

---

## Typography System

**Font Stack**: 
- Primary: Inter or Roboto (system-optimized, excellent readability)
- Monospace: JetBrains Mono or Roboto Mono (for codes, IDs, amounts)

**Type Scale**:
- Page Titles: text-2xl font-semibold (Dashboard, Inventory, Orders)
- Section Headers: text-lg font-semibold (within cards/panels)
- Card Titles: text-base font-medium
- Body Text: text-sm font-normal (default for most content)
- Labels: text-xs font-medium uppercase tracking-wide (form labels, table headers)
- Data/Numbers: text-sm font-mono (invoice amounts, SKUs, quantities)
- Meta Info: text-xs (timestamps, status descriptions)

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, and 8
- Micro spacing (within components): p-2, gap-2
- Standard component padding: p-4, p-6
- Section spacing: py-6, py-8
- Page margins: p-8

**Grid Structure**:
- Main container: max-w-7xl mx-auto px-8
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Form layouts: Two-column responsive (grid-cols-1 md:grid-cols-2)
- Table views: Full-width with horizontal scroll on mobile

---

## Application Layout

**Shell Structure**:
1. **Fixed Sidebar Navigation** (left, w-64):
   - Logo/company name at top (h-16)
   - Main navigation items with icons (Dashboard, Inventory, Purchase Orders, Sales Orders, GRN, Dispatch, Invoices, Payments, Analytics)
   - Role-based menu visibility
   - User profile/settings at bottom
   - Collapsible on mobile (hamburger menu)

2. **Top Header Bar** (fixed, h-16):
   - Breadcrumb navigation
   - Global search (expandable)
   - Notifications bell with badge
   - User avatar dropdown (logout, profile, settings)

3. **Main Content Area**:
   - Full height with overflow-y-auto
   - Consistent padding (p-8)
   - White/neutral background

---

## Component Library

### Navigation Components
- **Sidebar Menu Items**: Icon (24px) + Label, hover/active states, nested items with indentation
- **Breadcrumbs**: Home > Section > Subsection with separators
- **Tabs**: Underline style for switching between related views (e.g., Pending/Approved POs)

### Data Display Components

**Data Tables**:
- Sticky header row with sortable columns
- Alternating row backgrounds for scannability
- Row actions (Edit, View, Delete) as icon buttons on hover
- Pagination at bottom (10/25/50/100 items per page)
- Bulk selection checkboxes
- Status badges in dedicated columns
- Responsive: Card view on mobile

**Cards/Panels**:
- Shadow: shadow-sm with subtle border
- Rounded: rounded-lg
- Header with title + action buttons
- Padding: p-6
- Dividers between sections

**Stats Cards** (Dashboard):
- Large number display (text-3xl font-bold)
- Label below (text-sm)
- Small trend indicator (arrow + percentage)
- Icon in corner
- Min height for consistency

**Status Badges**:
- Pill shape (rounded-full px-3 py-1)
- Text: text-xs font-medium uppercase
- States: Pending, Approved, Rejected, Completed, Paid, Overdue, In Transit, Delivered
- Semantic styling (not specifying colors, but clear visual differentiation)

### Form Components

**Input Fields**:
- Label above input (font-medium text-sm mb-2)
- Input: border rounded-md px-3 py-2 w-full
- Helper text below (text-xs)
- Error state with message
- Required indicator (*)

**Special Inputs**:
- Date pickers with calendar icon
- Number inputs with increment/decrement buttons
- Dropdowns with search (Select2-style for vendors, products)
- Multi-select for tags/categories
- File upload with drag-and-drop zone

**Form Layouts**:
- Two-column grid for related fields
- Full-width for text areas
- Group related fields in bordered sections
- Action buttons (Submit/Cancel) at bottom right

### Action Components

**Primary Actions**: Solid buttons (px-6 py-2 rounded-md font-medium)
**Secondary Actions**: Outlined buttons
**Danger Actions**: For delete/reject operations
**Icon Buttons**: For quick actions in tables (24px square)
**Floating Action Button**: For "Create New" on list pages (bottom right, fixed)

### Invoice Components

**Invoice Preview**:
- Professional document layout
- Header: Company details + logo placeholder
- Invoice metadata table (Invoice #, Date, Due Date, PO #)
- Line items table with columns: Item, Description, Qty, Unit Price, Total
- Subtotal, Tax, Total in right-aligned summary box
- Payment terms and notes section
- Footer with payment instructions

**Invoice List View**:
- Searchable/filterable table
- Quick actions: View PDF, Download, Send Email, Mark Paid
- Status column with badges
- Amount due with aging indicators

### Analytics Dashboard

**Layout**: 3-column grid of metric cards at top, followed by charts
**Chart Types**:
- Line charts for trends (Sales over time, Inventory levels)
- Bar charts for comparisons (Top vendors, Best-selling products)
- Pie/donut for distributions (Order status breakdown)
- Simple metric visualizations with sparklines

**Dashboard Widgets**:
- Recent activity feed (last 10 transactions)
- Low stock alerts (table with reorder suggestions)
- Overdue invoices summary
- Quick actions panel (Create PO, Create SO, Generate Report)

---

## Workflow-Specific Screens

**Purchase Order Screen**:
- Vendor selection dropdown at top
- Line items table (Add/Remove rows)
- Auto-calculate totals
- Approval workflow status (if pending)
- Related GRNs section (once created)

**Sales Order Screen**:
- Customer selection + shipping address
- Product selector with stock availability check
- Real-time stock reservation
- Generate Dispatch note button
- Related invoices section

**GRN Screen**:
- Linked PO details (read-only)
- Received quantity vs Ordered quantity comparison
- Quality check notes field
- Auto-update inventory on submit
- Photo upload for damaged goods

**Inventory Screen**:
- Filter by category, low stock, location
- Each item card shows: SKU, Name, Current Stock, Reorder Level, Last Updated
- Quick add/remove stock modal
- Stock movement history timeline

---

## Responsive Behavior

**Desktop (lg and up)**:
- Sidebar always visible
- Multi-column layouts
- Data tables with all columns

**Tablet (md)**:
- Collapsible sidebar
- Two-column forms
- Horizontal scroll on tables

**Mobile (base)**:
- Hamburger menu
- Single column layouts
- Card view instead of tables
- Bottom navigation for key actions

---

## Animation & Interactions

**Minimal Motion**:
- Smooth transitions on hover states (transition-colors duration-150)
- Loading spinners for data fetch
- Success/error toast notifications (top-right, auto-dismiss)
- Modal slide-in animations (duration-200)
- No decorative animations

**Feedback**:
- Button loading states with spinner
- Optimistic UI updates where safe
- Confirmation dialogs for destructive actions
- Progress bars for multi-step processes

---

## Images

This application requires **no hero images or decorative imagery**. All visual content is functional:
- Company logo in sidebar header (max-h-12)
- User avatars (rounded-full, 32px or 40px)
- Product thumbnails in inventory (64px square, rounded)
- Empty states with simple illustrations (400px max width, centered)

---

## Key UX Patterns

**Search & Filter**: Global search in header + page-specific filters (always above tables)
**Bulk Actions**: Checkbox selection + action dropdown
**Export**: Download as CSV/PDF buttons on list views
**Shortcuts**: Keyboard shortcuts for power users (Ctrl+N for New, etc.)
**Audit Trail**: "Last updated by [User] on [Date]" timestamps on records
**Permissions**: Hide/disable actions based on user role

This design system prioritizes **data density, workflow efficiency, and operational clarity** - essential for enterprise inventory management where speed and accuracy directly impact business operations.