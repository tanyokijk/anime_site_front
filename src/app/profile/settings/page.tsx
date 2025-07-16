"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/contexts/auth-context";

// Повністю відключаємо SSR для всієї сторінки налаштувань
const SettingsMenu = dynamic(() => import("@/components/settings-menu"), {
  ssr: false,
});

// Також динамічно імпортуємо весь контент
const DynamicContent = dynamic(() => Promise.resolve(() => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  if (!isClient) {
    return (
      <div className="flex min-h-screen w-full overflow-hidden items-center justify-center">
        <div className="text-white text-xl">Завантаження...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full overflow-hidden items-center justify-center">
        <div className="text-white text-xl">Завантаження...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen w-full overflow-hidden items-center justify-center">
        <div className="text-white text-xl">Перенаправлення...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      <SettingsMenu />
    </div>
  );
}), { 
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen w-full overflow-hidden items-center justify-center">
      <div className="text-white text-xl">Ініціалізація...</div>
    </div>
  )
});

export default function ProfileSettingsPage() {
  return <DynamicContent />;
}