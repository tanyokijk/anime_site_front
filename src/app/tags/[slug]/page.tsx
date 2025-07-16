"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import TopAnimeCard from "@/components/main-page/TopAnimeList/top-anime-card";
import Navbar from "@/components/nav/navbar";
import { useParams } from "next/navigation";

interface Anime {
  id: string;
  slug: string;
  name: string;
  poster: string;
  first_air_date: string;
  kind: string;
  imdb_score: number;
}

const sortOptions = [
  { label: "A-Я", value: "az" },
  { label: "Рейтинг", value: "rating" },
  { label: "Рік", value: "year" },
];

export default function TagPage() {
  const params = useParams();
  const tagSlug = params?.slug?.toString() || "";

  const [tagName, setTagName] = useState<string>("");
  const [sort, setSort] = useState("az");
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const perPage = 20;
  const observer = useRef<IntersectionObserver | null>(null);
  const lastAnimeRef = useRef<HTMLDivElement | null>(null);

  // Infinite scroll handler
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, loading],
  );

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver(handleObserver);
    if (lastAnimeRef.current) observer.current.observe(lastAnimeRef.current);
    return () => observer.current?.disconnect();
  }, [animes, handleObserver]);

  // Fetch tag info and first page on sort/tag change
  useEffect(() => {
    if (!tagSlug) return;
    setLoading(true);
    setError(null);
    setPage(1);
    setAnimes([]);
    setHasMore(true);
    const apiSortMap: Record<string, string> = {
      az: "name",
      rating: "rating",
      year: "year",
    };
    const sortParam = apiSortMap[sort] || "name";
    fetch(
      `http://127.0.0.1:8000/api/v1/tags/${tagSlug}?sort_anime=${sortParam}&page=1&per_page=${perPage}`,
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((json) => {
        setAnimes(json.data.animes || []);
        setHasMore((json.data.animes || []).length >= perPage);
        if (json.data.name) {
          setTagName(json.data.name);
        } else {
          setTagName("Невідомий тег");
        }
      })
      .catch((e) => {
        setError(e.message || "Помилка при завантаженні");
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [tagSlug, sort]);

  // Fetch more animes when page increases (except for first page)
  useEffect(() => {
    if (page === 1 || !tagSlug) return;
    setLoading(true);
    setError(null);
    const apiSortMap: Record<string, string> = {
      az: "name",
      rating: "rating",
      year: "year",
    };
    const sortParam = apiSortMap[sort] || "name";
    fetch(
      `http://127.0.0.1:8000/api/v1/tags/${tagSlug}?sort_anime=${sortParam}&page=${page}&per_page=${perPage}`,
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((json) => {
        setAnimes((prev) => [...prev, ...(json.data.animes || [])]);
        setHasMore((json.data.animes || []).length >= perPage);
      })
      .catch((e) => {
        setError(e.message || "Помилка при завантаженні");
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [page]);

  return (
    <>
      <div className="xs:px-4 min-h-screen px-2 pt-6 pb-16 transition-all sm:px-6 sm:pt-8 md:px-12">
        <h1 className="xs:text-3xl mb-4 text-2xl font-bold text-white">
          Тег - <span className="text-[#4B7FCC]">{tagName}</span>
        </h1>

        <div className="scrollbar-thin scrollbar-thumb-[#232b45] mb-4 flex justify-end overflow-x-auto">
          <select
            className="xs:min-w-[140px] min-w-[120px] rounded-lg border border-[#232b45] bg-[#181f33] px-3 py-2 text-white focus:outline-none"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-red-500">Помилка: {error}</p>}
        <div className="xs:grid-cols-2 grid grid-cols-1 gap-x-4 gap-y-6 transition-all sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {animes.length > 0 ? (
            animes.map((anime, idx) => (
              <TopAnimeCard
                key={anime.slug}
                image={anime.poster}
                title={anime.name}
                year={new Date(anime.first_air_date).getFullYear()}
                type={anime.kind}
                rank={idx + 1}
                rating={anime.imdb_score}
                showRank={false}
                href={`/anime/${anime.slug}`}
                cardClassName="min-w-0 w-auto"
              />
            ))
          ) : (
            <p className="text-white">Аніме не знайдено.</p>
          )}
        </div>
        <div ref={lastAnimeRef} />
        {loading && <p className="mt-4 text-white">Завантаження...</p>}
        {!hasMore && !loading && animes.length === 0 && (
          <p className="mt-4 text-white">Немає аніме за цим тегом.</p>
        )}
      </div>
    </>
  );
}
