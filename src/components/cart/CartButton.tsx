import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../../api/axios";

export default function CartButton() {
  const [cartCount, setCartCount] = useState<number>(0);
  const navigate = useNavigate();

  const fetchCartCount = async () => {
    try {
      const { data } = await api.get<{ count: number }>("/cart/count");
      setCartCount(data.count);
    } catch (error) {
      console.error("Failed to fetch cart count");
    }
  };

  useEffect(() => {
    fetchCartCount();
    // เทคนิค: ฟัง Event 'cart-updated' เพื่ออัปเดตเลขทันทีเมื่อมีการกดเพิ่มสินค้าจากหน้าอื่น
    window.addEventListener("cart-updated", fetchCartCount);
    return () => window.removeEventListener("cart-updated", fetchCartCount);
  }, []);

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <div className="relative mr-2">
    <button
      className="relative flex items-center justify-center text-gray-500 transition-all bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white active:scale-90"
      onClick={handleCartClick}
      title="View Shopping Cart"
    >
      {/* Badge แสดงจำนวนสินค้า */}
      {cartCount > 0 && (
        <span
          className="absolute -top-1 -right-1 z-10 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white shadow-sm"
        >
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}

      {/* Cart Icon */}
      <svg 
        className="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z" 
        />
      </svg>
    </button>
  </div>
  );
}
