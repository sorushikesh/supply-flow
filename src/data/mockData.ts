// Centralized Mock Data for Supply Flow Application
// All data is interconnected and maintains referential integrity

// ============================================
// PRODUCTS
// ============================================
export const products = [
  {
    id: "prod-001",
    sku: "LTP-0001",
    name: "Dell Latitude 5540 15.6\" Laptop",
    category: "Laptops",
    description: "Intel Core i7, 16GB RAM, 512GB SSD",
    unitPrice: 1250,
    costPrice: 950,
    stockQuantity: 150,
    reorderLevel: 20,
    location: "Main Warehouse (Indianapolis)",
    supplier: "Dell Technologies"
  },
  {
    id: "prod-002",
    sku: "LTP-0002",
    name: "HP ProBook 450 G9 15.6\" Laptop",
    category: "Laptops",
    description: "Intel Core i5, 8GB RAM, 256GB SSD",
    unitPrice: 899,
    costPrice: 680,
    stockQuantity: 200,
    reorderLevel: 30,
    location: "Main Warehouse (Indianapolis)",
    supplier: "HP Inc."
  },
  {
    id: "prod-003",
    sku: "LTP-0003",
    name: "HP EliteBook 840 14\" Laptop",
    category: "Laptops",
    description: "Intel Core i7, 16GB RAM, 1TB SSD",
    unitPrice: 1350,
    costPrice: 1020,
    stockQuantity: 120,
    reorderLevel: 15,
    location: "Main Warehouse (Indianapolis)",
    supplier: "HP Inc."
  },
  {
    id: "prod-004",
    sku: "LTP-0004",
    name: "Lenovo ThinkPad X1 Carbon Gen 11",
    category: "Laptops",
    description: "Intel Core i7, 16GB RAM, 512GB SSD, 14\" Display",
    unitPrice: 1599,
    costPrice: 1210,
    stockQuantity: 85,
    reorderLevel: 10,
    location: "Electronics Depot (Austin)",
    supplier: "Lenovo"
  },
  {
    id: "prod-005",
    sku: "MON-0005",
    name: "Samsung 27\" 4K Monitor",
    category: "Monitors",
    description: "4K UHD, USB-C connectivity",
    unitPrice: 450,
    costPrice: 340,
    stockQuantity: 180,
    reorderLevel: 25,
    location: "Main Warehouse (Indianapolis)",
    supplier: "Samsung Electronics"
  },
  {
    id: "prod-006",
    sku: "MON-0006",
    name: "Dell UltraSharp 24\" Monitor",
    category: "Monitors",
    description: "Full HD IPS, USB Hub",
    unitPrice: 280,
    costPrice: 212,
    stockQuantity: 250,
    reorderLevel: 40,
    location: "Main Warehouse (Indianapolis)",
    supplier: "Dell Technologies"
  },
  {
    id: "prod-007",
    sku: "MON-0007",
    name: "LG 32\" UltraWide Monitor",
    category: "Monitors",
    description: "WQHD resolution, IPS panel",
    unitPrice: 650,
    costPrice: 492,
    stockQuantity: 95,
    reorderLevel: 15,
    location: "Electronics Depot (Austin)",
    supplier: "LG Electronics"
  },
  {
    id: "prod-008",
    sku: "PWR-0008",
    name: "65W USB-C Power Adapter",
    category: "Power Supplies",
    description: "Universal laptop charger",
    unitPrice: 45,
    costPrice: 34,
    stockQuantity: 500,
    reorderLevel: 100,
    location: "Main Warehouse (Indianapolis)",
    supplier: "Anker"
  },
  {
    id: "prod-009",
    sku: "PWR-0009",
    name: "Dell 90W AC Adapter",
    category: "Power Supplies",
    description: "Compatible with Dell laptops",
    unitPrice: 55,
    costPrice: 42,
    stockQuantity: 320,
    reorderLevel: 80,
    location: "Main Warehouse (Indianapolis)",
    supplier: "Dell Technologies"
  },
  {
    id: "prod-010",
    sku: "PWR-0010",
    name: "HP 65W Smart AC Adapter",
    category: "Power Supplies",
    description: "Smart charging technology",
    unitPrice: 50,
    costPrice: 38,
    stockQuantity: 280,
    reorderLevel: 70,
    location: "Regional Storage (Memphis)",
    supplier: "HP Inc."
  },
  {
    id: "prod-011",
    sku: "PWR-0011",
    name: "Lenovo 65W Standard AC Adapter",
    category: "Power Supplies",
    description: "Standard USB-C charger",
    unitPrice: 48,
    costPrice: 36,
    stockQuantity: 290,
    reorderLevel: 75,
    location: "Regional Storage (Memphis)",
    supplier: "Lenovo"
  },
  {
    id: "prod-012",
    sku: "PWR-0012",
    name: "90W USB-C Power Adapter",
    category: "Power Supplies",
    description: "Universal laptop charger",
    unitPrice: 130,
    costPrice: 98,
    stockQuantity: 215,
    reorderLevel: 50,
    location: "Main Warehouse (Indianapolis)",
    supplier: "Anker"
  },
  {
    id: "prod-013",
    sku: "ACC-0013",
    name: "Logitech MX Master 3S Wireless Mouse",
    category: "Accessories",
    description: "Ergonomic wireless mouse",
    unitPrice: 99,
    costPrice: 75,
    stockQuantity: 450,
    reorderLevel: 100,
    location: "Main Warehouse (Indianapolis)",
    supplier: "Logitech"
  },
  {
    id: "prod-014",
    sku: "ACC-0014",
    name: "Mechanical Keyboard RGB",
    category: "Accessories",
    description: "Cherry MX switches, RGB backlight",
    unitPrice: 120,
    costPrice: 91,
    stockQuantity: 175,
    reorderLevel: 40,
    location: "Electronics Depot (Austin)",
    supplier: "Corsair"
  },
  {
    id: "prod-015",
    sku: "ACC-0015",
    name: "USB-C Hub 7-in-1",
    category: "Accessories",
    description: "Multi-port adapter",
    unitPrice: 100,
    costPrice: 76,
    stockQuantity: 380,
    reorderLevel: 80,
    location: "Main Warehouse (Indianapolis)",
    supplier: "Anker"
  },
  {
    id: "prod-016",
    sku: "ACC-0016",
    name: "Laptop Backpack Pro",
    category: "Accessories",
    description: "Fits up to 15.6\" laptops",
    unitPrice: 75,
    costPrice: 57,
    stockQuantity: 240,
    reorderLevel: 50,
    location: "Regional Storage (Memphis)",
    supplier: "Targus"
  },
  {
    id: "prod-017",
    sku: "ACC-0017",
    name: "Webcam 1080p Full HD",
    category: "Accessories",
    description: "USB webcam with microphone",
    unitPrice: 85,
    costPrice: 64,
    stockQuantity: 310,
    reorderLevel: 70,
    location: "Main Warehouse (Indianapolis)",
    supplier: "Logitech"
  },
  {
    id: "prod-018",
    sku: "ACC-0018",
    name: "Wireless Headset with Mic",
    category: "Accessories",
    description: "Bluetooth, noise canceling",
    unitPrice: 149,
    costPrice: 113,
    stockQuantity: 190,
    reorderLevel: 45,
    location: "Electronics Depot (Austin)",
    supplier: "Jabra"
  },
  {
    id: "prod-019",
    sku: "ACC-0019",
    name: "Laptop Stand Aluminum",
    category: "Accessories",
    description: "Adjustable ergonomic stand",
    unitPrice: 45,
    costPrice: 34,
    stockQuantity: 420,
    reorderLevel: 90,
    location: "Regional Storage (Memphis)",
    supplier: "Rain Design"
  },
  {
    id: "prod-020",
    sku: "ACC-0020",
    name: "Wireless Mouse & Keyboard Combo",
    category: "Accessories",
    description: "Ergonomic design",
    unitPrice: 95,
    costPrice: 72,
    stockQuantity: 275,
    reorderLevel: 60,
    location: "Main Warehouse (Indianapolis)",
    supplier: "Logitech"
  }
];

