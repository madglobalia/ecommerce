"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// /products pe aane par Electronics category par redirect karo
// CategoryBar har category page pe dikhti hai
export default function ProductsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/products/category/electronics");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );
}
