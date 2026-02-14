import { useState } from "react";
import { Product } from "../../types/product";
import Button from "../ui/button/Button";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product: initialProduct }: ProductCardProps) {
    const [newProduct, setNewProduct] = useState<Product>(initialProduct);
    const [isUpdating, setIsUpdating] = useState(false);
    const {user} = useAuth();
    const navigate = useNavigate();
    
    const handleAddToCart = async () => {
        if (!user) {
            navigate('/signin');
            return;
        }
            
        if (newProduct.stock <= 0) return;

        setIsUpdating(true);
        try {
            await api.post("/cart/add", {
                product_id: newProduct.product_id,
                quantity: 1,
            });

            const response = await api.get(`/products/${newProduct.product_id}`);
            
            if (response.status === 200 || response.status === 201) {
                window.dispatchEvent(new Event("cart-updated"));
            }

            if (response.data) {
                setNewProduct(response.data);
            }

            // alert("Added to cart!"); 
        
        } catch (error: any) {
            console.error("Cart Error:", error.response?.data || error.message);
            alert(error.response?.data?.error || "Failed to add product to cart");
        } finally {
            setIsUpdating(false);
        }
    };

    const imageUrl = newProduct.image_url?.startsWith('http') 
        ? newProduct.image_url 
        : `${import.meta.env.VITE_BASE_URL + newProduct.image_url}`;

    return (
        <div className="w-full rounded-lg max-w-[320px] bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs flex flex-col justify-between">
            <div>
                <img 
                    className="block overflow-hidden rounded-base mb-4 w-full h-48 object-cover" 
                    src={`${imageUrl}`} 
                    alt="product image" 
                />
                <div className="space-y-2 text-left">
                    <h5 className="text-lg text-heading font-semibold tracking-tight line-clamp-1 hover:text-primary">
                        {newProduct.name}
                    </h5>
                    <p className="text-sm text-body line-clamp-2 leading-relaxed">
                        {newProduct.description}
                    </p>
                </div>
            </div>

            <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-body uppercase font-bold tracking-wider">Price</span>
                        <span className="text-xl font-extrabold text-heading">
                            ฿{Number(newProduct.price).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </span>
                    </div>
                    
                    <div className="flex flex-col text-slate-600">
                        <span className="text-xs text-body uppercase font-bold tracking-wider">Stock</span>
                        <span className="text-base font-normal text-heading">
                            {Number(newProduct.stock).toLocaleString()}
                        </span>
                    </div>
                </div>

                <Button
                    onClick={handleAddToCart} // เรียกใช้ฟังก์ชันเมื่อกดปุ่ม
                    className="w-full h-11 justify-center"
                    size="sm"
                    variant="primary"
                    startIcon={<svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"/></svg>}
                    disabled={newProduct.stock <= 0 || isUpdating} // ปิดปุ่มถ้าของหมดหรือกำลังอัปเดต
                    >
                    {isUpdating ? "Processing..." : newProduct.stock > 0 ? "Add to cart" : "Out of Stock"}
                </Button>
            </div>
        </div>
    );
}