"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import AnimePosterSection from "@/components/anime-page/AnimePosterSection";
import AnimeMainInfoSection from "@/components/anime-page/AnimeMainInfoSection";
import CardCollection from "@/components/main-page/card-collection";
import { API_BASE_URL } from "@/config";

interface MediaItem {
  url: string;
  type?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
}

interface MediaData {
  [type: string]: MediaItem[];
}

interface AnimeBasicInfo {
  id: string;
  slug: string;
  name: string;
  poster: string;
  description?: string;
  attachments?: MediaItem[]; // може бути в основних даних
}

export default function MediaAnimePage() {
  const params = useParams();
  const slug = params && typeof params.slug === "string" ? params.slug : "";

  const [media, setMedia] = useState<MediaData>({});
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
        const [animeResponse, tagsRes, mediaResponse] = await Promise.all([
          fetch(`${API_BASE_URL}animes/${slug}`, { cache: "no-store" }),
          fetch(`${API_BASE_URL}animes/${slug}/tags`, { cache: "no-store" }),
          fetch(`${API_BASE_URL}animes/${slug}/media`, { cache: "no-store" }),
        ]);

        if (!animeResponse.ok) {
          throw new Error(`Помилка завантаження аніме: ${animeResponse.status}`);
        }

        if (!mediaResponse.ok) {
          throw new Error(`Помилка завантаження медіа: ${mediaResponse.status}`);
        }

        const animeData = await animeResponse.json();
        const tagsJson = await tagsRes.json();
        const mediaData = await mediaResponse.json();

        console.log("Отримані дані аніме:", animeData);
        console.log("Отримані медіа:", mediaData);

        setAnime(animeData.data || animeData);
        setTags(tagsJson.data || []);
        
        // Перевіряємо різні можливі формати відповіді
        const mediaContent = mediaData.data || mediaData.attachments || mediaData || {};
        setMedia(mediaContent);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err instanceof Error ? err.message : "Помилка завантаження");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  // Функція для форматування типу медіа
  const formatMediaType = (type: string): string => {
    const typeLabels: Record<string, string> = {
      'image': 'Зображення',
      'trailer': 'Трейлери',
      'video': 'Відео',
      'screenshot': 'Скріншоти',
      'poster': 'Постери',
      'character': 'Персонажі',
      'promotional': 'Промо матеріали',
      'wallpaper': 'Шпалери',
      'cover': 'Обкладинки',
      'art': 'Арт',
      'logo': 'Логотипи',
    };

    return typeLabels[type.toLowerCase()] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Функція для визначення чи це відео
  const isVideo = (url: string, type?: string): boolean => {
    return type === 'trailer' || type === 'video' || 
           url.includes('youtube.com') || url.includes('youtu.be') ||
           url.includes('.mp4') || url.includes('.webm') || url.includes('.mov');
  };

  // Функція для отримання thumbnail з YouTube URL
  const getYouTubeThumbnail = (url: string): string => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId[1]}/hqdefault.jpg`;
    }
    return url;
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
            <div className="text-center text-white">Завантаження медіа...</div>
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
          animeId={anime.id} 
          poster={anime.poster} 
          name={anime.name} 
          isLoading={false} 
        />
        
        {/* Center: Інформація та медіа */}
        <div className="flex flex-1 flex-col gap-3">
          {/* AnimeMainInfoSection для тегів */}
          <AnimeMainInfoSection
            anime={anime}
            tags={tags}
            description={anime.description || ""}
            isLoading={false}
            isMainPage={false}
          />
          
          {/* Медіа */}
          {Object.keys(media).length === 0 ? (
            <section className="mx-auto w-full max-w-2xl">
              <h2 className="mb-4 text-xl font-semibold text-white">Медіа</h2>
              <div className="text-[#888]">Медіа поки не додані 😔</div>
            </section>
          ) : (
            <section className="w-full max-w-6xl">
              <h2 className="mb-6 text-2xl font-bold text-white">
                Медіа ({Object.values(media).flat().length})
              </h2>
              
              {/* Групуємо медіа за типами */}
              {Object.entries(media).map(([type, items]) => (
                <div key={type} className="mb-8">
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    {formatMediaType(type)} ({items.length})
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {items.map((item, index) => (
                      <div key={`${type}-${index}`} className="group">
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <div className="relative overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 transition-transform group-hover:scale-105">
                            {isVideo(item.url, item.type) ? (
                              // Відео контент
                              <>
                                <Image
                                  src={item.thumbnail || getYouTubeThumbnail(item.url) || "/default-video.png"}
                                  alt={item.title || `${type} ${index + 1}`}
                                  width={200}
                                  height={150}
                                  className="h-[150px] w-full object-cover"
                                  unoptimized
                                />
                                {/* Іконка відтворення */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white">
                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M8 5v14l11-7z"/>
                                    </svg>
                                  </div>
                                </div>
                              </>
                            ) : (
                              // Зображення
                              <Image
                                src={item.url}
                                alt={item.title || `${type} ${index + 1}`}
                                width={200}
                                height={150}
                                className="h-[150px] w-full object-cover transition-transform group-hover:scale-110"
                                unoptimized
                              />
                            )}
                            
                            {/* Overlay з типом медіа */}
                            <div className="absolute top-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                              {formatMediaType(type)}
                            </div>
                            
                            {/* Назва, якщо є */}
                            {item.title && (
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                <p className="text-xs text-white line-clamp-2">
                                  {item.title}
                                </p>
                              </div>
                            )}
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Debug інформація (тільки в development) */}
              
            </section>
          )}
        </div>
      </div>
    </div>
  );
}