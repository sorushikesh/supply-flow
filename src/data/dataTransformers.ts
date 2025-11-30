// Data transformers to convert centralized mock data to page-specific formats
import {
  products,
  vendors,
  customers,
  purchaseOrders,
  salesOrders,
  invoices,
  goodsReceiptNotes,
  dispatchRecords,
  getProductById,
  getVendorById,
  getCustomerById,
  getSalesOrderById,
  getPurchaseOrderById
} from './mockData';

// ============================================
// INVENTORY PAGE DATA
// ============================================
export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  unitPrice: number;
  location: string;
  lastUpdated: string;
}

export interface StockMovement {
  id: string;
  date: string;
  type: "in" | "out";
  quantity: number;
  reference: string;
  notes: string;
  performedBy: string;
}

export const getInventoryData = (): InventoryItem[] => {
  return products.map(product => ({
    id: product.id,
    sku: product.sku,
    name: product.name,
    category: product.category,
    currentStock: product.stockQuantity,
    reorderLevel: product.reorderLevel,
    unitPrice: product.unitPrice,
    location: product.location,
    lastUpdated: "2024-01-15"
  }));
};

export const getStockMovements = (): Record<string, StockMovement[]> => {
  const movements: Record<string, StockMovement[]> = {};
  
  // Generate movements based on purchase orders (stock in)
  purchaseOrders.forEach(po => {
    po.items.forEach(item => {
      if (!movements[item.productId]) {
        movements[item.productId] = [];
      }
      movements[item.productId].push({
        id: `mov-${po.id}-${item.productId}`,
        date: po.orderDate,
        type: "in",
        quantity: item.quantity,
        reference: po.poNumber,
        notes: `Purchase from ${getVendorById(po.vendor)?.name || 'Unknown Vendor'}`,
        performedBy: "Sarah Williams"
      });
    });
  });

  // Generate movements based on sales orders (stock out)
  salesOrders.forEach(so => {
    so.items.forEach(item => {
      if (!movements[item.productId]) {
        movements[item.productId] = [];
      }
      movements[item.productId].push({
        id: `mov-${so.id}-${item.productId}`,
        date: so.orderDate,
        type: "out",
        quantity: item.quantity,
        reference: so.soNumber,
        notes: `Sale to ${getCustomerById(so.customer)?.name || 'Unknown Customer'}`,
        performedBy: "Mike Johnson"
      });
    });
  });

  return movements;
};

// ============================================
// VENDORS PAGE DATA
// ============================================
export interface Vendor {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  totalPurchases: number;
  status: "active" | "inactive";
  rating: number;
}

export interface PurchaseOrderHistory {
  poNumber: string;
  date: string;
  amount: number;
  status: string;
  items: string;
}

export const getVendorsData = (): Vendor[] => {
  return vendors.map(vendor => {
    const vendorPOs = purchaseOrders.filter(po => po.vendor === vendor.id);
    const totalPurchases = vendorPOs.reduce((sum, po) => sum + po.totalAmount, 0);
    
    return {
      id: vendor.id,
      name: vendor.name,
      contact: vendor.contact,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
      totalPurchases,
      status: vendor.status as "active" | "inactive",
      rating: vendor.rating
    };
  });
};

export const getVendorPurchaseHistory = (): Record<string, PurchaseOrderHistory[]> => {
  const history: Record<string, PurchaseOrderHistory[]> = {};
  
  vendors.forEach(vendor => {
    const vendorPOs = purchaseOrders.filter(po => po.vendor === vendor.id);
    history[vendor.id] = vendorPOs.map(po => ({
      poNumber: po.poNumber,
      date: po.orderDate,
      amount: po.totalAmount,
      status: po.status,
      items: po.items.map(item => {
        const product = getProductById(item.productId);
        return `${product?.name || 'Unknown'} (${item.quantity})`;
      }).join(', ')
    }));
  });
  
  return history;
};

// ============================================
// CUSTOMERS PAGE DATA
// ============================================
export interface Customer {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  totalPurchases: number;
  status: "active" | "inactive";
  creditLimit: number;
}

export interface SalesOrderHistory {
  soNumber: string;
  date: string;
  amount: number;
  status: string;
  items: string;
}

