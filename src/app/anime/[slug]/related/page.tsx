"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import AnimePosterSection from "@/components/anime-page/AnimePosterSection";
import AnimeMainInfoSection from "@/components/anime-page/AnimeMainInfoSection";
import CardCollection from "@/components/main-page/card-collection";
import { API_BASE_URL } from "@/config";

interface RelatedAnime {
  id: string;
  slug: string;
  name: string;
  poster: string;
  imdb_score?: number;
  duration?: number;
  duration_formatted?: string;
  episodes_count?: number;
  seasons_count?: number;
  kind?: string;
  relation_type: string;
  year?: number;
  href?: string;
}

interface AnimeBasicInfo {
  id: string;
  slug: string;
  name: string;
  poster: string;
  description?: string;
}

export default function RelatedAnimePage() {
  const params = useParams();
  const slug = params && typeof params.slug === "string" ? params.slug : "";

  const [related, setRelated] = useState<RelatedAnime[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [anime, setAnime] = useState<AnimeBasicInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        const [animeResponse, tagsRes, relatedResponse] = await Promise.all([
          fetch(`${API_BASE_URL}animes/${slug}`, { cache: "no-store" }),
          fetch(`${API_BASE_URL}animes/${slug}/tags`, { cache: "no-store" }),
          fetch(`${API_BASE_URL}animes/${slug}/related`, { cache: "no-store" }),
        ]);

        if (!animeResponse.ok) {
          throw new Error(`Помилка завантаження аніме: ${animeResponse.status}`);
        }

        if (!relatedResponse.ok) {
          throw new Error(`Помилка завантаження пов'язаних аніме: ${relatedResponse.status}`);
        }

        const animeData = await animeResponse.json();
        const tagsJson = await tagsRes.json();
        const relatedData = await relatedResponse.json();

        console.log("Отримані дані аніме:", animeData);
        console.log("Отримані пов'язані аніме:", relatedData);

        setAnime(animeData.data || animeData);
        setTags(tagsJson.data || []);
        setRelated(relatedData.data || []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err instanceof Error ? err.message : "Помилка завантаження");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  // Функція для форматування relation_type
  const formatRelationType = (relationType: string): string => {
    const typeLabels: Record<string, string> = {
      'sequel': 'Продовження',
      'prequel': 'Приквел',
      'side_story': 'Побічна історія',
      'spin_off': 'Спін-оф',
      'alternative': 'Альтернативна версія',
      'adaptation': 'Адаптація',
      'summary': 'Резюме',
      'other': 'Інше',
      'season': 'Сезон',
      'special': 'Спеціальний епізод',
      'movie': 'Фільм',
      'ova': 'OVA',
      undefined: 'Сезон', // Якщо тип не знайдено, повертаємо як є
    };

    return typeLabels[relationType] || relationType;
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 md:flex-row">
          <AnimePosterSection 
            animeId="" 
            poster="" 
            name="Завантаження..." 
            isLoading={true} 
          />
          <div className="flex flex-1 flex-col gap-3">
            <div className="text-center text-white">Завантаження пов'язаних аніме...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen w-full text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 md:flex-row">
          <div className="text-center text-white">
            {error || "Помилка завантаження даних"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 md:flex-row">
        {/* Left: Poster + кнопки */}
        <AnimePosterSection 
          poster={anime.poster} 
          name={anime.name} 
          animeId={anime.id} 
          isLoading={false} 
        />
        
        {/* Center: Інформація та пов'язані аніме */}
        <div className="flex flex-1 flex-col gap-3">
          {/* AnimeMainInfoSection для тегів */}
          <AnimeMainInfoSection
            anime={anime}
            tags={tags}
            description={anime.description || ""}
            isLoading={false}
            isMainPage={false}
          />
          
          {/* Пов'язані аніме */}
          {related.length === 0 ? (
            <section className="mx-auto w-full max-w-2xl">
              <h2 className="mb-4 text-xl font-semibold text-white">Пов'язані аніме</h2>
              <div className="text-[#888]">Пов'язані аніме поки не додані 😔</div>
            </section>
          ) : (
            <section className="w-full max-w-4xl">
              <h2 className="mb-6 text-2xl font-bold text-white">Пов'язані аніме</h2>
              
              {/* Групуємо за типом зв'язку */}
              {Object.entries(
                related.reduce((groups, anime) => {
                  const type = anime.relation_type;
                  if (!groups[type]) groups[type] = [];
                  groups[type].push(anime);
                  return groups;
                }, {} as Record<string, RelatedAnime[]>)
              ).map(([relationType, animes]) => (
                <div key={relationType} className="mb-8">
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    {formatRelationType(relationType)} ({animes.length})
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {animes.map((relatedAnime) => (
                      <div key={relatedAnime.id} className="group">
                        <a href={`/anime/${relatedAnime.slug}`} className="block">
                          <div className="relative overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 transition-transform group-hover:scale-105">
                            <Image
                              src={relatedAnime.poster}
                              alt={relatedAnime.name}
                              width={200}
                              height={280}
                              className="h-[280px] w-full object-cover"
                              unoptimized
                            />
                            
                            {/* Overlay з інформацією */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            
                            {/* Інформація внизу */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 transition-opacity group-hover:opacity-100">
                              {relatedAnime.imdb_score && (
                                <div className="mb-1 flex items-center gap-1 text-xs">
                                  <span className="text-yellow-400">⭐</span>
                                  <span>{relatedAnime.imdb_score}</span>
                                </div>
                              )}
                              {relatedAnime.year && (
                                <div className="text-xs text-gray-300">
                                  {relatedAnime.year} • {relatedAnime.kind}
                                </div>
                              )}
                              {relatedAnime.episodes_count && (
                                <div className="text-xs text-gray-300">
                                  {relatedAnime.episodes_count} епізодів
                                </div>
                              )}
                              {relatedAnime.duration_formatted && (
                                <div className="text-xs text-gray-300">
                                  {relatedAnime.duration_formatted}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Назва під постером */}
                          <div className="mt-2 px-1">
                            <h4 className="text-sm font-medium text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
                              {relatedAnime.name}
                            </h4>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}