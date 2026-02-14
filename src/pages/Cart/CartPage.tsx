// pages/CartPage.tsx
import { useEffect, useState, useCallback } from "react";
import CartItem from "../../components/cart/CartItem";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { Cart } from "../../types/cart";
import api from "../../api/axios";
import { genSalesOrderPDF } from "../../components/cart/generateSalesOrderPDF"
import { useAuth } from "../../context/AuthContext";

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const apptitle = import.meta.env.VITE_APP_TITLE;
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  // ใช้ useCallback เพื่อให้สามารถส่งฟังก์ชันไปที่ลูก (CartItem) ได้โดยไม่เกิด Re-render ที่ไม่จำเป็น
  const fetchCart = useCallback(async () => {
    try {
      const { data } = await api.get<Cart>("/cart");
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleCreateOrder = async () => {
    if (!cart || cart.cart_items.length === 0) return;

    try {
      setIsProcessing(true);

      await api.post('/cart/checkout');

      await genSalesOrderPDF(cart, subtotal, tax, grandTotal, user);

      alert("Sales Order created successfully!");

      await fetchCart();
      
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to create sales order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = cart?.cart_items.reduce((acc, item) => {
    return acc + Number(item.products?.price) * item.quantity;
  }, 0) || 0;

  const tax = subtotal * 0.07;
  const grandTotal = subtotal + tax;

  if (loading) return <div className="p-10 text-center">Loading cart...</div>;

  return (
    <div>
      <PageMeta title={`Cart | ${apptitle}`} description="shopping cart items" />
      <PageBreadcrumb pageTitle="Shopping Cart" />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        {/* Left: Items List */}
        <div className="xl:col-span-2">
          <div className="rounded-2xl border border-default bg-white p-6 shadow-xs min-h-[300px]">
            <div className="flex justify-between items-center mb-6 border-b border-default pb-4">
              <h5 className="text-xl font-bold text-heading">Items in Cart</h5>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                {cart?.cart_items.length || 0} Products
              </span>
            </div>
            
            <ul role="list" className="divide-y divide-default">
              {cart?.cart_items.map((item) => (
                <CartItem 
                  key={item.item_id} 
                  item={item} 
                  onRefresh={fetchCart} // ส่งฟังก์ชันไป refresh ข้อมูล
                />
              ))}
              {cart?.cart_items.length === 0 && (
                <div className="py-20 text-center text-body">Your cart is empty</div>
              )}
            </ul>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="xl:col-span-1">
          <div className="sticky top-6 rounded-2xl border border-default bg-white p-6 shadow-xs space-y-6">
            <h5 className="text-xl font-bold text-heading border-b border-default pb-4">Order Summary</h5>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-body">
                <span className="text-sm">Subtotal</span>
                <span className="font-bold text-heading">฿{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              
              {/* <div className="flex justify-between items-center text-body">
                <span className="text-sm">Shipping & Handling</span>
                <span className="font-bold text-heading">{shipping.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div> */}
              
              <div className="flex justify-between items-center text-body">
                <span className="text-sm">Tax (VAT 7%)</span>
                <span className="font-bold text-heading">฿{tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="border-t border-dashed border-default my-4"></div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm font-bold text-heading uppercase tracking-wider">Grand Total</p>
                  <p className="text-xs text-body italic">*Includes all taxes and fees</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-extrabold text-primary">฿{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              <div className="pt-6 space-y-3">
                <Button 
                  onClick={handleCreateOrder} 
                  className="w-full h-12 justify-center text-base font-bold shadow-md" 
                  variant="primary"
                  disabled={subtotal === 0 || isProcessing}
                >
                  {isProcessing ? "Processing..." : "Create Sales Order"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}