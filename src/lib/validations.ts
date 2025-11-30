import { z } from "zod";

// Inventory validations
export const inventorySchema = z.object({
  sku: z.string().min(1, "SKU is required").max(50, "SKU is too long"),
  name: z.string().min(1, "Product name is required").max(100, "Name is too long"),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Location is required"),
  currentStock: z.coerce.number().min(0, "Stock cannot be negative"),
  reorderLevel: z.coerce.number().min(0, "Reorder level cannot be negative"),
  unitPrice: z.coerce.number().min(0.01, "Price must be greater than 0"),
});

// Vendor validations
export const vendorSchema = z.object({
  name: z.string().min(1, "Company name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required").regex(/^[+]?[\d\s-()]+$/, "Invalid phone format"),
  address: z.string().optional(),
  paymentTerms: z.string().optional(),
});

// Customer validations
export const customerSchema = z.object({
  name: z.string().min(1, "Company name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required").regex(/^[+]?[\d\s-()]+$/, "Invalid phone format"),
  address: z.string().optional(),
  creditLimit: z.coerce.number().min(0, "Credit limit cannot be negative").optional(),
});

// Purchase Order validations
export const purchaseOrderSchema = z.object({
  vendor: z.string().min(1, "Vendor is required"),
  expectedDate: z.string().min(1, "Expected date is required"),
  lineItems: z.array(
    z.object({
      product: z.string().min(1, "Product is required"),
      quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
      unitPrice: z.coerce.number().min(0.01, "Unit price must be greater than 0"),
    })
  ).min(1, "At least one line item is required"),
});

// Settings validations
export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Name is too long"),
  description: z.string().max(200, "Description is too long").optional(),
});

export const locationSchema = z.object({
  name: z.string().min(1, "Location name is required").max(50, "Name is too long"),
  address: z.string().max(200, "Address is too long").optional(),
  capacity: z.string().max(50, "Capacity is too long").optional(),
});

export const productTypeSchema = z.object({
  name: z.string().min(1, "Product type name is required").max(50, "Name is too long"),
  prefix: z.string().min(1, "Prefix is required").max(5, "Prefix is too long").toUpperCase(),
});

export type InventoryFormData = z.infer<typeof inventorySchema>;
export type VendorFormData = z.infer<typeof vendorSchema>;
export type CustomerFormData = z.infer<typeof customerSchema>;
export type PurchaseOrderFormData = z.infer<typeof purchaseOrderSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type LocationFormData = z.infer<typeof locationSchema>;
export type ProductTypeFormData = z.infer<typeof productTypeSchema>;