export const getCustomersData = (): Customer[] => {
  return customers.map(customer => {
    const customerSOs = salesOrders.filter(so => so.customer === customer.id);
    const totalPurchases = customerSOs.reduce((sum, so) => sum + so.totalAmount, 0);
    
    return {
      id: customer.id,
      name: customer.name,
      contact: customer.contact,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      totalPurchases,
      status: customer.status as "active" | "inactive",
      creditLimit: customer.creditLimit
    };
  });
};

export const getCustomerSalesHistory = (): Record<string, SalesOrderHistory[]> => {
  const history: Record<string, SalesOrderHistory[]> = {};
  
  customers.forEach(customer => {
    const customerSOs = salesOrders.filter(so => so.customer === customer.id);
    history[customer.id] = customerSOs.map(so => ({
      soNumber: so.soNumber,
      date: so.orderDate,
      amount: so.totalAmount,
      status: so.status,
      items: so.items.map(item => {
        const product = getProductById(item.productId);
        return `${product?.name || 'Unknown'} (${item.quantity})`;
      }).join(', ')
    }));
  });
  
  return history;
};

// ============================================
// PURCHASE ORDERS PAGE DATA
// ============================================

// Status mapping helper
const mapPOStatus = (status: string): "pending" | "approved" | "completed" | "cancelled" | "in_transit" => {
  if (status === "received") return "completed";
  if (status === "in_transit") return "in_transit";
  if (status === "shipped") return "completed";
  return status as any;
};

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: string;
  orderDate: string;
  expectedDate: string;
  status: "pending" | "approved" | "completed" | "cancelled" | "in_transit";
  totalAmount: number;
  items: number;
}

export const getPurchaseOrdersData = (): PurchaseOrder[] => {
  return purchaseOrders.map(po => {
    const vendor = getVendorById(po.vendor);
    return {
      id: po.id,
      poNumber: po.poNumber,
      vendor: vendor?.name || 'Unknown Vendor',
      orderDate: po.orderDate,
      expectedDate: po.expectedDate,
      status: mapPOStatus(po.status),
      totalAmount: po.totalAmount,
      items: po.items.length
    };
  });
};

export const getVendorNames = (): string[] => {
  return vendors.map(v => v.name);
};

export const getProductNames = (): string[] => {
  return products.map(p => p.name);
};

// ============================================
// SALES ORDERS PAGE DATA
// ============================================

// Status mapping helper
const mapSOStatus = (status: string): "pending" | "approved" | "completed" | "cancelled" | "in_transit" | "delivered" => {
  if (status === "shipped") return "in_transit";
  if (status === "delivered") return "delivered";
  if (status === "pending") return "pending";
  if (status === "completed") return "completed";
  return status as any;
};

export interface SalesOrder {
  id: string;
  soNumber: string;
  customer: string;
  orderDate: string;
  deliveryDate: string;
  status: "pending" | "approved" | "completed" | "cancelled" | "in_transit" | "delivered";
  totalAmount: number;
  items: number;
}

export const getSalesOrdersData = (): SalesOrder[] => {
  return salesOrders.map(so => {
    const customer = getCustomerById(so.customer);
    return {
      id: so.id,
      soNumber: so.soNumber,
      customer: customer?.name || 'Unknown Customer',
      orderDate: so.orderDate,
      deliveryDate: so.deliveryDate,
      status: mapSOStatus(so.status),
      totalAmount: so.totalAmount,
      items: so.items.length
    };
  });
};

export const getCustomerNames = (): string[] => {
  return customers.map(c => c.name);
};

// ============================================
// GRN PAGE DATA
// ============================================
export interface GRNRecord {
  id: string;
  grnNumber: string;
  poNumber: string;
  vendor: string;
  receiptDate: string;
  receivedBy: string;
  status: string;
  items: Array<{
    product: string;
    orderedQty: number;
    receivedQty: number;
    status: string;
  }>;
}

export const getGRNData = (): GRNRecord[] => {
  return goodsReceiptNotes.map(grn => {
    const po = getPurchaseOrderById(grn.purchaseOrder);
    const vendor = getVendorById(grn.vendorId);
    
    return {
      id: grn.id,
      grnNumber: grn.grnNumber,
      poNumber: po?.poNumber || 'Unknown PO',
      vendor: vendor?.name || 'Unknown Vendor',
      receiptDate: grn.receiptDate,
      receivedBy: grn.receivedBy,
      status: grn.status,
      items: grn.items.map(item => {
        const product = getProductById(item.productId);
        return {
          product: product?.name || 'Unknown Product',
          orderedQty: item.orderedQty,
          receivedQty: item.receivedQty,
          status: item.status
        };
      })
    };
  });
};

