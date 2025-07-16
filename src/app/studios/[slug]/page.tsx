"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import TopAnimeCard from "@/components/main-page/TopAnimeList/top-anime-card";
import StudioFilter from "@/components/studio-filter";
import Pagination from "@/components/ui/Pagination";

type Anime = {
  id: string;
  slug: string;
  name: string;
  poster: string;
  kind: string;
  imdb_score: number;
  first_air_date?: string;
  studio: {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
  };
};

interface FiltersState {
  status: string[];
  season: string[];
  genres: string[];
  type: string[];
  localized: boolean;
  sort: string;
  age: string[];
  studio: string[];
  year: [number, number];
}

const statuses = ["Призупинено", "Онґоїнг", "Завершено", "Анонс", "Зупинено"];
const seasons = ["Зима", "Весна", "Літо", "Осінь"];
const types = ["Спешл", "Фільм", "OVA", "ONA", "TV Серіал", "Музика"];
const genres = [
  "Драма",
  "Комедія",
  "Екшн",
  "Романтика",
  "Фентезі",
  "Жахи",
  "Містика",
  "Історія",
];
const ageRatings = [
  { label: "G", info: "Для всіх" },
  { label: "PG", info: "Дитяча аудиторія" },
  { label: "PG-13", info: "13+" },
  { label: "R", info: "17+" },
  { label: "R PLUS", info: "17+ (жорсткіше)" },
  { label: "R X", info: "18+" },
];
const studios = [
  { label: "Arvo Animation", value: "arvo-animation-5c0f1b" },
  { label: "MAPPA", value: "mappa-1a2b3c" },
  { label: "Kyoto Animation", value: "kyoto-animation-4d5e6f" },
];
const minYear = 1965;
const maxYear = 2025;
const itemsPerPage = 30;