// ============================================
// VENDORS/SUPPLIERS
// ============================================
export const vendors = [
  {
    id: "vendor-001",
    name: "Dell Technologies",
    contact: "Michael Zhang",
    email: "michael.zhang@dell.com",
    phone: "+1 (512) 338-4400",
    address: "Round Rock, TX 78682",
    paymentTerms: "Net 45",
    status: "active",
    rating: 5
  },
  {
    id: "vendor-002",
    name: "HP Inc.",
    contact: "Jennifer Martinez",
    email: "jennifer.martinez@hp.com",
    phone: "+1 (650) 857-1501",
    address: "Palo Alto, CA 94304",
    paymentTerms: "Net 45",
    status: "active",
    rating: 5
  },
  {
    id: "vendor-003",
    name: "Lenovo",
    contact: "David Kim",
    email: "david.kim@lenovo.com",
    phone: "+1 (855) 253-6686",
    address: "Morrisville, NC 27560",
    paymentTerms: "Net 30",
    status: "active",
    rating: 5
  },
  {
    id: "vendor-004",
    name: "Samsung Electronics",
    contact: "Lisa Park",
    email: "lisa.park@samsung.com",
    phone: "+1 (800) 726-7864",
    address: "Ridgefield Park, NJ 07660",
    paymentTerms: "Net 30",
    status: "active",
    rating: 5
  },
  {
    id: "vendor-005",
    name: "LG Electronics",
    contact: "Robert Chen",
    email: "robert.chen@lge.com",
    phone: "+1 (201) 816-2000",
    address: "Englewood Cliffs, NJ 07632",
    paymentTerms: "Net 30",
    status: "active",
    rating: 4
  },
  {
    id: "vendor-006",
    name: "Anker",
    contact: "Steven Liu",
    email: "steven.liu@anker.com",
    phone: "+1 (800) 988-7973",
    address: "Seattle, WA 98104",
    paymentTerms: "Net 30",
    status: "active",
    rating: 4
  },
  {
    id: "vendor-007",
    name: "Logitech",
    contact: "Amanda Foster",
    email: "amanda.foster@logitech.com",
    phone: "+1 (510) 795-8500",
    address: "Newark, CA 94560",
    paymentTerms: "Net 30",
    status: "active",
    rating: 5
  },
  {
    id: "vendor-008",
    name: "Corsair",
    contact: "Tom Bradley",
    email: "tom.bradley@corsair.com",
    phone: "+1 (888) 222-4346",
    address: "Fremont, CA 94538",
    paymentTerms: "Net 30",
    status: "active",
    rating: 4
  },
  {
    id: "vendor-009",
    name: "Targus",
    contact: "Emily Watson",
    email: "emily.watson@targus.com",
    phone: "+1 (714) 765-5555",
    address: "Anaheim, CA 92806",
    paymentTerms: "Net 30",
    status: "active",
    rating: 4
  },
  {
    id: "vendor-010",
    name: "Jabra",
    contact: "Chris Anderson",
    email: "chris.anderson@jabra.com",
    phone: "+1 (800) 327-2230",
    address: "Boston, MA 02110",
    paymentTerms: "Net 30",
    status: "active",
    rating: 5
  },
  {
    id: "vendor-011",
    name: "Rain Design",
    contact: "Kevin Tan",
    email: "kevin.tan@raindesign.com",
    phone: "+1 (408) 954-1880",
    address: "Sunnyvale, CA 94089",
    paymentTerms: "Net 30",
    status: "active",
    rating: 4
  }
];

