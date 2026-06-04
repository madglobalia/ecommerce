"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import CategoryBar from "./CategoryBar";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith("/admin");

  // Show CategoryBar on /products and all /products/category/* pages
  const showCategoryBar =
    pathname === "/products" ||
    pathname?.startsWith("/products/category/");

  return (
    <>
      {!isAdminRoute && <Header />}
      {!isAdminRoute && showCategoryBar && <CategoryBar />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
}
