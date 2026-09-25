export type UserRole = 'student' | 'kitchen' | 'admin' | 'principal';

export type CanteenLoad = 'CHILL' | 'BUSY' | 'CHAOTIC';

export type ProductAvailability = 'AVAILABLE' | 'LIMITED' | 'SOLD_OUT' | 'UNAVAILABLE';

export type OrderType = 'DINE_IN' | 'TAKEAWAY';

export type PackagingType = 'NORMAL' | 'ECO';

export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'PICKED_UP' | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type InventoryStatus = 'NORMAL' | 'LOW' | 'CRITICAL' | 'OUT_OF_STOCK';

export interface Canteen {
  id: string;
  name: string;
  location: string;
  is_open: boolean;
  opening_time: string;
  closing_time: string;
  current_load: CanteenLoad;
  avg_prep_time_minutes: number;
}

export interface Category {
  id: string;
  canteen_id: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  canteen_id: string;
  category_id?: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  prep_time_minutes: number;
  is_veg: boolean;
  allergens: string[];
  is_popular: boolean;
  is_featured: boolean;
  stock_quantity: number;
  availability: ProductAvailability;
  rating: number;
  review_count: number;
}

export interface Ingredient {
  id: string;
  canteen_id: string;
  name: string;
  unit: string;
  current_quantity: number;
  min_quantity: number;
  max_quantity: number;
  cost: number;
  supplier: string;
  status: InventoryStatus;
  updated_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface Order {
  id: string;
  canteen_id: string;
  user_id: string;
  user_name: string;
  order_number: string;
  order_type: OrderType;
  table_number?: string;
  packaging_type: PackagingType;
  packaging_fee: number;
  subtotal: number;
  discount: number;
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  pickup_time: string;
  token_code: string;
  qr_code_token: string;
  estimated_ready_time: string;
  actual_ready_time?: string;
  picked_up_at?: string;
  created_at: string;
  items?: OrderItem[];
}

export interface DigitalToken {
  id: string;
  order_id: string;
  token_code: string;
  status: OrderStatus;
  queue_position: number;
  created_at: string;
}

export interface Complaint {
  id: string;
  user_id: string;
  user_name: string;
  order_id?: string;
  category: string;
  description: string;
  evidence_image_url?: string;
  status: 'OPEN' | 'ASSIGNED' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
  admin_notes?: string;
  created_at: string;
}

export interface Feedback {
  id: string;
  order_id: string;
  user_id: string;
  user_name: string;
  rating_food: number;
  rating_prep: number;
  rating_packaging: number;
  rating_service: number;
  overall_rating: number;
  comments?: string;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  max_discount: number;
  min_order_amount: number;
  is_active: boolean;
}

export interface WalletTransaction {
  id: string;
  type: 'DEPOSIT' | 'SPENT';
  amount: number;
  method?: string;
  description: string;
  date: string;
}