// ============================================
// CUSTOMERS
// ============================================
export const customers = [
  {
    id: "customer-001",
    name: "TechCorp Solutions",
    contact: "Sarah Johnson",
    email: "sarah.j@techcorp.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Street, San Francisco, CA 94105",
    creditLimit: 500000,
    paymentTerms: "Net 30",
    status: "active",
    type: "corporate"
  },
  {
    id: "customer-002",
    name: "BestBuy Corporate",
    contact: "Michael Brown",
    email: "m.brown@bestbuy.com",
    phone: "+1 (555) 234-5678",
    address: "456 Retail Blvd, Richfield, MN 55423",
    creditLimit: 1000000,
    paymentTerms: "Net 30",
    status: "active",
    type: "retail"
  },
  {
    id: "customer-003",
    name: "Amazon Business Services",
    contact: "David Wilson",
    email: "d.wilson@amazon.com",
    phone: "+1 (555) 345-6789",
    address: "789 Commerce Way, Seattle, WA 98109",
    creditLimit: 2000000,
    paymentTerms: "Net 45",
    status: "active",
    type: "online"
  },
  {
    id: "customer-004",
    name: "Office Depot Inc",
    contact: "Jennifer Lee",
    email: "j.lee@officedepot.com",
    phone: "+1 (555) 456-7890",
    address: "234 Supply Avenue, Boca Raton, FL 33431",
    creditLimit: 750000,
    paymentTerms: "Net 30",
    status: "active",
    type: "retail"
  },
  {
    id: "customer-005",
    name: "CDW Corporation",
    contact: "Robert Martinez",
    email: "r.martinez@cdw.com",
    phone: "+1 (555) 567-8901",
    address: "567 Distribution Drive, Vernon Hills, IL 60061",
    creditLimit: 1500000,
    paymentTerms: "Net 30",
    status: "active",
    type: "distributor"
  },
  {
    id: "customer-006",
    name: "Newegg Business",
    contact: "Linda Chen",
    email: "l.chen@newegg.com",
    phone: "+1 (555) 678-9012",
    address: "890 Tech Plaza, City of Industry, CA 91748",
    creditLimit: 800000,
    paymentTerms: "Net 30",
    status: "active",
    type: "online"
  },
  {
    id: "customer-007",
    name: "Micro Center",
    contact: "James Taylor",
    email: "j.taylor@microcenter.com",
    phone: "+1 (555) 789-0123",
    address: "345 Electronics Row, Hilliard, OH 43026",
    creditLimit: 600000,
    paymentTerms: "Net 30",
    status: "active",
    type: "retail"
  },
  {
    id: "customer-008",
    name: "B&H Photo Video",
    contact: "Rachel Green",
    email: "r.green@bhphoto.com",
    phone: "+1 (555) 890-1234",
    address: "678 Media Street, New York, NY 10001",
    creditLimit: 700000,
    paymentTerms: "Net 30",
    status: "active",
    type: "retail"
  },
  {
    id: "customer-009",
    name: "Staples Business Advantage",
    contact: "Thomas White",
    email: "t.white@staples.com",
    phone: "+1 (555) 901-2345",
    address: "901 Office Park, Framingham, MA 01702",
    creditLimit: 650000,
    paymentTerms: "Net 30",
    status: "active",
    type: "retail"
  },
  {
    id: "customer-010",
    name: "Insight Enterprises",
    contact: "Nancy Davis",
    email: "n.davis@insight.com",
    phone: "+1 (555) 012-3456",
    address: "123 Business Center, Chandler, AZ 85286",
    creditLimit: 900000,
    paymentTerms: "Net 30",
    status: "active",
    type: "distributor"
  }
];

