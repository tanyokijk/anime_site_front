"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import AnimePosterSection from "@/components/anime-page/AnimePosterSection";
import AnimeMainInfoSection from "@/components/anime-page/AnimeMainInfoSection";
import CardCollection from "@/components/main-page/card-collection";
import { API_BASE_URL } from "@/config";

interface Author {
  name: string;
  type: string;
  originalName?: string | null;
  gender?: string | null;
  image?: string | null;
  description?: string | null;
  birthday?: string | null;
  birthplace?: string | null;
  slug?: string | null;
  role?: string; // роль автора (мангака, режисер, тощо)
  birthdate?: string | null;
}

interface AnimeBasicInfo {
  id: string;
  slug: string;
  name: string;
  poster: string;
  description?: string;
  people: {
    authors: Author[];
    characters: any[];
  };
}

export default function AuthorsAnimePage() {
  const params = useParams();
  const slug = params && typeof params.slug === "string" ? params.slug : "";

  const [authors, setAuthors] = useState<Author[]>([]);
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
        const [animeResponse, tagsRes] = await Promise.all([
          fetch(`${API_BASE_URL}animes/${slug}`, { cache: "no-store" }),
          fetch(`${API_BASE_URL}animes/${slug}/tags`, { cache: "no-store" }),
        ]);

        if (!animeResponse.ok) {
          throw new Error(`Помилка завантаження аніме: ${animeResponse.status}`);
        }

        const animeData = await animeResponse.json();
        const tagsJson = await tagsRes.json();

        console.log("Отримані дані аніме:", animeData);
        console.log("Автори:", animeData.data?.people?.authors);

        setAnime(animeData.data || animeData);
        setTags(tagsJson.data || []);
        setAuthors(animeData.data?.people?.authors || []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err instanceof Error ? err.message : "Помилка завантаження");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  // Функція для форматування ролі автора
  const formatAuthorRole = (type: string): string => {
    const roleLabels: Record<string, string> = {
      'manga_author': 'Автор манги',
      'original_creator': 'Оригінальний автор',
      'director': 'Режисер',
      'screenplay': 'Сценарист',
      'character_design': 'Дизайнер персонажів',
      'music': 'Композитор',
      'producer': 'Продюсер',
      'studio': 'Студія',
      'author': 'Автор',
      'creator': 'Творець',
      'writer': 'Письменник',
    };

    return roleLabels[type.toLowerCase()] || type;
  };

  // Helper функція для перекладу статі
  const translateGender = (gender: string): string => {
    switch (gender.toLowerCase()) {
      case 'male': return 'Чоловік';
      case 'female': return 'Жінка';
      case 'other': return 'Інше';
      default: return gender;
    }
  };

  // Функція для форматування додаткової інформації про автора
  const getAuthorInfo = (author: Author): string => {
    const info: string[] = [];
    
    if (author.gender) {
      info.push(translateGender(author.gender));
    }
    
    if (author.birthday || author.birthdate) {
      const birthDate = new Date(author.birthday || author.birthdate || '');
      if (!isNaN(birthDate.getTime())) {
        const year = birthDate.getFullYear();
        info.push(`${year} р.н.`);
      }
    }
    
    if (author.birthplace) {
      info.push(author.birthplace);
    }
    
    return info.join(' • ');
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
            <div className="text-center text-white">Завантаження авторів...</div>
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
        
        {/* Center: Інформація та автори */}
        <div className="flex flex-1 flex-col gap-3">
          {/* AnimeMainInfoSection для тегів */}
          <AnimeMainInfoSection
            anime={anime}
            tags={tags}
            description={anime.description || ""}
            isLoading={false}
            isMainPage={false}
          />
          
          {/* Автори */}
          {authors.length === 0 ? (
            <section className="mx-auto w-full max-w-2xl">
              <h2 className="mb-4 text-xl font-semibold text-white">Автори</h2>
              <div className="text-[#888]">Автори поки не додані 😔</div>
            </section>
          ) : (
            <section className="w-full max-w-4xl">
              <h2 className="mb-6 text-2xl font-bold text-white">
                Автори ({authors.length})
              </h2>
              
              {/* Групуємо за ролями */}
              {Object.entries(
                authors.reduce((groups, author) => {
                  const role = author.type || 'other';
                  if (!groups[role]) groups[role] = [];
                  groups[role].push(author);
                  return groups;
                }, {} as Record<string, Author[]>)
              ).map(([role, roleAuthors]) => (
                <div key={role} className="mb-8">
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    {formatAuthorRole(role)} ({roleAuthors.length})
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {roleAuthors.map((author, index) => (
                      <div key={`${author.slug || author.name}-${index}`} className="group">
                        <a 
                          href={author.slug ? `/people/${author.slug}` : '#'} 
                          className={`block ${!author.slug ? 'pointer-events-none' : ''}`}
                        >
                          <div className="flex items-center gap-4 rounded-lg border border-zinc-700 bg-zinc-900 p-4 transition-all group-hover:border-zinc-600 group-hover:bg-zinc-800">
                            {/* Аватар автора */}
                            <div className="flex-shrink-0">
                              <Image
                                src={author.image || "/default-author.png"}
                                alt={author.name}
                                width={60}
                                height={60}
                                className="h-15 w-15 rounded-full border border-zinc-600 object-cover"
                                unoptimized
                              />
                            </div>
                            
                            {/* Інформація про автора */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors">
                                {author.name}
                              </h4>
                              
                              {author.originalName && author.originalName !== author.name && (
                                <p className="text-sm text-gray-400 mt-1">
                                  {author.originalName}
                                </p>
                              )}
                              
                              {/* Додаткова інформація */}
                              {getAuthorInfo(author) && (
                                <p className="text-xs text-gray-500 mt-2">
                                  {getAuthorInfo(author)}
                                </p>
                              )}
                              
                              {/* Опис (якщо є) */}
                              {author.description && (
                                <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                                  {author.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Debug інформація (тільки в development) */}
              {/* {process.env.NODE_ENV === 'development' && authors.length > 0 && (
                <div className="mt-8 p-4 bg-gray-800 rounded-lg text-xs">
                  <h4 className="text-white font-semibold mb-2">Debug - Автори:</h4>
                  <pre className="text-gray-300 overflow-auto max-h-40">
                    {JSON.stringify(authors.map(a => ({
                      name: a.name,
                      type: a.type,
                      slug: a.slug,
                      hasImage: !!a.image
                    })), null, 2)}
                  </pre>
                </div>
              )} */}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}