"use client";

import { useEffect, useState } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

export default function Toast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleToast = (e: CustomEvent) => {
      const { message, type } = e.detail;
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };

    window.addEventListener("showToast", handleToast as EventListener);
    return () => {
      window.removeEventListener("showToast", handleToast as EventListener);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-6 py-3 rounded-lg shadow-lg text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          } animate-slide-in`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export const showToast = (message: string, type: "success" | "error" = "success") => {
  window.dispatchEvent(new CustomEvent("showToast", { detail: { message, type } }));
};