export default function StudioPage({ params }: { params: { slug: string } }) {
  const [filters, setFilters] = useState<FiltersState>({
    status: [],
    season: [],
    genres: [],
    type: [],
    localized: false,
    sort: "",
    age: [],
    studio: [],
    year: [minYear, maxYear],
  });
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Genres dropdown
  const [genresOpen, setGenresOpen] = useState(false);
  const genresRef = useRef<HTMLDivElement | null>(null);
  const handleGenresClick = useCallback(() => setGenresOpen((v) => !v), []);
  useEffect(() => {
    if (!genresOpen) return;
    const handler = (e: MouseEvent) => {
      if (genresRef.current && !genresRef.current.contains(e.target as Node)) setGenresOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [genresOpen]);

  // Studios dropdown
  const [studiosOpen, setStudiosOpen] = useState(false);
  const studiosRef = useRef<HTMLDivElement | null>(null);
  const [studiosSearch, setStudiosSearch] = useState("");
  const handleStudiosClick = useCallback(() => setStudiosOpen((v) => !v), []);
  useEffect(() => {
    if (!studiosOpen) return;
    const handler = (e: MouseEvent) => {
      if (studiosRef.current && !studiosRef.current.contains(e.target as Node)) setStudiosOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [studiosOpen]);
  const handleStudiosSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setStudiosSearch(e.target.value);
  }, []);
  const filteredStudios = studios.filter((s) =>
    s.label.toLowerCase().includes(studiosSearch.toLowerCase())
  );

  // Filter handlers (toggleFilter, setSingleFilter, clearFilters)
  const toggleFilter = useCallback(
    <K extends string | number | symbol>(key: K, value: string) => {
      if (["status", "season", "genres", "type", "age"].includes(key as string)) {
        setFilters((prev) => {
          const arr = prev[key as keyof FiltersState] as string[];
          return {
            ...prev,
            [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
          };
        });
      }
    },
    []
  );
  const setSingleFilter = useCallback(
    (key: string | number | symbol, value: any) => {
      setFilters((prev) => ({
        ...prev,
        [key as keyof FiltersState]: value,
      }));
    },
    []
  );
  const setYearRange = useCallback((range: [number, number]) => {
    setFilters((prev) => ({ ...prev, year: range }));
  }, []);
  const clearFilters = useCallback(() => {
    setFilters({
      status: [],
      season: [],
      genres: [],
      type: [],
      localized: false,
      sort: "",
      age: [],
      studio: [],
      year: [minYear, maxYear],
    });
  }, []);

  // Genres handlers
  const handleGenresOptionClick = useCallback((g: string) => {
    setFilters((prev) => ({
      ...prev,
      genres: prev.genres.includes(g) ? prev.genres.filter((x) => x !== g) : [...prev.genres, g],
    }));
  }, []);
  const handleGenresClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setFilters((prev) => ({ ...prev, genres: [] }));
  }, []);
  const handleGenresTagRemove = useCallback((g: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFilters((prev) => ({
      ...prev,
      genres: prev.genres.filter((x) => x !== g),
    }));
  }, []);

  // Studios handlers
  const handleStudiosOptionClick = useCallback((val: string) => {
    setFilters((prev) => ({
      ...prev,
      studio: prev.studio.includes(val) ? prev.studio.filter((x) => x !== val) : [...prev.studio, val],
    }));
  }, []);
  const handleStudiosClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setFilters((prev) => ({ ...prev, studio: [] }));
  }, []);
  const handleStudiosTagRemove = useCallback((val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFilters((prev) => ({
      ...prev,
      studio: prev.studio.filter((x) => x !== val),
    }));
  }, []);

  // Studio info and anime list state
  const [studioInfo, setStudioInfo] = useState<{
    name: string;
    description: string;
    logo: string;
    slug: string;
  } | null>(null);
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch anime list and studio info with filters, search and pagination
  const fetchAnimeData = useCallback(async (search?: string) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
  
      if (search?.trim()) queryParams.append("query", search.trim());
      queryParams.append("page", currentPage.toString());
      queryParams.append("per_page", itemsPerPage.toString());
  
      // Додаємо фільтри
      if (filters.status.length > 0) queryParams.append("status", filters.status.join(","));
      if (filters.season.length > 0) queryParams.append("season", filters.season.join(","));
      if (filters.genres.length > 0) queryParams.append("genres", filters.genres.join(","));
      if (filters.type.length > 0) queryParams.append("type", filters.type.join(","));
      if (filters.age.length > 0) queryParams.append("age", filters.age.join(","));
      if (filters.studio.length > 0) queryParams.append("studio", filters.studio.join(","));
      if (filters.sort) queryParams.append("sort", filters.sort);
      if (filters.year[0]) queryParams.append("year_from", filters.year[0].toString());
      if (filters.year[1]) queryParams.append("year_to", filters.year[1].toString());
      if (filters.localized) queryParams.append("localized", "1");
  
      const slugToUse = studioInfo?.slug || params.slug;
      const url = `http://127.0.0.1:8000/api/v1/studios/${slugToUse}/animes?${queryParams.toString()}`;
  
      const res = await fetch(url);
      if (!res.ok) throw new Error("Помилка при завантаженні аніме");
  
      const json = await res.json();
  
      if (json.data && json.data.length > 0) {
        setAnimeList(json.data);
  
        // Встановлюємо studioInfo, якщо ще не встановлено
        if (!studioInfo) {
          const studio = json.data[0].studio;
          setStudioInfo({
            name: studio.name,
            description: studio.description,
            logo: studio.image,
            slug: studio.slug,
          });
        }
  
        // Встановлюємо totalPages, якщо у відповіді є таке поле (припускаю json.meta.last_page або json.meta.total_pages)
        if (json.meta?.last_page) setTotalPages(json.meta.last_page);
        else if (json.meta?.total_pages) setTotalPages(json.meta.total_pages);
        else setTotalPages(1);
      } else {
        setAnimeList([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Помилка при завантаженні:", error);
      setAnimeList([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [studioInfo, params.slug, currentPage, filters]);

  return (
    <div className="min-h-screen px-2 py-8 text-white sm:px-8">
      {studioInfo && (
        <div className="mb-8 flex items-start gap-6">
          <Image
            src={studioInfo.logo}
            alt={studioInfo.name}
            width={100}
            height={100}
            className="rounded-lg bg-white object-contain p-2"
          />
          <div>
            <h1 className="mb-2 text-3xl font-bold">{studioInfo.name}</h1>
            <p className="max-w-xl text-sm leading-relaxed text-gray-300">{studioInfo.description}</p>
          </div>
        </div>
      )}

      <div className="flex gap-8">
        <div className="flex-1">
          {/* Search input */}
          <div className="relative mb-6 flex items-center">
          <input
  type="text"
  placeholder="Введіть назву аніме..."
  className="w-full rounded-lg border border-[#232B39] bg-[#181F2A] px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
      fetchAnimeData(searchQuery); // ← тут пошук по назві
    }
  }}
/>
            <button
              className="absolute top-1/2 right-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg bg-[#232B39] hover:bg-[#2C3545] sm:hidden"
              onClick={() => setFiltersOpen(true)}
              aria-label="Відкрити фільтри"
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M4 6h16M6 12h12M10 18h4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Anime grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {loading ? (
              <p>Завантаження...</p>
            ) : animeList.length === 0 ? (
              <p>Аніме не знайдено.</p>
            ) : (
              animeList.map((anime) => (
                <TopAnimeCard
                  key={anime.id}
                  image={anime.poster}
                  title={anime.name}
                  year={anime.first_air_date ? new Date(anime.first_air_date).getFullYear() : undefined}
                  type={anime.kind}
                  rank={null}
                  rating={anime.imdb_score}
                  showRank={false}
                  href={`/anime/${anime.slug}`}
                  small={true}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                if (page >= 1 && page <= totalPages) setCurrentPage(page);
              }}
            />
          </div>
        </div>

        {/* Filters sidebar */}
        <div className="hidden w-64 flex-shrink-0 sm:block">
          <StudioFilter
            filters={filters}
            toggleFilter={toggleFilter}
            setSingleFilter={setSingleFilter}
            setYearRange={setYearRange}
            clearFilters={clearFilters}
            genres={genres}
            genresOpen={genresOpen}
            genresRef={genresRef}
            handleGenresClick={handleGenresClick}
            handleGenresOptionClick={handleGenresOptionClick}
            handleGenresClear={handleGenresClear}
            handleGenresTagRemove={handleGenresTagRemove}
            types={types}
            statuses={statuses}
            seasons={seasons}
            ageRatings={ageRatings}
            //studios={studios}
            // studiosOpen={studiosOpen}
            // studiosRef={studiosRef}
            // studiosSearch={studiosSearch}
            // handleStudiosClick={handleStudiosClick}
            // handleStudiosSearch={handleStudiosSearch}
            // filteredStudios={filteredStudios}
            // handleStudiosOptionClick={handleStudiosOptionClick}
            // handleStudiosClear={handleStudiosClear}
            // handleStudiosTagRemove={handleStudiosTagRemove}
            minYear={minYear}
            maxYear={maxYear}
            isMobile={false}
          />
        </div>

        {/* Mobile filters drawer */}
        {filtersOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setFiltersOpen(false)} />
            <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-2xl border-t border-[#232B39] bg-[#181F2A] p-4">
              <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-gray-600" />
              <div className="mb-4 text-center text-xl font-bold">Фільтри</div>
              <StudioFilter
                filters={filters}
                toggleFilter={toggleFilter}
                setSingleFilter={setSingleFilter}
                setYearRange={setYearRange}
                clearFilters={clearFilters}
                genres={genres}
                genresOpen={genresOpen}
                genresRef={genresRef}
                handleGenresClick={handleGenresClick}
                handleGenresOptionClick={handleGenresOptionClick}
                handleGenresClear={handleGenresClear}
                handleGenresTagRemove={handleGenresTagRemove}
                types={types}
                statuses={statuses}
                seasons={seasons}
                ageRatings={ageRatings}
                // studios={studios}
                // studiosOpen={studiosOpen}
                // studiosRef={studiosRef}
                // studiosSearch={studiosSearch}
                // handleStudiosClick={handleStudiosClick}
                // handleStudiosSearch={handleStudiosSearch}
                // filteredStudios={filteredStudios}
                // handleStudiosOptionClick={handleStudiosOptionClick}
                // handleStudiosClear={handleStudiosClear}
                // handleStudiosTagRemove={handleStudiosTagRemove}
                minYear={minYear}
                maxYear={maxYear}
                isMobile={true}
                onApply={() => setFiltersOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
