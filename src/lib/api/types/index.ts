export interface Money {
  amount: number;
  currency: string;
}

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: "staff" | "admin" | "owner";
  created_at: string;
  updated_at: string;
  full_name: string;
}

export interface Store {
  id: number;
  name: string;
  slug: string;
  custom_domain: string | null;
  subdomain: string | null;
  description: string;
  currency: string;
  locale: string;
  settings: Record<string, unknown>;
  active: boolean;
  tax_rate: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryList {
  id: number;
  name: string;
  slug: string;
  position: number;
  active: boolean;
  parent_id: number | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  position: number;
  active: boolean;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  children_count: number;
  products_count: number;
}

export interface ProductImage {
  id: number;
  position: number;
  alt_text: string;
  created_at: string;
  updated_at: string;
  url: string | null;
}

export interface Variant {
  id: number;
  name: string;
  sku: string;
  track_inventory: boolean;
  quantity: number;
  options: Record<string, string>;
  position: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  price: Money;
  compare_at_price: Money | null;
}

export interface ProductList {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  sku: string;
  status: ProductStatus;
  featured: boolean;
  quantity: number;
  track_inventory: boolean;
  position: number;
  created_at: string;
  base_price: Money;
  compare_at_price: Money | null;
  category_name: string | null;
  variants_count: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  sku: string;
  barcode: string;
  status: ProductStatus;
  featured: boolean;
  custom_attributes: Record<string, string>;
  quantity: number;
  track_inventory: boolean;
  position: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  base_price: Money;
  compare_at_price: Money | null;
  category: CategoryList | null;
  variants: Variant[];
  images: ProductImage[];
}

export type ProductStatus = "draft" | "active" | "archived";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  id: number;
  product_id: number;
  product_variant_id: number | null;
  product_name: string;
  variant_name: string;
  sku: string;
  quantity: number;
  unit_price: Money;
  total: Money;
}

export interface OrderCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface OrderList {
  id: number;
  order_number: string;
  email: string;
  status: OrderStatus;
  created_at: string;
  total: Money;
  items_count: number;
  customer_name: string | null;
}

export interface Order {
  id: number;
  order_number: string;
  email: string;
  status: OrderStatus;
  shipping_address: Record<string, string>;
  billing_address: Record<string, string>;
  notes: string;
  metadata: Record<string, unknown>;
  placed_at: string;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  subtotal: Money;
  tax: Money;
  total: Money;
  customer: OrderCustomer | null;
  items: OrderItem[];
}

export interface Customer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  accepts_marketing: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  orders_count: number;
}

export interface DashboardData {
  total_products: number;
  total_orders: number;
  total_customers: number;
  total_revenue_cents: number;
  orders_by_status: Record<OrderStatus, number>;
  recent_orders: OrderList[];
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_count: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export type OrderEvent =
  | "confirm"
  | "pay"
  | "process_order"
  | "ship"
  | "deliver"
  | "cancel"
  | "refund";