export const getPendingPOs = () => {
  return purchaseOrders
    .filter(po => po.status === 'pending' || po.status === 'in_transit')
    .map(po => {
      const vendor = getVendorById(po.vendor);
      return {
        poNumber: po.poNumber,
        vendor: vendor?.name || 'Unknown',
        expectedDate: po.expectedDate
      };
    });
};

// ============================================
// DISPATCH PAGE DATA
// ============================================
export interface DispatchRecord {
  id: string;
  dispatchNumber: string;
  soNumber: string;
  customer: string;
  dispatchDate: string;
  deliveryDate: string;
  carrier: string;
  trackingNumber: string;
  status: string;
  items: Array<{
    product: string;
    quantity: number;
  }>;
}

export const getDispatchData = (): DispatchRecord[] => {
  return dispatchRecords.map(dispatch => {
    const so = getSalesOrderById(dispatch.salesOrder);
    const customer = getCustomerById(dispatch.customerId);
    
    return {
      id: dispatch.id,
      dispatchNumber: dispatch.dispatchNumber,
      soNumber: so?.soNumber || 'Unknown SO',
      customer: customer?.name || 'Unknown Customer',
      dispatchDate: dispatch.dispatchDate,
      deliveryDate: dispatch.deliveryDate,
      carrier: dispatch.carrier,
      trackingNumber: dispatch.trackingNumber,
      status: dispatch.status,
      items: dispatch.items.map(item => {
        const product = getProductById(item.productId);
        return {
          product: product?.name || 'Unknown Product',
          quantity: item.quantity
        };
      })
    };
  });
};

export const getPendingSOs = () => {
  return salesOrders
    .filter(so => so.status === 'processing' || so.status === 'pending')
    .map(so => {
      const customer = getCustomerById(so.customer);
      return {
        soNumber: so.soNumber,
        customer: customer?.name || 'Unknown',
        orderDate: so.orderDate
      };
    });
};

// ============================================
// FINANCIAL MANAGEMENT PAGE DATA
// ============================================
export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: "vendor" | "customer";
  party: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: string;
  approvalStatus: string;
  approvalLevel?: number;
  totalApprovalLevels?: number;
  lineItems?: Array<{
    id: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    total: number;
    description?: string;
  }>;
  payments?: Array<{
    id: string;
    paymentNumber: string;
    paymentDate: string;
    amount: number;
    method: string;
    reference: string;
    status: string;
    recordedBy: string;
  }>;
  approvalHistory?: Array<{
    level: number;
    approver: string;
    action: string;
    date?: string;
    comments?: string;
  }>;
}

export const getInvoicesData = (): Invoice[] => {
  return invoices.map(invoice => {
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

    // Mock approval history
    const approvalHistory = invoice.approvalLevel && invoice.totalApprovalLevels ? 
      Array.from({ length: invoice.totalApprovalLevels }, (_, i) => ({
        level: i + 1,
        approver: i === 0 ? "John Smith (Finance Manager)" : "Sarah Johnson (CFO)",
        action: i < invoice.approvalLevel! ? "approved" : "pending",
        date: i < invoice.approvalLevel! ? invoice.issueDate : undefined,
        comments: i < invoice.approvalLevel! ? "Approved" : undefined
      })) : [];

    // Mock payments
    const payments = invoice.paidAmount > 0 ? [{
      id: `pay-${invoice.id}`,
      paymentNumber: `PAY-2024-00${invoice.id.split('-')[1]}`,
      paymentDate: invoice.issueDate,
      amount: invoice.paidAmount,
      method: "Bank Transfer",
      reference: `TRF-${Math.random().toString().substring(2, 8)}`,
      status: "completed",
      recordedBy: "Jane Doe"
    }] : [];

    return {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      type: invoice.type,
      party: party?.name || "Unknown",
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      amount: invoice.amount,
      paidAmount: invoice.paidAmount,
      status: invoice.status,
      approvalStatus: invoice.approvalStatus,
      approvalLevel: invoice.approvalLevel,
      totalApprovalLevels: invoice.totalApprovalLevels,
      lineItems,
      payments,
      approvalHistory
    };
  });
};
