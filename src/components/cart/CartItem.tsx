// components/cart/CartItem.tsx
import api from "../../api/axios";
import { CartItem as CartItemType } from "../../types/cart";

interface CartItemProps {
  item: CartItemType;
  onRefresh: () => void;
}

export default function CartItem({ item, onRefresh }: CartItemProps) {
  const { products, quantity, item_id } = item;

  const handleIncrease = async () => {
    try {
      await api.post("/cart/add", { product_id: products?.product_id, quantity: 1 });
      onRefresh();
    } catch (error) {
      alert("Error updating quantity");
    }
  };

  const handleDecrease = async () => {
    try {
      await api.patch(`/cart/items/${item_id}/decrease`);
      onRefresh();
    } catch (error) {
      alert("Error decreasing quantity");
    }
  };

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove this item?")) return;
    try {
      await api.delete(`/cart/items/${item_id}`);
      onRefresh();
    } catch (error) {
      alert("Error removing item");
    }
  };

  const imageUrl = products?.image_url?.startsWith('http') 
        ? products.image_url 
        : `${import.meta.env.VITE_BASE_URL + products?.image_url}`;

  return (
    <li className="py-5">
      <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
        <div className="shrink-0">
          <img 
            className="w-20 h-20 rounded-lg object-cover border border-default" 
            src={imageUrl || "/placeholder.png"} 
            alt={products?.name} 
          />
        </div>

        <div className="flex-1 min-w-[150px]">
          <p className="font-bold text-heading text-base truncate">{products?.name}</p>
          <p className="text-sm text-body mt-1">
            <span className="font-semibold text-heading">
              ฿{Number(products?.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </p>
        </div>

        <div className="flex items-center border border-default rounded-lg bg-white shadow-sm h-10">
          <button 
            onClick={handleDecrease}
            className="px-3 h-full hover:bg-neutral-secondary text-heading border-r border-default transition-colors font-bold"
          >
            -
          </button>
          <span className="px-5 text-sm font-bold text-heading">{quantity}</span>
          <button 
            onClick={handleIncrease}
            className="px-3 h-full hover:bg-neutral-secondary text-heading border-l border-default transition-colors font-bold"
          >
            +
          </button>
        </div>

        <div className="w-28 text-right">
          <p className="text-xs text-body uppercase font-bold tracking-tighter">Total</p>
          <p className="text-lg font-extrabold text-heading">
            ฿{(Number(products?.price) * quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        <button 
          onClick={handleRemove}
          type="button" 
          className="inline-flex items-center justify-center text-fg-danger hover:bg-red-50 rounded-full h-10 w-10 transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </li>
  );
}