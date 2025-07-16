"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AnimeSlide {
  id: string;
  name: string;
  description: string;
  poster: string;
  related_seasons_count: number;
  slug: string;
}

interface AnimeCarouselProps {
  slides: AnimeSlide[];
  loading?: boolean;
  error?: string | null;
}

function useWindowWidth() {
  const [width, setWidth] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { width, mounted };
}

const AnimeCarousel: React.FC<AnimeCarouselProps> = ({ 
  slides, 
  loading = false, 
  error = null 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width, mounted } = useWindowWidth();
  const totalSlides = slides.length;

  // Автопрокрутка
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  if (!mounted) {
    return (
      <div className="w-full h-[300px] sm:h-[500px] flex items-center justify-center bg-gray-900 rounded-xl">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-[300px] sm:h-[500px] flex items-center justify-center bg-gray-900 rounded-xl">
        <div className="text-white flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Завантаження аніме...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[300px] sm:h-[500px] flex items-center justify-center bg-gray-900 rounded-xl">
        <div className="text-red-400 text-center">
          <p className="mb-2">Помилка завантаження</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="w-full h-[300px] sm:h-[500px] flex items-center justify-center bg-gray-900 rounded-xl">
        <div className="text-gray-400">Немає доступних аніме</div>
      </div>
    );
  }

  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  const slideWidth = isMobile ? 350 : isTablet ? 500 : 660;
  const slideHeight = isMobile ? 200 : isTablet ? 400 : 400;
  const offsetX = isMobile ? 60 : isTablet ? 100 : 150;

   return (
    <div className="w-full select-none min-h-[250px] sm:min-h-[300px] lg:min-h-[350px] flex items-center justify-center overflow-hidden relativepy-8">
      <div
        className="relative flex items-center justify-center"
        style={{
          width: "100%",
          maxWidth: `${slideWidth * 3}px`,
          height: `${slideHeight + 50}px`,
        }}
      >
        {slides.map((slide, slideIndex) => {
          let relativeIndex = slideIndex - currentIndex;
          if (relativeIndex > Math.floor(totalSlides / 2)) {
            relativeIndex -= totalSlides;
          } else if (relativeIndex < -Math.floor(totalSlides / 2)) {
            relativeIndex += totalSlides;
          }

          const maxVisible = isMobile ? 2 : 2;
          if (Math.abs(relativeIndex) > maxVisible) return null;

          let translateX = relativeIndex * offsetX;
          let scale = 1;
          let opacity = 1;

          if (Math.abs(relativeIndex) === 2) {
            scale = 0.8;
            opacity = 0.9;
          } else if (Math.abs(relativeIndex) === 1) {
            scale = 0.9;
            opacity = 1;
          }

          const zIndex = 10 - Math.abs(relativeIndex);

          return (
            <motion.div
              key={slide.id}
              className={`absolute cursor-pointer ${
                relativeIndex === 0 ? "z-20" : "z-10"
              }`}
              style={{ zIndex }}
              initial={false}
              animate={{
                x: translateX,
                scale,
                opacity,
              }}
              transition={{
                type: "spring",
                stiffness: 90,
                damping: 18,
                opacity: { duration: 0.3 },
              }}
              onClick={() => {
                if (relativeIndex !== 0) {
                  setCurrentIndex(slideIndex);
                }
              }}
            >
              <div
                className={`relative overflow-hidden rounded-xl shadow-md
                  w-[300px] h-[200px]
                  sm:w-[350px] sm:h-[200px]
                  md:w-[500px] md:h-[300px]
                  lg:w-[850px] lg:h-[400px]`}
              >
                <Image
                  src={slide.poster}
                  alt={slide.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 220px, (max-width: 1024px) 350px, (max-width: 1280px) 500px, 660px"
                  priority={relativeIndex === 0}
                  quality={70}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {relativeIndex === 0 && (
                  <>
                    <button
                      onClick={prev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 bg-black/40 backdrop-blur-lg rounded-sm sm:rounded-2xl flex items-center justify-center z-30 hover:bg-black/50 transition"
                      aria-label="Попередній слайд"
                      type="button"
                    >
                      <svg
                        width={18}
                        height={18}
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M19 12L5 12M5 12L9 8M5 12L9 16"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={next}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 bg-black/40 backdrop-blur-lg rounded-sm sm:rounded-2xl flex items-center justify-center z-30 hover:bg-black/50 transition "
                      aria-label="Наступний слайд"
                      type="button"
                    >
                      <svg
                        width={18}
                        height={18}
                        viewBox="0 0 24 24"
                        fill="none"
                        className="rotate-180"
                      >
                        <path
                          d="M19 12L5 12M5 12L9 8M5 12L9 16"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    <motion.div
                      className="absolute bottom-0 left-0 right-0 p-4 text-white z-20"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <h2
                        className={`font-bold leading-tight mb-1 ${
                          isMobile
                            ? "text-sm"
                            : isTablet
                            ? "text-base"
                            : "text-lg"
                        }`}
                      >
                        {slide.name}
                      </h2>
                      <p
                        className={`text-gray-300 leading-relaxed ${
                          isMobile
                            ? "text-xs line-clamp-2"
                            : isTablet
                            ? "text-sm line-clamp-3"
                            : "text-sm line-clamp-3"
                        }`}
                      >
                        {slide.description}
                      </p>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AnimeCarousel;