// ============================================
// WAREHOUSES
// ============================================
export const warehouses = [
  {
    id: "warehouse-001",
    name: "Main Warehouse (Indianapolis)",
    location: "Indianapolis, IN",
    capacity: 10000,
    manager: "John Smith"
  },
  {
    id: "warehouse-002",
    name: "Electronics Depot (Austin)",
    location: "Austin, TX",
    capacity: 7500,
    manager: "Sarah Williams"
  },
  {
    id: "warehouse-003",
    name: "Regional Storage (Memphis)",
    location: "Memphis, TN",
    capacity: 5000,
    manager: "Mike Johnson"
  }
];

// ============================================
// PURCHASE ORDERS
// ============================================
export const purchaseOrders = [
  {
    id: "po-001",
    poNumber: "PO-2024-0045",
    vendor: "vendor-001", // Dell Technologies
    orderDate: "2024-01-10",
    expectedDate: "2024-01-25",
    status: "received",
    totalAmount: 59375,
    items: [
      { productId: "prod-001", quantity: 25, unitPrice: 950, total: 23750 },
      { productId: "prod-006", quantity: 50, unitPrice: 212, total: 10600 },
      { productId: "prod-009", quantity: 75, unitPrice: 42, total: 3150 }
    ]
  },
  {
    id: "po-002",
    poNumber: "PO-2024-0046",
    vendor: "vendor-002", // HP Inc.
    orderDate: "2024-01-12",
    expectedDate: "2024-01-27",
    status: "received",
    totalAmount: 77450,
    items: [
      { productId: "prod-002", quantity: 40, unitPrice: 680, total: 27200 },
      { productId: "prod-003", quantity: 35, unitPrice: 1020, total: 35700 },
      { productId: "prod-010", quantity: 100, unitPrice: 38, total: 3800 }
    ]
  },
  {
    id: "po-003",
    poNumber: "PO-2024-0047",
    vendor: "vendor-004", // Samsung Electronics
    orderDate: "2024-01-15",
    expectedDate: "2024-01-30",
    status: "pending",
    totalAmount: 35700,
    items: [
      { productId: "prod-005", quantity: 60, unitPrice: 340, total: 20400 },
    ]
  },
  {
    id: "po-004",
    poNumber: "PO-2024-0048",
    vendor: "vendor-003", // Lenovo
    orderDate: "2024-01-08",
    expectedDate: "2024-01-23",
    status: "received",
    totalAmount: 48400,
    items: [
      { productId: "prod-004", quantity: 40, unitPrice: 1210, total: 48400 }
    ]
  },
  {
    id: "po-005",
    poNumber: "PO-2024-0049",
    vendor: "vendor-007", // Logitech
    orderDate: "2024-01-18",
    expectedDate: "2024-02-02",
    status: "in_transit",
    totalAmount: 31050,
    items: [
      { productId: "prod-013", quantity: 120, unitPrice: 75, total: 9000 },
      { productId: "prod-017", quantity: 80, unitPrice: 64, total: 5120 },
      { productId: "prod-020", quantity: 100, unitPrice: 72, total: 7200 }
    ]
  }
];

