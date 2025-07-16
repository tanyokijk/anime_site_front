import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export interface RenderFiltersProps {
  filters: any;
  toggleFilter: <K extends keyof any>(key: K, value: string) => void;
  setSingleFilter: (key: keyof any, value: any) => void;
  setYearRange: (range: [number, number]) => void;
  clearFilters: () => void;
  // genres: string[];
  // genresOpen: boolean;
  // genresRef: React.RefObject<HTMLDivElement | null>;
  // handleGenresClick: () => void;
  // handleGenresOptionClick: (g: string) => void;
  // handleGenresClear: (e: React.MouseEvent) => void;
  // handleGenresTagRemove: (g: string, e: React.MouseEvent) => void;
  // Add tags props
  // tags: string[];
  // tagsOpen: boolean;
  // tagsRef: React.RefObject<HTMLDivElement | null>;
  // handleTagsClick: () => void;
  // handleTagsOptionClick: (t: string) => void;
  // handleTagsClear: (e: React.MouseEvent) => void;
  // handleTagsTagRemove: (t: string, e: React.MouseEvent) => void;
  types: string[];
  statuses: string[];
  seasons: string[];
  ageRatings: { label: string; info: string }[];
  minYear: number;
  maxYear: number;
  isMobile?: boolean;
  onApply?: () => void;
}

