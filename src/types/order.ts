export type OrderStatus =
  | "purchased"
  | "pending"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface DeliveryInfo {
  city: string;
  address: string;
  fullName: string;
  contactPhone: string;
  deliveryInstructions: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

export interface Order {
  id: number;
  created_at: string;
  user_id: string;
  products: Product[];
  delivery_info: DeliveryInfo;
  status: OrderStatus;
  total_items: number;
  delivery_fee: number;
  subtotal: number;
}

export interface CustomOrder {
  id: number;
  created_at: string;
  p_name: string;
  p_description: string;
  p_notes: string;
  p_link: string | null;
  p_image_id: string | null;
  user_id: string;
  delivery_info: DeliveryInfo;
  status: OrderStatus;
  p_image_path: string | null;
  p_image_url: string | null;
}
