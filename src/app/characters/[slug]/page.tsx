"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import CardCollection from "@/components/main-page/card-collection";
import VoiceActorCard from "@/components/voice-actor-card";
import { API_BASE_URL } from "@/config";

function mapGender(gender: string | null | undefined) {
  if (!gender) return "-";
  if (gender === "male") return "Чоловік";
  if (gender === "female") return "Жінка";
  return gender;
}

function calculateAge(birthDate: string | null): number | null {
  if (!birthDate) return null;
  const date = new Date(birthDate);
  if (isNaN(date.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const m = today.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  return age;
}

interface VoiceActorCardData {
  id: string;
  name: string;
  image: string;
  animeTitle: string;
  animeImage: string;
}

export default function CharacterPage({
  params,
}: {
  params: { slug: string };
}) {
  const [character, setCharacter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function fetchCharacter() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}people/${params.slug}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Помилка завантаження персонажа");
        const json = await res.json();
        if (!ignore) setCharacter(json.data);
      } catch (e: any) {
        if (!ignore) setError(e.message || "Помилка");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchCharacter();
    return () => {
      ignore = true;
    };
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-lg text-zinc-400">
        Завантаження персонажа...
      </div>
    );
  }

  if (error || !character || character.type !== "Персонаж") {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-lg text-red-400">
        {error || "Персонажа не знайдено"}
      </div>
    );
  }

  const mappedCharacter = {
    name: character.name,
    originalName: character.original_name || "",
    image: character.image,
    age: calculateAge(character.birth_date || null),
    gender: mapGender(character.gender),
    aliases: Array.isArray(character.aliases)
      ? character.aliases.join(", ")
      : character.aliases,
    bio: character.biography || "-",
    birthplace: character.birthplace || null,
    birth_date: character.birth_date || null,
  };

  const mappedAnimes = (character.animes || []).map((anime: any) => ({
    image: anime.poster || anime.poster_url || "",
    title: anime.name || anime.title || "",
    year:
      anime.year ||
      (anime.first_air_date
        ? Number(anime.first_air_date.slice(0, 4))
        : undefined),
    type: anime.kind || "-",
    rating: anime.imdb_score ?? null,
    href: "/anime/" + (anime.slug || anime.id),
    showRank: false,
    small: true,
  }));

  const voiceActorCards: VoiceActorCardData[] = (character.animes || [])
    .filter((anime: any) => anime.voice_actor)
    .map((anime: any) => ({
      id: anime.voice_actor.id,
      name: anime.voice_actor.name,
      image: anime.voice_actor.image,
      animeTitle: anime.name || anime.title || "",
      animeImage: anime.poster || anime.poster_url || "",
    }));

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-12">
      <div className="flex flex-col gap-12 md:flex-row">
        <div className="flex flex-shrink-0 justify-center md:block">
          <div className="relative h-[360px] w-[260px] overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-lg">
            <Image
              src={mappedCharacter.image}
              alt={mappedCharacter.name}
              width={260}
              height={360}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
        </div>
        <div className="flex max-w-3xl flex-1 flex-col gap-2">
          <h1 className="mb-1 text-3xl font-bold text-white md:text-4xl">
            {mappedCharacter.name}
          </h1>
          <div className="mb-4 text-lg text-zinc-400">
            {mappedCharacter.originalName}
          </div>
          <div className="mb-2 flex items-center gap-3">
            <span className="text-xl font-semibold text-white">Опис</span>
          </div>
          <div className="mb-2 flex flex-col gap-1 text-base text-zinc-300">
            {mappedCharacter.birthplace && (
              <div>
                <span className="font-semibold text-white">
                  Місце народження:
                </span>{" "}
                {mappedCharacter.birthplace}
              </div>
            )}
            {mappedCharacter.birth_date && (
              <div>
                <span className="font-semibold text-white">
                  Дата народження:
                </span>{" "}
                {mappedCharacter.birth_date}
              </div>
            )}
            {mappedCharacter.age !== null && (
              <div>
                <span className="font-semibold text-white">Вік:</span>{" "}
                {mappedCharacter.age} років
              </div>
            )}
            {mappedCharacter.gender && (
              <div>
                <span className="font-semibold text-white">Стать:</span>{" "}
                {mappedCharacter.gender}
              </div>
            )}
          </div>
          <div className="mt-2 mb-2 text-base leading-relaxed whitespace-pre-line text-zinc-200">
            {mappedCharacter.bio}
          </div>

          <div>
            <CardCollection
              title="Аніме"
              items={mappedAnimes}
              cardType="top-anime"
            />

            {voiceActorCards.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-4 text-2xl font-bold text-white">
                  Озвучення персонажа
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {voiceActorCards.map((actor, idx) => (
                    <VoiceActorCard
                      key={actor.id || idx}
                      name={actor.name}
                      image={actor.image}
                      title={actor.animeTitle}
                      animeImage={actor.animeImage}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
