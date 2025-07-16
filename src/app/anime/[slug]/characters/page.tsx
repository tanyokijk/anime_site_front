"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import AnimeCharactersSection from "@/components/anime-page/AnimeCharactersSection";
import AnimePosterSection from "@/components/anime-page/AnimePosterSection";
import AnimeMainInfoSection from "@/components/anime-page/AnimeMainInfoSection";
import Rating from "@/components/ui/rating";
import { API_BASE_URL } from "@/config";
import CardCollection from "@/components/main-page/card-collection";

interface Character {
  slug: string;
  name: string;
  image?: string;
  type: string;
}

interface AnimeBasicInfo {
  id: string;
  slug: string;
  name: string;
  poster: string;
  imdb_score?: number;
  description?: string;
}

export default function CharactersAnimePage() {
  const params = useParams();
  const slug = params && typeof params.slug === 'string' ? params.slug : '';
  
  const [characters, setCharacters] = useState<Character[]>([]);
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
        // Паралельно завантажуємо дані про аніме та персонажів
        const [animeResponse,tagsRes, charactersResponse] = await Promise.all([
          fetch(`${API_BASE_URL}animes/${slug}`, { cache: "no-store" }),
          fetch(`${API_BASE_URL}animes/${slug}/tags`, { cache: "no-store" }),
          fetch(`${API_BASE_URL}animes/${slug}/characters`, { cache: "no-store" })
        ]);
        
        if (!animeResponse.ok) {
          throw new Error(`Помилка завантаження аніме: ${animeResponse.status}`);
        }
        
        if (!charactersResponse.ok) {
          throw new Error(`Помилка завантаження персонажів: ${charactersResponse.status}`);
        }
        
        const animeData = await animeResponse.json();
        const charactersData = await charactersResponse.json();
        const tagsJson = await tagsRes.json();

        setAnime(animeData.data || animeData);
        setTags(tagsJson.data || []);
        setCharacters(charactersData.data || charactersData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err instanceof Error ? err.message : 'Помилка завантаження');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen w-full text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 md:flex-row">
          <AnimePosterSection
            poster=""
            name="Завантаження..."
            isLoading={true}
          />
          <div className="flex flex-1 flex-col gap-3">
            <div className="text-center text-white">Завантаження персонажів...</div>
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
            {error || 'Помилка завантаження даних'}
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
          isLoading={loading}
        />
        {/* Center: Інформація та персонажі */}
        <div className="flex flex-1 flex-col gap-3">
          {/* AnimeMainInfoSection для тегів */}
          <AnimeMainInfoSection
            anime={anime}
            tags={tags}
            description={anime.description || ""}
            isLoading={loading}
            isMainPage={false}
          />
          {/* Персонажі */}
          {characters.length === 0 ? (
            <section className="mx-auto w-full max-w-2xl">
              <h2 className="mb-4 text-xl font-semibold text-white">Персонажі</h2>
              <div className="text-[#888]">Персонажі поки не додані 😔</div>
            </section>
          ) : (
            <section className="w-full max-w-4xl">
              <CardCollection
                items={characters.map((character) => ({
                  ...character,
                  link: `/characters/${character.slug}`,
                }))}
                cardType="author"
                title="Персонажі"
                showButton={false}
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}