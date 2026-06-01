"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Product {
  _id: string;
  title: string;
  price: number;
  description?: string;
}

interface CartProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [wishlist, setWishlist] = useState<CartProduct[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  const addToCart = () => {
    const newProduct: CartProduct = {
      id: product._id,
      title: product.title,
      price: product.price,
      image: "",
      description: product.description || "",
    };
    const exists = cart.find((item) => item.id === product._id);
    if (!exists) {
      const newCart = [...cart, newProduct];
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
      alert(`${product.title} added to cart!`);
    } else {
      alert(`${product.title} is already in cart!`);
    }
  };

  const addToWishlist = () => {
    const newProduct: CartProduct = {
      id: product._id,
      title: product.title,
      price: product.price,
      image: "",
      description: product.description || "",
    };
    const exists = wishlist.find((item) => item.id === product._id);
    if (!exists) {
      const newWishlist = [...wishlist, newProduct];
      setWishlist(newWishlist);
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      alert(`${product.title} added to wishlist!`);
    } else {
      alert(`${product.title} is already in wishlist!`);
    }
  };

  return (
    <div className="border p-4 rounded">
      <h2 className="text-xl font-bold mt-2">
        {product.title}
      </h2>

      <p>${product.price}</p>

      <div className="flex gap-2 mt-3">
        <button
          onClick={addToCart}
          className="bg-black text-white px-3 py-2"
        >
          Add To Cart
        </button>

        <button
          onClick={addToWishlist}
          className="bg-pink-500 text-white px-3 py-2"
        >
          Wishlist
        </button>
      </div>

      <Link href={`/product/${product._id}`}>
        <button className="bg-green-600 text-white px-3 py-2 mt-2 w-full">
          Buy Now
        </button>
      </Link>
    </div>
  );
}