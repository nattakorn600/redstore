import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import api from "../../api/axios";
import ProductFormModal from "../../components/product/ProductFormModal";
import { Product } from "../../types/product";

export default function ProductAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const apptitle = import.meta.env.VITE_APP_TITLE;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        alert("Delete failed");
      }
    }
  };

  return (
    <div>
      <PageMeta title={`Manage Products | ${apptitle}`} description="Product list page" />
      <PageBreadcrumb pageTitle="Product Management" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-6 py-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">All Products</h3>
          <Button variant="primary" size="sm" onClick={handleAddNew}>
            + Add New Product
          </Button>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="border-b border-gray-100 dark:border-gray-800">
              <tr className="text-left">
                <th className="px-6 py-4 font-medium text-gray-500">Image</th>
                <th className="px-6 py-4 font-medium text-gray-500">Product Name</th>
                <th className="px-6 py-4 font-medium text-gray-500">Price</th>
                <th className="px-6 py-4 font-medium text-gray-500">Stock</th>
                <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-10">Loading products...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10">No products found.</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p.product_id}>
                    <td className="px-6 py-4">
                      <img 
                        src={p.image_url?.startsWith('http') ? p.image_url : `${import.meta.env.VITE_BASE_URL + p.image_url}`} 
                        alt={p.name} 
                        className="h-12 w-12 rounded object-cover border border-gray-100" 
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{p.name}</td>
                    <td className="px-6 py-4">฿{Number(p.price).toLocaleString()}</td>
                    <td className="px-6 py-4">{p.stock}</td>
                    <td className="px-6 py-4 text-right space-x-4">
                      <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                      <button onClick={() => handleDelete(p.product_id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ProductFormModal
          product={selectedProduct}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}