// ============================================
// SALES ORDERS
// ============================================
export const salesOrders = [
  {
    id: "so-001",
    soNumber: "SO-2024-0123",
    customer: "customer-001", // TechCorp Solutions
    orderDate: "2024-01-15",
    deliveryDate: "2024-01-22",
    status: "shipped",
    totalAmount: 25750,
    items: [
      { productId: "prod-001", quantity: 15, unitPrice: 1250, total: 18750 },
      { productId: "prod-005", quantity: 10, unitPrice: 450, total: 4500 },
      { productId: "prod-015", quantity: 25, unitPrice: 100, total: 2500 }
    ]
  },
  {
    id: "so-002",
    soNumber: "SO-2024-0124",
    customer: "customer-002", // BestBuy Corporate
    orderDate: "2024-01-14",
    deliveryDate: "2024-01-21",
    status: "delivered",
    totalAmount: 65200,
    items: [
      { productId: "prod-003", quantity: 30, unitPrice: 1350, total: 40500 },
      { productId: "prod-007", quantity: 25, unitPrice: 650, total: 16250 },
      { productId: "prod-012", quantity: 35, unitPrice: 130, total: 4550 },
      { productId: "prod-020", quantity: 40, unitPrice: 95, total: 3800 }
    ]
  },
  {
    id: "so-003",
    soNumber: "SO-2024-0125",
    customer: "customer-003", // Amazon Business Services
    orderDate: "2024-01-16",
    deliveryDate: "2024-01-23",
    status: "processing",
    totalAmount: 134520,
    items: [
      { productId: "prod-001", quantity: 50, unitPrice: 1250, total: 62500 },
      { productId: "prod-002", quantity: 40, unitPrice: 899, total: 35960 },
      { productId: "prod-005", quantity: 60, unitPrice: 450, total: 27000 },
      { productId: "prod-013", quantity: 80, unitPrice: 99, total: 7920 }
    ]
  },
  {
    id: "so-004",
    soNumber: "SO-2024-0126",
    customer: "customer-004", // Office Depot Inc
    orderDate: "2024-01-13",
    deliveryDate: "2024-01-20",
    status: "delivered",
    totalAmount: 42800,
    items: [
      { productId: "prod-002", quantity: 35, unitPrice: 899, total: 31465 },
      { productId: "prod-006", quantity: 30, unitPrice: 280, total: 8400 },
      { productId: "prod-015", quantity: 28, unitPrice: 100, total: 2800 }
    ]
  },
  {
    id: "so-005",
    soNumber: "SO-2024-0127",
    customer: "customer-005", // CDW Corporation
    orderDate: "2024-01-17",
    deliveryDate: "2024-01-24",
    status: "shipped",
    totalAmount: 89250,
    items: [
      { productId: "prod-004", quantity: 45, unitPrice: 1599, total: 71955 },
      { productId: "prod-007", quantity: 20, unitPrice: 650, total: 13000 },
      { productId: "prod-018", quantity: 30, unitPrice: 149, total: 4470 }
    ]
  }
];

