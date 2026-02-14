import React, { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import { Product } from "../../types/product";

interface ProductFormProps {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

const initialFormState: Partial<Product> = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
};

export default function ProductFormModal({ product, onClose, onSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>(initialFormState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      const imageUrl = product.image_url?.startsWith('http') 
        ? product.image_url 
        : `${import.meta.env.VITE_BASE_URL + product.image_url}`;
      setFormData(product);
      setPreviewUrl(imageUrl || null); // แสดงรูปเดิมถ้ามี
    } else {
      setFormData(initialFormState);
      setPreviewUrl(null);
    }
  }, [product]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // สร้าง URL สำหรับ Preview รูปภาพก่อน Upload
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // ใช้ FormData เพื่อรองรับการส่งไฟล์
      const data = new FormData();
      data.append("name", formData.name || "");
      data.append("description", formData.description || "");
      data.append("price", String(formData.price || 0));
      data.append("stock", String(formData.stock || 0));
      
      if (selectedFile) {
        data.append("image", selectedFile); // ชื่อ Key "image" ต้องตรงกับ Backend
      }

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      if (product) {
        await api.put(`/products/${product.product_id}`, data, config);
      } else {
        await api.post("/products", data, config);
      }
      
      onSuccess();
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving product. Please check your file size and inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-xl dark:bg-gray-900 overflow-y-auto max-h-[90vh]">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          {product ? "Edit Product" : "Add New Product"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload Section */}
          <div className="flex flex-col items-center justify-center space-y-3 p-4 border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-700">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="h-32 w-32 object-cover rounded-lg shadow-md" />
            ) : (
              <div className="h-32 w-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              {previewUrl ? "Change Image" : "Upload Product Image"}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <input
              name="name"
              type="text" required
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-primary outline-none dark:bg-gray-800 dark:border-gray-700"
              value={formData.name || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              rows={2}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-primary outline-none dark:bg-gray-800 dark:border-gray-700"
              value={formData.description || ""}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price (฿)</label>
              <input
                name="price"
                type="number" required min="0" step="0.01"
                className="w-full rounded-lg border border-gray-300 p-2.5 dark:bg-gray-800 dark:border-gray-700"
                value={formData.price || 0}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock Amount</label>
              <input
                name="stock"
                type="number" required min="0"
                className="w-full rounded-lg border border-gray-300 p-2.5 dark:bg-gray-800 dark:border-gray-700"
                value={formData.stock || 0}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={submitting}
              className="px-5 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              {submitting ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}