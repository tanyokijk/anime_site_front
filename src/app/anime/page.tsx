"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import TopAnimeCard from "@/components/top-anime-card";
import StudioFilter from "@/components/studio-filter";

// Map frontend values to backend enum values - CORRECTED
const statusMapping = {
  "Анонс": "anons",
  "Онґоїнг": "ongoing", 
  "Завершено": "released",
  "Зупинено": "canceled",
  "Чутки": "rumored"
};

const typeMapping = {
  "TV Серіал": "tv_series",
  "Спешл": "tv_special",
  "Фільм": "full_length", 
  "Короткометражний фільм": "short_film",
  "OVA": "ova",
  "ONA": "ona"
};

const periodMapping = {
  "Зима": "winter",
  "Весна": "spring", 
  "Літо": "summer",
  "Осінь": "autumn"
};

const ageRatingMapping = {
  "G": "g",
  "PG": "pg",
  "PG-13": "pg_13", 
  "R": "r",
  "NC-17": "nc_17"
};

// Example filter options - CORRECTED to match backend enums
const statuses = ["Анонс", "Онґоїнг", "Завершено", "Зупинено", "Чутки"];
const seasons = ["Зима", "Весна", "Літо", "Осінь"];
const types = ["TV Серіал", "Спешл", "Фільм", "Короткометражний фільм", "OVA", "ONA"];
const sortOptions = [
  { label: "За рейтингом", value: "imdb_score" },
  { label: "За назвою", value: "name" },
  { label: "За датою виходу", value: "first_air_date" },
];
const ageRatings = [
  { label: "G", info: "Для всіх" },
  { label: "PG", info: "Дитяча аудиторія" },
  { label: "PG-13", info: "13+" },
  { label: "R", info: "17+" },
  { label: "NC-17", info: "18+" },
];
const studios: { label: string; value: string }[] = [];
const minYear = 1965;
const maxYear = new Date().getFullYear();

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1/";

type FiltersState = {
  status: string[];
  season: string[];
  type: string[];
  sort: string;
  direction: string;
  age: string[];
  studio: string[];
  year: [number, number];
  search: string;
  minScore: number | null;
  maxScore: number | null;
  minUserRating: number | null;
  maxUserRating: number | null;
};