// ============================================
// INVOICES
// ============================================
export const invoices = [
  {
    id: "inv-001",
    invoiceNumber: "INV-2024-0100",
    type: "customer",
    relatedOrder: "so-001", // TechCorp Solutions
    customerId: "customer-001",
    vendorId: null,
    issueDate: "2024-01-15",
    dueDate: "2024-02-14",
    amount: 25750,
    paidAmount: 0,
    status: "pending",
    approvalStatus: "pending_approval",
    approvalLevel: 1,
    totalApprovalLevels: 2
  },
  {
    id: "inv-002",
    invoiceNumber: "INV-2024-0099",
    type: "customer",
    relatedOrder: "so-002", // BestBuy Corporate
    customerId: "customer-002",
    vendorId: null,
    issueDate: "2024-01-14",
    dueDate: "2024-02-13",
    amount: 65200,
    paidAmount: 65200,
    status: "paid",
    approvalStatus: "approved",
    approvalLevel: 2,
    totalApprovalLevels: 2
  },
  {
    id: "inv-003",
    invoiceNumber: "INV-2024-0098",
    type: "customer",
    relatedOrder: "so-003", // Amazon Business Services
    customerId: "customer-003",
    vendorId: null,
    issueDate: "2024-01-16",
    dueDate: "2024-02-15",
    amount: 134520,
    paidAmount: 67260,
    status: "partial",
    approvalStatus: "approved",
    approvalLevel: 2,
    totalApprovalLevels: 2
  },
  {
    id: "inv-004",
    invoiceNumber: "INV-2024-0097",
    type: "customer",
    relatedOrder: "so-004", // Office Depot Inc
    customerId: "customer-004",
    vendorId: null,
    issueDate: "2024-01-13",
    dueDate: "2024-02-12",
    amount: 42800,
    paidAmount: 42800,
    status: "paid",
    approvalStatus: "approved",
    approvalLevel: 2,
    totalApprovalLevels: 2
  },
  {
    id: "inv-005",
    invoiceNumber: "INV-2024-0096",
    type: "vendor",
    relatedOrder: "po-001", // Dell Technologies
    customerId: null,
    vendorId: "vendor-001",
    issueDate: "2024-01-10",
    dueDate: "2024-02-24",
    amount: 59375,
    paidAmount: 59375,
    status: "paid",
    approvalStatus: "approved",
    approvalLevel: 2,
    totalApprovalLevels: 2
  },
  {
    id: "inv-006",
    invoiceNumber: "INV-2024-0095",
    type: "vendor",
    relatedOrder: "po-002", // HP Inc.
    customerId: null,
    vendorId: "vendor-002",
    issueDate: "2024-01-12",
    dueDate: "2024-02-26",
    amount: 77450,
    paidAmount: 0,
    status: "pending",
    approvalStatus: "approved",
    approvalLevel: 2,
    totalApprovalLevels: 2
  },
  {
    id: "inv-007",
    invoiceNumber: "INV-2024-0094",
    type: "vendor",
    relatedOrder: "po-004", // Lenovo
    customerId: null,
    vendorId: "vendor-003",
    issueDate: "2024-01-08",
    dueDate: "2024-02-07",
    amount: 48400,
    paidAmount: 48400,
    status: "paid",
    approvalStatus: "approved",
    approvalLevel: 1,
    totalApprovalLevels: 1
  }
];

