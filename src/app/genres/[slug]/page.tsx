"use client";
import React, { useState } from "react";
import TopAnimeCard from "@/components/main-page/TopAnimeList/top-anime-card";
import Navbar from "@/components/nav/navbar";
import Link from "next/link";
import { useParams } from "next/navigation";

const mockAnime = [
  {
    image: "/assets/mock-user-logo.png",
    title: "Проводжальники весни",
    year: 2023,
    type: "TV Серіал",
    rank: 1,
    rating: 9.12,
    slug: "provodzhalnyky-vesny",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Сталевий алхімік",
    year: 2009,
    type: "TV Серіал",
    rank: 2,
    rating: 9.1,
    slug: "stalevyy-alkhimik",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Проводжальники весни",
    year: 2023,
    type: "TV Серіал",
    rank: 1,
    rating: 9.12,
    slug: "provodzhalnyky-vesny",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Сталевий алхімік",
    year: 2009,
    type: "TV Серіал",
    rank: 2,
    rating: 9.1,
    slug: "stalevyy-alkhimik",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Проводжальники весни",
    year: 2023,
    type: "TV Серіал",
    rank: 1,
    rating: 9.12,
    slug: "provodzhalnyky-vesny",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Сталевий алхімік",
    year: 2009,
    type: "TV Серіал",
    rank: 2,
    rating: 9.1,
    slug: "stalevyy-alkhimik",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Проводжальники весни",
    year: 2023,
    type: "TV Серіал",
    rank: 1,
    rating: 9.12,
    slug: "provodzhalnyky-vesny",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Сталевий алхімік",
    year: 2009,
    type: "TV Серіал",
    rank: 2,
    rating: 9.1,
    slug: "stalevyy-alkhimik",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Проводжальники весни",
    year: 2023,
    type: "TV Серіал",
    rank: 1,
    rating: 9.12,
    slug: "provodzhalnyky-vesny",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Сталевий алхімік",
    year: 2009,
    type: "TV Серіал",
    rank: 2,
    rating: 9.1,
    slug: "stalevyy-alkhimik",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Проводжальники весни",
    year: 2023,
    type: "TV Серіал",
    rank: 1,
    rating: 9.12,
    slug: "provodzhalnyky-vesny",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Сталевий алхімік",
    year: 2009,
    type: "TV Серіал",
    rank: 2,
    rating: 9.1,
    slug: "stalevyy-alkhimik",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Проводжальники весни",
    year: 2023,
    type: "TV Серіал",
    rank: 1,
    rating: 9.12,
    slug: "provodzhalnyky-vesny",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Сталевий алхімік",
    year: 2009,
    type: "TV Серіал",
    rank: 2,
    rating: 9.1,
    slug: "stalevyy-alkhimik",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Проводжальники весни",
    year: 2023,
    type: "TV Серіал",
    rank: 1,
    rating: 9.12,
    slug: "provodzhalnyky-vesny",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Сталевий алхімік",
    year: 2009,
    type: "TV Серіал",
    rank: 2,
    rating: 9.1,
    slug: "stalevyy-alkhimik",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Проводжальники весни",
    year: 2023,
    type: "TV Серіал",
    rank: 1,
    rating: 9.12,
    slug: "provodzhalnyky-vesny",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Сталевий алхімік",
    year: 2009,
    type: "TV Серіал",
    rank: 2,
    rating: 9.1,
    slug: "stalevyy-alkhimik",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Проводжальники весни",
    year: 2023,
    type: "TV Серіал",
    rank: 1,
    rating: 9.12,
    slug: "provodzhalnyky-vesny",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Сталевий алхімік",
    year: 2009,
    type: "TV Серіал",
    rank: 2,
    rating: 9.1,
    slug: "stalevyy-alkhimik",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Проводжальники весни",
    year: 2023,
    type: "TV Серіал",
    rank: 1,
    rating: 9.12,
    slug: "provodzhalnyky-vesny",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Сталевий алхімік",
    year: 2009,
    type: "TV Серіал",
    rank: 2,
    rating: 9.1,
    slug: "stalevyy-alkhimik",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Проводжальники весни",
    year: 2023,
    type: "TV Серіал",
    rank: 1,
    rating: 9.12,
    slug: "provodzhalnyky-vesny",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Сталевий алхімік",
    year: 2009,
    type: "TV Серіал",
    rank: 2,
    rating: 9.1,
    slug: "stalevyy-alkhimik",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Проводжальники весни",
    year: 2023,
    type: "TV Серіал",
    rank: 1,
    rating: 9.12,
    slug: "provodzhalnyky-vesny",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Сталевий алхімік",
    year: 2009,
    type: "TV Серіал",
    rank: 2,
    rating: 9.1,
    slug: "stalevyy-alkhimik",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Проводжальники весни",
    year: 2023,
    type: "TV Серіал",
    rank: 1,
    rating: 9.12,
    slug: "provodzhalnyky-vesny",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Сталевий алхімік",
    year: 2009,
    type: "TV Серіал",
    rank: 2,
    rating: 9.1,
    slug: "stalevyy-alkhimik",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Проводжальники весни",
    year: 2023,
    type: "TV Серіал",
    rank: 1,
    rating: 9.12,
    slug: "provodzhalnyky-vesny",
  },
  {
    image: "/assets/mock-user-logo.png",
    title: "Сталевий алхімік",
    year: 2009,
    type: "TV Серіал",
    rank: 2,
    rating: 9.1,
    slug: "stalevyy-alkhimik",
  },
];

