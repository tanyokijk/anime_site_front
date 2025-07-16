"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import CardCollection from "@/components/main-page/card-collection";
import { API_BASE_URL } from "@/config";

export default function PersonPage({ params }: { params: { slug: string } }) {
  const [person, setPerson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    let ignore = false;
    async function fetchPerson() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}people/${params.slug}`);
        if (!res.ok) throw new Error("Помилка завантаження автора");
        const json = await res.json();
        console.log("API response:", json);
        if (!ignore) setPerson(json.data);
      } catch (e: any) {
        if (!ignore) setError(e.message || "Помилка");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchPerson();
    return () => {
      ignore = true;
    };
  }, [params.slug]);



  if (loading) {
    return <div className="text-center text-white py-20">Завантаження...</div>;
  }

   if (error || !person) {
    return (
      <div className="text-center text-red-500 py-20">
        {error || "Автор не знайдений"}
      </div>
    );
  }

  const isVoiceActor = person.type === "Актор озвучення";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 text-white">
      <div className="flex flex-col md:flex-row gap-10 mb-10">
        <div className="w-full max-w-[240px] mx-auto md:mx-0">
          <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-zinc-600 shadow-lg">
            <Image
              src={person.image || "/assets/default-image.jpg"}
              alt={person.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{person.name}</h1>
          {person.original_name && (
            <p className="text-zinc-400 mb-4">{person.original_name}</p>
          )}
          {person.birthplace && (
              <div>
                <span className="font-semibold text-white">
                  Місце народження:
                </span>{" "}
                {person.birthplace}
              </div>
            )}
          {person.birth_date && (
            <p className="text-zinc-300">Дата народження: {person.birth_date}</p>
          )}
          {person.gender && (
            <p className="text-zinc-300">Стать: {person.gender}</p>
          )}
          {person.type && (
            <p className="text-zinc-300">Професія: {person.type}</p>
          )}
          {person.biography && (
            <p className="text-zinc-300 mt-4 whitespace-pre-line">
              {person.biography}
            </p>
          )}
        </div>
      </div>

      {person.animes && person.animes.length > 0 ? (
  <>
    <h2 className="text-2xl font-semibold mb-6">Аніме</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {person.animes.map((anime: any) => (
        <div
          key={anime.id}
          className="bg-zinc-900 p-4 rounded-xl shadow"
        >
          <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden mb-3">
            <Image
              src={anime.poster || "/assets/default-image.jpg"}
              alt={anime.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="text-lg font-semibold mb-1">
            {anime.title}
          </div>
          {isVoiceActor && anime.character_name && (
            <div className="text-zinc-400 text-sm">
              Персонаж:{" "}
              <span className="text-white">{anime.character_name}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  </>
) : (
  <div className="text-zinc-400">Немає аніме</div>
)}
    </div>
  );
}
 