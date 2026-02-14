// types/product.ts หรือประกาศในไฟล์ Products.tsx
export interface Product {
  product_id: string; // เพราะเราแปลง BigInt เป็น String ใน API
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  created_at?: string;
  updated_at?: string;
}