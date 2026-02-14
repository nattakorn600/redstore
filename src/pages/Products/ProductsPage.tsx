import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ProductCard from "../../components/product/ProductCard";
import { Product } from "../../types/product";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const apptitle = import.meta.env.VITE_APP_TITLE;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_BASE_URL + "/api/products");
        const data = await response.json();
        setProducts(data); 
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <PageMeta title={`Products | ${apptitle}`} description="Product list page" />
      <PageBreadcrumb pageTitle="Products" />
      
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full">
          
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-fit mx-auto">
              {products.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}