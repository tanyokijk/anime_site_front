"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function doLogout() {
      await logout();
      router.replace("/register");
    }
    doLogout();
  }, [logout, router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-white">
      Вихід з акаунту...
    </div>
  );
  }