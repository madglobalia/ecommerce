"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";
import ProductTable from "@/components/admin/ProductTable";
import { showToast } from "@/components/Toast";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch products", "error");
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      let imageUrl = formData.get("image") as string;
      
      // If image is a file, upload it first
      const imageFile = formData.get("image") as File;
      if (imageFile && imageFile instanceof File) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", imageFile);
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });
        
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.imageUrl;
        } else {
          showToast("Failed to upload image", "error");
          setIsLoading(false);
          return;
        }
      }

      const productData = {
        title: formData.get("title"),
        description: formData.get("description"),
        price: Number(formData.get("price")),
        stock: Number(formData.get("stock")),
        image: imageUrl,
        category: formData.get("category"),
      };

      const url = editingProduct
        ? `/api/products/${editingProduct._id}`
        : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        showToast(
          editingProduct ? "Product updated successfully" : "Product added successfully",
          "success"
        );
        setIsFormOpen(false);
        setEditingProduct(null);
        fetchProducts();
      } else {
        showToast("Failed to save product", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to save product", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showToast("Product deleted successfully", "success");
        fetchProducts();
      } else {
        showToast("Failed to delete product", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to delete product", "error");
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Product
          </button>
        </div>

        {isFormOpen && (
          <ProductForm
            product={editingProduct || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        )}

        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </AdminLayout>
  );
}