const sortOptions = [
  { label: "A-Я", value: "az" },
  { label: "Рейтинг", value: "rating" },
  { label: "Рік", value: "year" },
];

import { useEffect, useRef, useCallback } from "react";

interface Anime {
  id: string;
  slug: string;
  name: string;
  poster: string;
  first_air_date: string;
  kind: string;
  imdb_score: number;
}

const apiSortMap: Record<string, string> = {
  az: "name",
  rating: "rating",
  year: "year",
};

const perPage = 20;

export default function GenrePage() {
  const params = useParams();
  const genreSlug = params?.slug?.toString() || "";

  const [genreName, setGenreName] = useState<string>("");
  const [sort, setSort] = useState("az");
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
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

  // Fetch genre info and first page on sort/genre change
  useEffect(() => {
    if (!genreSlug) return;
    setLoading(true);
    setError(null);
    setPage(1);
    setAnimes([]);
    setHasMore(true);
    const sortParam = apiSortMap[sort] || "name";
    fetch(
      `http://127.0.0.1:8000/api/v1/genres/${genreSlug}?sort_anime=${sortParam}&page=1&per_page=${perPage}`,
    )
      .then((res) => {
        if (!res.ok) throw new Error("Помилка при завантаженні");
        return res.json();
      })
      .then((json) => {
        setAnimes(json.data.animes || []);
        setHasMore((json.data.animes || []).length >= perPage);
        if (json.data.name) setGenreName(json.data.name);
        else setGenreName(genreSlug);
      })
      .catch((e) => {
        setError(e.message || "Помилка при завантаженні");
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [genreSlug, sort]);

  // Fetch more animes when page increases (except for first page)
  useEffect(() => {
    if (page === 1 || !genreSlug) return;
    setLoading(true);
    setError(null);
    const sortParam = apiSortMap[sort] || "name";
    fetch(
      `http://127.0.0.1:8000/api/v1/genres/${genreSlug}?sort_anime=${sortParam}&page=${page}&per_page=${perPage}`,
    )
      .then((res) => {
        if (!res.ok) throw new Error("Помилка при завантаженні");
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

  // Map anime fields for TopAnimeCard
  const mappedAnime = (animes || []).map((anime, idx) => ({
    image: anime.poster,
    title: anime.name,
    year: anime.first_air_date ? Number(anime.first_air_date.slice(0, 4)) : 0,
    type: anime.kind || "-",
    rank: idx + 1,
    rating: anime.imdb_score ?? 0,
    slug: anime.slug,
  }));

  return (
    <>
      <div className="xs:px-4 min-h-screen px-2 pt-6 pb-16 transition-all sm:px-6 sm:pt-8 md:px-12">
        <h1 className="mb-2 text-center text-2xl font-bold text-white drop-shadow-lg sm:text-3xl">
          {genreName ? `Аніме жанру: ${genreName}` : "Аніме за жанром"}
        </h1>
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
        <div className="scrollbar-thin scrollbar-thumb-[#232b45] mt-6 mb-4 flex justify-end overflow-x-auto">
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
        {error && (
          <div className="mb-4 text-center font-semibold text-red-400">
            {error}
          </div>
        )}
        <div className="xs:grid-cols-2 grid grid-cols-1 gap-x-4 gap-y-6 transition-all sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {mappedAnime.map((anime, idx) => {
            const isLast = idx === mappedAnime.length - 1;
            return (
              <div
                key={anime.slug}
                ref={isLast ? lastAnimeRef : undefined}
                className="flex"
              >
                <TopAnimeCard
                  image={anime.image}
                  title={anime.title}
                  year={anime.year}
                  type={anime.type}
                  rank={anime.rank}
                  rating={anime.rating}
                  showRank={false}
                  href={`/anime/${anime.slug}`}
                  cardClassName="w-full min-w-0"
                />
              </div>
            );
          })}
        </div>
        {loading && (
          <div className="mt-6 text-center font-semibold text-blue-400">
            Завантаження...
          </div>
        )}
        {!loading && mappedAnime.length === 0 && !error && (
          <div className="mt-6 text-center font-semibold text-neutral-400">
            Аніме не знайдено
          </div>
        )}
      </div>
    </>
  );
}