// ============================================
// GOODS RECEIPT NOTES (GRN)
// ============================================
export const goodsReceiptNotes = [
  {
    id: "grn-001",
    grnNumber: "GRN-2024-0030",
    purchaseOrder: "po-001", // Dell Technologies
    vendorId: "vendor-001",
    receiptDate: "2024-01-25",
    receivedBy: "Mike Johnson",
    warehouse: "warehouse-001",
    status: "completed",
    items: [
      { productId: "prod-001", orderedQty: 25, receivedQty: 25, status: "accepted" },
      { productId: "prod-006", orderedQty: 50, receivedQty: 50, status: "accepted" },
      { productId: "prod-009", orderedQty: 75, receivedQty: 75, status: "accepted" }
    ]
  },
  {
    id: "grn-002",
    grnNumber: "GRN-2024-0031",
    purchaseOrder: "po-002", // HP Inc.
    vendorId: "vendor-002",
    receiptDate: "2024-01-27",
    receivedBy: "Sarah Williams",
    warehouse: "warehouse-001",
    status: "completed",
    items: [
      { productId: "prod-002", orderedQty: 40, receivedQty: 40, status: "accepted" },
      { productId: "prod-003", orderedQty: 35, receivedQty: 35, status: "accepted" },
      { productId: "prod-010", orderedQty: 100, receivedQty: 98, status: "partial" }
    ]
  },
  {
    id: "grn-003",
    grnNumber: "GRN-2024-0032",
    purchaseOrder: "po-004", // Lenovo
    vendorId: "vendor-003",
    receiptDate: "2024-01-23",
    receivedBy: "Mike Johnson",
    warehouse: "warehouse-002",
    status: "completed",
    items: [
      { productId: "prod-004", orderedQty: 40, receivedQty: 40, status: "accepted" }
    ]
  }
];

// ============================================
// DISPATCH RECORDS
// ============================================
export const dispatchRecords = [
  {
    id: "dispatch-001",
    dispatchNumber: "DISP-2024-0078",
    salesOrder: "so-001", // TechCorp Solutions
    customerId: "customer-001",
    dispatchDate: "2024-01-17",
    deliveryDate: "2024-01-22",
    carrier: "FedEx Express",
    trackingNumber: "FDX789456123",
    status: "delivered",
    warehouse: "warehouse-001",
    items: [
      { productId: "prod-001", quantity: 15 },
      { productId: "prod-005", quantity: 10 },
      { productId: "prod-015", quantity: 25 }
    ]
  },
  {
    id: "dispatch-002",
    dispatchNumber: "DISP-2024-0079",
    salesOrder: "so-002", // BestBuy Corporate
    customerId: "customer-002",
    dispatchDate: "2024-01-16",
    deliveryDate: "2024-01-21",
    carrier: "UPS Ground",
    trackingNumber: "UPS123789456",
    status: "delivered",
    warehouse: "warehouse-001",
    items: [
      { productId: "prod-003", quantity: 30 },
      { productId: "prod-007", quantity: 25 },
      { productId: "prod-012", quantity: 35 },
      { productId: "prod-020", quantity: 40 }
    ]
  },
  {
    id: "dispatch-003",
    dispatchNumber: "DISP-2024-0080",
    salesOrder: "so-004", // Office Depot Inc
    customerId: "customer-004",
    dispatchDate: "2024-01-15",
    deliveryDate: "2024-01-20",
    carrier: "DHL Express",
    trackingNumber: "DHL456123789",
    status: "delivered",
    warehouse: "warehouse-001",
    items: [
      { productId: "prod-002", quantity: 35 },
      { productId: "prod-006", quantity: 30 },
      { productId: "prod-015", quantity: 28 }
    ]
  },
  {
    id: "dispatch-004",
    dispatchNumber: "DISP-2024-0081",
    salesOrder: "so-005", // CDW Corporation
    customerId: "customer-005",
    dispatchDate: "2024-01-19",
    deliveryDate: "2024-01-24",
    carrier: "FedEx Express",
    trackingNumber: "FDX987654321",
    status: "in_transit",
    warehouse: "warehouse-002",
    items: [
      { productId: "prod-004", quantity: 45 },
      { productId: "prod-007", quantity: 20 },
      { productId: "prod-018", quantity: 30 }
    ]
  }
];

