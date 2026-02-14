import { Product } from "./product";

export interface CartItem {
  item_id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  products?: Product;
}

export interface Cart {
  cart_id: string;
  user_id: string;
  status: 'active' | 'checked_out';
  cart_items: CartItem[];
  created_at: string;
  updated_at: string;
}