const StudioFilter: React.FC<RenderFiltersProps> = ({
  filters,
  toggleFilter,
  setSingleFilter,
  setYearRange,
  clearFilters,
  // genres,
  // genresOpen,
  // genresRef,
  // handleGenresClick,
  // handleGenresOptionClick,
  // handleGenresClear,
  // handleGenresTagRemove,
  // Add tags props
  // tags,
  // tagsOpen,
  // tagsRef,
  // handleTagsClick,
  // handleTagsOptionClick,
  // handleTagsClear,
  // handleTagsTagRemove,
  types,
  statuses,
  seasons,
  ageRatings,
  minYear,
  maxYear,
  isMobile = false,
  onApply,
}) => {
  // Accordion state
  const [openSections, setOpenSections] = useState({
    status: true,
    season: true,
    genres: true,
    tags: true, // Add tags
    type: true,
    age: true,
    score: true,
    userRating: true,
    year: true,
  });
  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Tooltip state
  const [tooltipOpen, setTooltipOpen] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [tooltipContent, setTooltipContent] = useState<string>("");
  const tooltipRefs = React.useRef<(HTMLSpanElement | null)[]>([]);

  const handleTooltipShow = (idx: number, info: string) => {
    const ref = tooltipRefs.current[idx];
    if (ref) {
      const rect = ref.getBoundingClientRect();
      setTooltipPos({ x: rect.left + rect.width / 2, y: rect.bottom });
      setTooltipContent(info);
      setTooltipOpen(idx);
    }
  };
  const handleTooltipHide = () => setTooltipOpen(null);

  return (
    <div
      className={
        isMobile
          ? "flex flex-col gap-4 text-white"
          : "flex flex-col gap-4 text-white"
      }
    >
      {/* Status */}
      <div
        className="mb-2 rounded-xl border border-[#6CA0FF33] bg-transparent p-4"
        style={{ boxShadow: "0 0 0 1px #6CA0FF33" }}
      >
        <button
          type="button"
          className="mb-3 flex w-full items-center justify-between text-xl font-bold focus:outline-none"
          onClick={() => toggleSection("status")}
        >
          Статус{" "}
          <span className="ml-auto text-lg">
            {openSections.status ? "˄" : "˅"}
          </span>
        </button>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: openSections.status ? "auto" : 0 }}
          exit={{ height: 0 }}
          style={{ overflow: "hidden" }}
        >
          <AnimatePresence>
            {openSections.status && (
              <motion.div
                key="status-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.18,
                  delay: openSections.status ? 0.08 : 0,
                }}
                className="flex flex-wrap gap-2"
              >
                {statuses.map((status) => (
                  <button
                    key={status}
                    className={`rounded-full px-4 py-1 text-base font-medium transition-colors focus:outline-none ${filters.status.includes(status) ? "bg-[#787880] text-white" : "bg-[#23242A] text-white hover:bg-[#787880]/80"}`}
                    onClick={() => toggleFilter("status", status)}
                  >
                    {status}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Tags */}
      {/* <div
        className="mb-2 rounded-xl border border-[#6CA0FF33] bg-transparent p-4"
        style={{ boxShadow: "0 0 0 1px #6CA0FF33" }}
      >
        <button
          type="button"
          className="mb-3 flex w-full items-center justify-between text-xl font-bold focus:outline-none"
          onClick={() => toggleSection("tags")}
        >
          Теги{" "}
          <span className="ml-auto text-lg">
            {openSections.tags ? "˄" : "˅"}
          </span>
        </button>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: openSections.tags ? "auto" : 0 }}
          exit={{ height: 0 }}
          style={{ overflow: "hidden" }}
        >
          { <AnimatePresence>
            {openSections.tags && (
              <motion.div
                key="tags-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.18,
                  delay: openSections.tags ? 0.08 : 0,
                }}
                ref={tagsRef}
                className="relative"
              >
                <div
                  className={`flex min-h-[36px] w-full cursor-pointer flex-wrap items-center gap-2 rounded-xl border-none bg-[#23242A] px-3 py-2 text-base text-white focus:outline-none ${tagsOpen ? "ring-2 ring-blue-400" : ""}`}
                  onClick={handleTagsClick}
                  tabIndex={0}
                >
                  {filters.tags.length === 0 && (
                    <span className="text-white/60">
                      Виберіть тег/теги...
                    </span>
                  )}
                  {filters.tags.map((t: string) => (
                    <span
                      key={t}
                      className="flex items-center gap-1 rounded-lg bg-[#787880] px-2 py-1 text-xs text-white"
                    >
                      {t}
                      <button
                        type="button"
                        className="ml-1 text-xs text-white/80 hover:text-white"
                        onClick={(e) => handleTagsTagRemove(t, e)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {filters.tags.length > 0 && (
                    <button
                      type="button"
                      className="ml-2 text-xs text-white/60 hover:text-white"
                      onClick={handleTagsClear}
                    >
                      Очистити
                    </button>
                  )}
                  <svg
                    className="ml-auto"
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {tagsOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="absolute top-full left-0 z-50 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-[#6CA0FF33] bg-[#23242A] shadow-lg"
                  >
                    {tags.map((t) => (
                      <div
                        key={t}
                        className={`cursor-pointer px-4 py-2 text-base ${filters.tags.includes(t) ? "bg-[#787880] text-white" : "text-white hover:bg-[#787880]/60"}`}
                        onClick={() => handleTagsOptionClick(t)}
                      >
                        {t}
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence> }
        </motion.div>
      </div> */}

      {/* Season */}
      <div
        className="mb-2 rounded-xl border border-[#6CA0FF33] bg-transparent p-4"
        style={{ boxShadow: "0 0 0 1px #6CA0FF33" }}
      >
        <button
          type="button"
          className="mb-3 flex w-full items-center justify-between text-xl font-bold focus:outline-none"
          onClick={() => toggleSection("season")}
        >
          Сезон{" "}
          <span className="ml-auto text-lg">
            {openSections.season ? "˄" : "˅"}
          </span>
        </button>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: openSections.season ? "auto" : 0 }}
          exit={{ height: 0 }}
          style={{ overflow: "hidden" }}
        >
          <AnimatePresence>
            {openSections.season && (
              <motion.div
                key="season-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.18,
                  delay: openSections.season ? 0.08 : 0,
                }}
                className="flex flex-wrap gap-2"
              >
                {seasons.map((season) => (
                  <button
                    key={season}
                    className={`rounded-full px-4 py-1 text-base font-medium transition-colors focus:outline-none ${filters.season.includes(season) ? "bg-[#787880] text-white" : "bg-[#23242A] text-white hover:bg-[#787880]/80"}`}
                    onClick={() => toggleFilter("season", season)}
                  >
                    {season}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Genres */}
      {/* <div
        className="mb-2 rounded-xl border border-[#6CA0FF33] bg-transparent p-4"
        style={{ boxShadow: "0 0 0 1px #6CA0FF33" }}
      >
        <button
          type="button"
          className="mb-3 flex w-full items-center justify-between text-xl font-bold focus:outline-none"
          onClick={() => toggleSection("genres")}
        >
          Жанри{" "}
          <span className="ml-auto text-lg">
            {openSections.genres ? "˄" : "˅"}
          </span>
        </button>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: openSections.genres ? "auto" : 0 }}
          exit={{ height: 0 }}
          style={{ overflow: "hidden" }}
        >
          {/* <AnimatePresence>
            {openSections.genres && (
              <motion.div
                key="genres-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.18,
                  delay: openSections.genres ? 0.08 : 0,
                }}
                ref={genresRef}
                className="relative"
              >
                <div
                  className={`flex min-h-[36px] w-full cursor-pointer flex-wrap items-center gap-2 rounded-xl border-none bg-[#23242A] px-3 py-2 text-base text-white focus:outline-none ${genresOpen ? "ring-2 ring-blue-400" : ""}`}
                  onClick={handleGenresClick}
                  tabIndex={0}
                >
                  {filters.genres.length === 0 && (
                    <span className="text-white/60">
                      Виберіть жанр/жанри...
                    </span>
                  )}
                  {filters.genres.map((g: string) => (
                    <span
                      key={g}
                      className="flex items-center gap-1 rounded-lg bg-[#787880] px-2 py-1 text-xs text-white"
                    >
                      {g}
                      <button
                        type="button"
                        className="ml-1 text-xs text-white/80 hover:text-white"
                        onClick={(e) => handleGenresTagRemove(g, e)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {filters.genres.length > 0 && (
                    <button
                      type="button"
                      className="ml-2 text-xs text-white/60 hover:text-white"
                      onClick={handleGenresClear}
                    >
                      Очистити
                    </button>
                  )}
                  <svg
                    className="ml-auto"
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {genresOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="absolute top-full left-0 z-50 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-[#6CA0FF33] bg-[#23242A] shadow-lg"
                  >
                    {genres.map((g) => (
                      <div
                        key={g}
                        className={`cursor-pointer px-4 py-2 text-base ${filters.genres.includes(g) ? "bg-[#787880] text-white" : "text-white hover:bg-[#787880]/60"}`}
                        onClick={() => handleGenresOptionClick(g)}
                      >
                        {g}
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence> }
        </motion.div>
      </div> */}

      {/* Type */}
      <div
        className="mb-2 rounded-xl border border-[#6CA0FF33] bg-transparent p-4"
        style={{ boxShadow: "0 0 0 1px #6CA0FF33" }}
      >
        <button
          type="button"
          className="mb-3 flex w-full items-center justify-between text-xl font-bold focus:outline-none"
          onClick={() => toggleSection("type")}
        >
          Тип{" "}
          <span className="ml-auto text-lg">
            {openSections.type ? "˄" : "˅"}
          </span>
        </button>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: openSections.type ? "auto" : 0 }}
          exit={{ height: 0 }}
          style={{ overflow: "hidden" }}
        >
          <AnimatePresence>
            {openSections.type && (
              <motion.div
                key="type-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.18,
                  delay: openSections.type ? 0.08 : 0,
                }}
                className="flex flex-wrap gap-2"
              >
                {types.map((type) => (
                  <button
                    key={type}
                    className={`rounded-full px-4 py-1 text-base font-medium transition-colors focus:outline-none ${filters.type.includes(type) ? "bg-[#787880] text-white" : "bg-[#23242A] text-white hover:bg-[#787880]/80"}`}
                    onClick={() => toggleFilter("type", type)}
                  >
                    {type}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Age Rating */}
      <div
        className="mb-2 rounded-xl border border-[#6CA0FF33] bg-transparent p-4"
        style={{ boxShadow: "0 0 0 1px #6CA0FF33" }}
      >
        <button
          type="button"
          className="mb-3 flex w-full items-center justify-between text-xl font-bold focus:outline-none"
          onClick={() => toggleSection("age")}
        >
          Віковий рейтинг{" "}
          <span className="ml-auto text-lg">
            {openSections.age ? "˄" : "˅"}
          </span>
        </button>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: openSections.age ? "auto" : 0 }}
          exit={{ height: 0 }}
          style={{ overflow: "hidden" }}
        >
          <AnimatePresence>
            {openSections.age && (
              <motion.div
                key="age-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.18,
                  delay: openSections.age ? 0.08 : 0,
                }}
                className="flex flex-wrap gap-2"
              >
                {ageRatings.map((a, idx) => (
                  <button
                    key={a.label}
                    className={`flex items-center gap-2 rounded-full px-4 py-1 text-base font-medium transition-colors focus:outline-none ${filters.age.includes(a.label) ? "bg-[#787880] text-white" : "bg-[#23242A] text-white hover:bg-[#787880]/80"}`}
                    onClick={() => toggleFilter("age", a.label)}
                    type="button"
                  >
                    {a.label}
                    <span
                      ref={(el) => {
                        tooltipRefs.current[idx] = el;
                      }}
                      onMouseEnter={() => handleTooltipShow(idx, a.info)}
                      onMouseLeave={handleTooltipHide}
                      onFocus={() => handleTooltipShow(idx, a.info)}
                      onBlur={handleTooltipHide}
                      className="group/tooltip relative ml-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-[#787880] bg-[#23242A] text-base opacity-80"
                    >
                      i
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        {typeof window !== "undefined" &&
          tooltipOpen !== null &&
          createPortal(
            <span
              className="pointer-events-none fixed z-[9999] rounded-lg border border-[#787880] bg-[#23242A] px-3 py-2 text-xs whitespace-nowrap text-white opacity-100 shadow-lg transition-opacity duration-200"
              style={{
                left: tooltipPos.x,
                top: tooltipPos.y + 8,
                transform: "translate(-50%, 0)",
              }}
            >
              {tooltipContent}
            </span>,
            document.body,
          )}
      </div>

      {/* Score Range */}
      <div
        className="mb-2 rounded-xl border border-[#6CA0FF33] bg-transparent p-4"
        style={{ boxShadow: "0 0 0 1px #6CA0FF33" }}
      >
        <button
          type="button"
          className="mb-3 flex w-full items-center justify-between text-xl font-bold focus:outline-none"
          onClick={() => toggleSection("score")}
        >
          Рейтинг IMDB{" "}
          <span className="ml-auto text-lg">
            {openSections.score ? "˄" : "˅"}
          </span>
        </button>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: openSections.score ? "auto" : 0 }}
          exit={{ height: 0 }}
          style={{ overflow: "hidden" }}
        >
          <AnimatePresence>
            {openSections.score && (
              <motion.div
                key="score-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.18,
                  delay: openSections.score ? 0.08 : 0,
                }}
                className="flex flex-col gap-3"
              >
                <div className="flex gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-white/80">Мін.</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={filters.minScore || ''}
                      onChange={(e) => setSingleFilter("minScore", e.target.value ? parseFloat(e.target.value) : null)}
                      className="w-20 rounded-lg border border-[#6CA0FF33] bg-[#23242A] px-2 py-1 text-white focus:border-blue-400 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-white/80">Макс.</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={filters.maxScore || ''}
                      onChange={(e) => setSingleFilter("maxScore", e.target.value ? parseFloat(e.target.value) : null)}
                      className="w-20 rounded-lg border border-[#6CA0FF33] bg-[#23242A] px-2 py-1 text-white focus:border-blue-400 focus:outline-none"
                      placeholder="10"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* User Rating Range */}
      {/* <div
        className="mb-2 rounded-xl border border-[#6CA0FF33] bg-transparent p-4"
        style={{ boxShadow: "0 0 0 1px #6CA0FF33" }}
      >
        <button
          type="button"
          className="mb-3 flex w-full items-center justify-between text-xl font-bold focus:outline-none"
          onClick={() => toggleSection("userRating")}
        >
          Рейтинг користувачів{" "}
          <span className="ml-auto text-lg">
            {openSections.userRating ? "˄" : "˅"}
          </span>
        </button>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: openSections.userRating ? "auto" : 0 }}
          exit={{ height: 0 }}
          style={{ overflow: "hidden" }}
        >
          <AnimatePresence>
            {openSections.userRating && (
              <motion.div
                key="userRating-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.18,
                  delay: openSections.userRating ? 0.08 : 0,
                }}
                className="flex flex-col gap-3"
              >
                <div className="flex gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-white/80">Мін.</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={filters.minUserRating || ''}
                      onChange={(e) => setSingleFilter("minUserRating", e.target.value ? parseFloat(e.target.value) : null)}
                      className="w-20 rounded-lg border border-[#6CA0FF33] bg-[#23242A] px-2 py-1 text-white focus:border-blue-400 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-white/80">Макс.</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={filters.maxUserRating || ''}
                      onChange={(e) => setSingleFilter("maxUserRating", e.target.value ? parseFloat(e.target.value) : null)}
                      className="w-20 rounded-lg border border-[#6CA0FF33] bg-[#23242A] px-2 py-1 text-white focus:border-blue-400 focus:outline-none"
                      placeholder="10"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div> */}

      {/* Year Range */}
      <div
        className="mb-2 rounded-xl border border-[#6CA0FF33] bg-transparent p-4"
        style={{ boxShadow: "0 0 0 1px #6CA0FF33" }}
      >
        <button
          type="button"
          className="mb-3 flex w-full items-center justify-between text-xl font-bold focus:outline-none"
          onClick={() => toggleSection("year")}
        >
          Рік виходу{" "}
          <span className="ml-auto text-lg">
            {openSections.year ? "˄" : "˅"}
          </span>
        </button>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: openSections.year ? "auto" : 0 }}
          exit={{ height: 0 }}
          style={{ overflow: "hidden" }}
        >
          <AnimatePresence>
            {openSections.year && (
              <motion.div
                key="year-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.18,
                  delay: openSections.year ? 0.08 : 0,
                }}
                className="flex flex-col items-stretch gap-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="min-w-[56px] rounded-xl bg-[#787880] px-3 py-1 text-center text-base font-medium">
                    {filters.year[0]}
                  </span>
                  <span className="min-w-[56px] rounded-xl bg-[#787880] px-3 py-1 text-center text-base font-medium">
                    {filters.year[1]}
                  </span>
                </div>
                <Slider
                  range
                  min={minYear}
                  max={maxYear}
                  value={filters.year}
                  onChange={(val) => {
                    if (Array.isArray(val))
                      setYearRange(val as [number, number]);
                  }}
                  allowCross={false}
                  trackStyle={[{ backgroundColor: "#6CA0FF", height: 6 }]}
                  handleStyle={[
                    {
                      borderColor: "#6CA0FF",
                      backgroundColor: "#23242A",
                      width: 22,
                      height: 22,
                      marginTop: -8,
                      boxShadow: "0 0 0 2px #6CA0FF55",
                    },
                    {
                      borderColor: "#6CA0FF",
                      backgroundColor: "#23242A",
                      width: 22,
                      height: 22,
                      marginTop: -8,
                      boxShadow: "0 0 0 2px #6CA0FF55",
                    },
                  ]}
                  railStyle={{ backgroundColor: "#23242A", height: 6 }}
                  dotStyle={{ display: "none" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Clear Button */}
      <button
        className="mt-2 w-full rounded-xl border border-[#6CA0FF33] bg-[#23242A] py-2 text-lg font-bold text-white transition-colors hover:bg-[#787880]/80"
        onClick={clearFilters}
      >
        Очистити
      </button>
      {isMobile && (
        <button
          className="mt-2 w-full rounded-xl bg-[#6CA0FF] py-2 text-lg font-bold text-white transition-colors hover:bg-[#4B7ED6]"
          onClick={onApply}
        >
          Застосувати
        </button>
      )}
    </div>
  );
};

export default StudioFilter;