// ============================================
// HELPER FUNCTIONS TO GET RELATED DATA
// ============================================

export const getProductById = (productId: string) => {
  return products.find(p => p.id === productId);
};

export const getVendorById = (vendorId: string) => {
  return vendors.find(v => v.id === vendorId);
};

export const getCustomerById = (customerId: string) => {
  return customers.find(c => c.id === customerId);
};

export const getWarehouseById = (warehouseId: string) => {
  return warehouses.find(w => w.id === warehouseId);
};

export const getPurchaseOrderById = (poId: string) => {
  return purchaseOrders.find(po => po.id === poId);
};

export const getSalesOrderById = (soId: string) => {
  return salesOrders.find(so => so.id === soId);
};

export const getInvoiceById = (invId: string) => {
  return invoices.find(inv => inv.id === invId);
};

// Get all purchase orders for a specific vendor
export const getPurchaseOrdersByVendor = (vendorId: string) => {
  return purchaseOrders.filter(po => po.vendor === vendorId);
};

// Get all sales orders for a specific customer
export const getSalesOrdersByCustomer = (customerId: string) => {
  return salesOrders.filter(so => so.customer === customerId);
};

// Get invoice with full details (customer/vendor name, line items)
export const getInvoiceWithDetails = (invoiceId: string) => {
  const invoice = invoices.find(inv => inv.id === invoiceId);
  if (!invoice) return null;

  const party = invoice.type === "customer" 
    ? getCustomerById(invoice.customerId!)
    : getVendorById(invoice.vendorId!);

  const order = invoice.type === "customer"
    ? getSalesOrderById(invoice.relatedOrder)
    : getPurchaseOrderById(invoice.relatedOrder);

  const lineItems = order?.items.map(item => {
    const product = getProductById(item.productId);
    return {
      id: item.productId,
      productName: product?.name || "Unknown Product",
      sku: product?.sku || "N/A",
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total,
      description: product?.description
    };
  });

  return {
    ...invoice,
    party: party?.name || "Unknown",
    lineItems: lineItems || []
  };
};

// Get purchase order with full details
export const getPurchaseOrderWithDetails = (poId: string) => {
  const po = purchaseOrders.find(p => p.id === poId);
  if (!po) return null;

  const vendor = getVendorById(po.vendor);
  const items = po.items.map(item => {
    const product = getProductById(item.productId);
    return {
      ...item,
      productName: product?.name || "Unknown",
      sku: product?.sku || "N/A",
      description: product?.description
    };
  });

  return {
    ...po,
    vendorName: vendor?.name || "Unknown Vendor",
    vendorContact: vendor?.contact,
    items
  };
};

// Get sales order with full details
export const getSalesOrderWithDetails = (soId: string) => {
  const so = salesOrders.find(s => s.id === soId);
  if (!so) return null;

  const customer = getCustomerById(so.customer);
  const items = so.items.map(item => {
    const product = getProductById(item.productId);
    return {
      ...item,
      productName: product?.name || "Unknown",
      sku: product?.sku || "N/A",
      description: product?.description
    };
  });

  return {
    ...so,
    customerName: customer?.name || "Unknown Customer",
    customerContact: customer?.contact,
    items
  };
};
