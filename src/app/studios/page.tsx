"use client";

import React, { useState, useEffect } from "react";
import StudioCard from "@/components/studio-card";

interface Studio {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string; // логотип
  animes_count: number;
}

export default function StudiosPage() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudios() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://127.0.0.1:8000/api/v1/studios");

        if (!response.ok) {
          throw new Error(`Помилка завантаження студій: ${response.status}`);
        }

        const data = await response.json();

        // Твій API повертає обʼєкт з ключем data, в якому масив студій
        setStudios(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Невідома помилка");
      } finally {
        setLoading(false);
      }
    }

    fetchStudios();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Завантаження студій...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Помилка: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 pt-10 pb-20 sm:px-8 sm:pt-6 sm:pb-8 md:pt-8 md:pb-14">
      <div className="mb-8 flex items-center justify-between sm:mb-6 sm:flex-col sm:items-start sm:gap-4">
        <h1 className="text-4xl font-bold text-white sm:text-2xl">Студії</h1>
        <div className="flex items-center space-x-2 sm:w-full sm:justify-end sm:gap-2 sm:space-x-0">
          <button className="ml-2 rounded-xl border border-[#232B3A] bg-[#181F2A] px-4 py-2 text-base font-medium text-white focus:ring-2 focus:ring-[#4B7FCC] focus:outline-none">
            А-Я
          </button>
          <button className="ml-2 rounded-xl border border-[#232B3A] bg-[#181F2A] px-4 py-2 text-base font-medium text-white focus:ring-2 focus:ring-[#4B7FCC] focus:outline-none">
            Кількість релізів
          </button>
        </div>
      </div>
      <div className="mt-4 flex w-full justify-center">
        <div
          className="h-0 w-full border-t-[2px]"
          style={{
            borderImageSource:
              "linear-gradient(90deg, rgba(73, 99, 138, 0) 0%, rgba(73, 99, 138, 0.5) 50%, rgba(73, 99, 138, 0) 100%)",
            borderImageSlice: 1,
          }}
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2 md:gap-x-6 md:gap-y-6">
        {studios.map((studio) => (
          <StudioCard
            key={studio.id}
            logo={studio.image}
            name={studio.name}
            description={studio.description}
            releases={studio.animes_count}
            slug={studio.slug}
          />
        ))}
      </div>
    </div>
  );
}