export default function AnimePage() {
  const [animes, setAnimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // State for filter data from backend
  const [filterData, setFilterData] = useState<{
    studios: Array<{id: string, name: string}>;
    periods: Array<{value: string, name: string}>;
  }>({
    studios: [],
    periods: []
  });
  
  const [filters, setFilters] = useState<FiltersState>({
    status: [],
    season: [],
    type: [],
    sort: "imdb_score",
    direction: "desc",
    age: [],
    studio: [],
    year: [minYear, maxYear],
    search: "",
    minScore: null,
    maxScore: null,
    minUserRating: null,
    maxUserRating: null,
  });

  // Fetch filter data from backend
  const fetchFilterData = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}animes/filters`);
      if (res.ok) {
        const data = await res.json();
        setFilterData(data);
      }
    } catch (e) {
      console.error("Failed to fetch filter data:", e);
    }
  }, []);

  // Fetch filter data on component mount
  useEffect(() => {
    fetchFilterData();
  }, [fetchFilterData]);

  // Build query string for backend - properly mapped to Laravel backend expectations
  const buildQuery = () => {
    const params = new URLSearchParams();
    
    // Search query
    if (filters.search.trim()) {
      params.append("q", filters.search.trim());
    }
    
    // Status mapping
    if (filters.status.length) {
      const mappedStatuses = filters.status.map(s => statusMapping[s as keyof typeof statusMapping]).filter(Boolean);
      if (mappedStatuses.length) {
        params.append("statuses", mappedStatuses.join(","));
      }
    }
    
    // Type/Kind mapping  
    if (filters.type.length) {
      const mappedTypes = filters.type.map(t => typeMapping[t as keyof typeof typeMapping]).filter(Boolean);
      if (mappedTypes.length) {
        params.append("kinds", mappedTypes.join(","));
      }
    }

    // Period/Season mapping
    if (filters.season.length) {
      const mappedPeriods = filters.season.map(s => periodMapping[s as keyof typeof periodMapping]).filter(Boolean);
      if (mappedPeriods.length) {
        params.append("periods", mappedPeriods.join(","));
      }
    }
    
    // Age rating mapping (if you add restricted_rating filter to backend)
    if (filters.age.length) {
      const mappedAge = filters.age.map(a => ageRatingMapping[a as keyof typeof ageRatingMapping]).filter(Boolean);
      if (mappedAge.length) {
        params.append("restricted_ratings", mappedAge.join(","));
      }
    }
    
    // Studio IDs - now using real studio IDs from backend
    if (filters.studio.length) {
      params.append("studio_ids", filters.studio.join(","));
    }
    
    // Year range
    if (filters.year[0] > minYear) {
      params.append("min_year", String(filters.year[0]));
    }
    if (filters.year[1] < maxYear) {
      params.append("max_year", String(filters.year[1]));
    }
    
    // IMDB Score range
    if (filters.minScore !== null) {
      params.append("min_score", String(filters.minScore));
    }
    if (filters.maxScore !== null) {
      params.append("max_score", String(filters.maxScore));
    }

    // User Rating range
    if (filters.minUserRating !== null) {
      params.append("min_user_rating", String(filters.minUserRating));
    }
    if (filters.maxUserRating !== null) {
      params.append("max_user_rating", String(filters.maxUserRating));
    }
    
    // Sorting
    if (filters.sort) {
      params.append("sort", filters.sort);
    }
    if (filters.direction) {
      params.append("direction", filters.direction);
    }
    
    // Pagination
    params.append("page", String(page));
    params.append("per_page", "20");
    
    return params.toString();
  };

  const fetchAnimes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const query = buildQuery();
      const url = `${API_BASE_URL}animes?${query}`;
      console.log("Fetching:", url);
      console.log("Query params:", query);
      
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log("Response status:", res.status);
      console.log("Response headers:", res.headers);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      
      const data = await res.json();
      console.log("Response data:", data);
      
      setHasMore((data.meta?.current_page || 1) < (data.meta?.last_page || 1));
      
      if (page === 1) {
        setAnimes(data.data);
      } else {
        setAnimes(prev => [...prev, ...data.data]);
      }
    } catch (e: any) {
      console.error("Fetch error:", e);
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  // Fetch data when filters or page changes
  useEffect(() => {
    fetchAnimes();
  }, [fetchAnimes]);

  // Infinite scroll
  const observer = useRef<IntersectionObserver | null>(null);
  const lastAnimeRef = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  // StudioFilter logic (copied from studios/[slug])
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [studiosOpen, setStudiosOpen] = useState(false);
  const studiosRef = useRef<HTMLDivElement | null>(null);
  const [studiosSearch, setStudiosSearch] = useState("");
  const handleStudiosClick = useCallback(() => setStudiosOpen((v) => !v), []);
  useEffect(() => {
    if (!studiosOpen) return;
    const handler = (e: MouseEvent) => {
      if (studiosRef.current && !studiosRef.current.contains(e.target as Node))
        setStudiosOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [studiosOpen]);
  const handleStudiosSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setStudiosSearch(e.target.value);
    },
    [],
  );
  const filteredStudios = studios.filter((s) =>
    s.label?.toLowerCase().includes(studiosSearch.toLowerCase()),
  );

  const toggleFilter = useCallback((key: string, value: string) => {
    if (["status", "season", "type", "age"].includes(key)) {
      setFilters((prev) => {
        const arr = (prev as any)[key] as string[];
        return {
          ...prev,
          [key]: arr.includes(value)
            ? arr.filter((v: string) => v !== value)
            : [...arr, value],
        };
      });
    }
  }, []);
  
  const setSingleFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);
  
  const setYearRange = useCallback((range: [number, number]) => {
    setFilters((prev) => ({ ...prev, year: range }));
  }, []);
  
  const clearFilters = useCallback(() => {
    setFilters({
      status: [],
      season: [],
      type: [],
      sort: "imdb_score",
      direction: "desc",
      age: [],
      studio: [],
      year: [minYear, maxYear],
      search: "",
      minScore: null,
      maxScore: null,
      minUserRating: null,
      maxUserRating: null,
    });
  }, []);
  
  const handleStudiosOptionClick = useCallback((val: string) => {
    setFilters((prev) => ({
      ...prev,
      studio: prev.studio.includes(val)
        ? prev.studio.filter((x) => x !== val)
        : [...prev.studio, val],
    }));
  }, []);
  
  const handleStudiosClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setFilters((prev) => ({ ...prev, studio: [] }));
  }, []);
  
  const handleStudiosTagRemove = useCallback(
    (val: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setFilters((prev) => ({
        ...prev,
        studio: prev.studio.filter((x) => x !== val),
      }));
    },
    [],
  );

  return (
    <div className="flex min-h-screen w-full flex-col gap-10 px-4 pt-10 pb-20 sm:px-8 sm:pt-6 sm:pb-8 md:flex-row md:pt-8 md:pb-14">
      {/* Main content */}
      <div className="min-w-0 flex-1 text-white">
        {/* Title and search/filter area styled like studios/[slug] */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-white">Аніме</h1>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:flex-wrap">
    {/* Назва / Пошук */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
      <label
        htmlFor="anime-search"
        className="mb-1 min-w-[80px] text-base font-semibold text-white sm:mr-2 sm:mb-0"
      >
        Назва
      </label>
      <input
        id="anime-search"
        type="text"
        placeholder="Введіть назву аніме..."
        className="w-full max-w-md rounded-lg border border-[#232B39] bg-[#181F2A] px-4 py-2 text-white placeholder-gray-400 transition-colors duration-150 focus:border-blue-400 focus:outline-none"
        value={filters.search}
        onChange={(e) =>
          setFilters((f) => ({ ...f, search: e.target.value }))
        }
      />
    </div>
          
          {/* Sort options */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
      <label className="mb-1 min-w-[80px] text-base font-semibold text-white sm:mr-2 sm:mb-0">
        Сортування
      </label>
      <select
        value={filters.sort}
        onChange={(e) => setSingleFilter("sort", e.target.value)}
        className="w-full max-w-md rounded-lg border border-[#232B39] bg-[#181F2A] px-4 py-2 text-white focus:border-blue-400 focus:outline-none"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <select
        value={filters.direction}
        onChange={(e) => setSingleFilter("direction", e.target.value)}
        className="w-full max-w-[160px] rounded-lg border border-[#232B39] bg-[#181F2A] px-4 py-2 text-white focus:border-blue-400 focus:outline-none"
      >
        <option value="desc">За спаданням</option>
        <option value="asc">За зростанням</option>
      </select>
    </div>
  </div>


          {/* User Rating Range */}
          {/* <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <label className="mb-1 min-w-[80px] text-base font-semibold text-white sm:mr-2 sm:mb-0">
              Рейтинг користувачів
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={filters.minUserRating || ''}
                onChange={(e) => setSingleFilter("minUserRating", e.target.value ? parseFloat(e.target.value) : null)}
                className="w-20 rounded-lg border border-[#232B39] bg-[#181F2A] px-2 py-1 text-white focus:border-blue-400 focus:outline-none"
                placeholder="Мін"
              />
              <span className="text-white">-</span>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={filters.maxUserRating || ''}
                onChange={(e) => setSingleFilter("maxUserRating", e.target.value ? parseFloat(e.target.value) : null)}
                className="w-20 rounded-lg border border-[#232B39] bg-[#181F2A] px-2 py-1 text-white focus:border-blue-400 focus:outline-none"
                placeholder="Макс"
              />
            </div>
          </div> */}
        </div>
        
        {error && <div className="text-center text-red-500">{error}</div>}
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {animes.map((anime: any, idx: number) => (
            <Link key={anime.id || idx} href={`/anime/${anime.slug}`} passHref>
              <TopAnimeCard
                image={anime.poster || anime.poster_url || ""}
                title={anime.name || anime.title || ""}
                cardClassName="min-w-0 w-auto"
                year={
                  anime.year ||
                  (anime.first_air_date
                    ? Number(anime.first_air_date.slice(0, 4))
                    : 0)
                }
                type={anime.kind || "-"}
                rank={anime.rank || idx + 1}
                rating={anime.imdb_score ?? 0}
                ref={idx === animes.length - 1 ? lastAnimeRef : null}
              />
            </Link>
          ))}
        </div>
        
        {loading && (
          <div className="text-center text-white">Завантаження...</div>
        )}
      </div>
      
      {/* Sidebar filters */}
      <aside
        className="hidden w-72 flex-shrink-0 md:block"
        style={{ minWidth: 0, maxWidth: "100vw" }}
      >
        <StudioFilter
          filters={filters}
          toggleFilter={toggleFilter as any}
          setSingleFilter={setSingleFilter as any}
          setYearRange={setYearRange}
          clearFilters={clearFilters}
          types={types}
          statuses={statuses}
          seasons={seasons}
          ageRatings={ageRatings}
          minYear={minYear}
          maxYear={maxYear}
          isMobile={false}
        />
      </aside>
    </div>
  );
}