"use client";

import axios from "axios";
import { useState } from "react";

export default function AddProduct() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    category: "",
  });

  const handleSubmit = async () => {
    await axios.post("/api/products", form);

    alert("Product Added");
  };

  return (
    <div className="p-10">
      <input
        placeholder="Title"
        className="border p-2 block mb-3"
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <input
        placeholder="Price"
        className="border p-2 block mb-3"
        onChange={(e) =>
          setForm({ ...form, price: e.target.value })
        }
      />

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-5 py-2"
      >
        Add Product
      </button>
    </div>
  );
}