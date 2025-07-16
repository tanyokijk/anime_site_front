"use client";

import React from "react";
import { ViewStatsCard } from "@/components/profile/view-stats-card";
import ProfileBanner from "@/components/profile/profile-banner";
import ProfileCard from "@/components/profile/profile-card";
import AnimeHistory from "@/components/profile/anime-history";
import ActivityBarChart from "@/components/profile/activity-bar-chart";
import AnimeViewTimeChart from "@/components/profile/anime-view-time-chart";
import FavouritesSection from "@/components/profile/favourites-section";
import { useUser } from "@/hooks/useUser";

export default function ProfilePage() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ⚠️ Якщо треба поточний userId — або отримай його з токена, або API має мати /me endpoint
  const { user, isLoading, error } = useUser("me", token || undefined); // або конкретний ID

  if (isLoading) {
    return <div className="text-white text-center py-12">Завантаження...</div>;
  }

  if (error || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Помилка завантаження профілю</h1>
          <p className="text-gray-400">{error || "Не вдалося отримати дані користувача"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:gap-12">
      <ProfileBanner user={user} isLoading={isLoading} />
      <div className="z-1 flex flex-col gap-6 px-2 sm:gap-12 sm:px-4 md:px-6 lg:px-30">
        <h1 className="mb-0 text-[2rem] font-[500] text-white sm:hidden">
          Загальне
        </h1>
        <div className="flex flex-col gap-6 md:w-full md:flex-row md:justify-between">
          <div className="flex-1 max-w-160">
            <ProfileCard user={user} isLoading={isLoading} isOnline={true}/>
          </div>
          <ViewStatsCard user={user} isLoading={isLoading} />
        </div>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="hidden flex-col gap-8 md:max-w-180 xl:flex">
            <h1 className="mb-0 hidden text-[2rem] font-bold text-white md:block">
              Статистика
            </h1>
            <div className="hidden flex-row gap-6 md:gap-18 xl:flex">
              <ActivityBarChart user={user} isLoading={isLoading} />
              <AnimeViewTimeChart user={user} isLoading={isLoading} />
            </div>
            <FavouritesSection user={user} isLoading={isLoading} />
          </div>
          <AnimeHistory user={user} isLoading={isLoading} />
        </div>
      </div>
    </div>

  );
}
