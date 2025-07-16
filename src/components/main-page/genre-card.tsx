"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface AnimeShort {
  poster: string;
}
interface GenreCardProps {
  name: string;
  description: string;
  slug:string;
  animes_posters: AnimeShort[];
}

const GenreCard: React.FC<GenreCardProps> = ({
  name,
  description,
  slug,
  animes_posters,
}) => {
  const [isMobile, setIsMobile] = useState<null | boolean>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile === null) return null;

console.log({animes_posters});
  return (
    // <Link href={href} className="block w-full group" tabIndex={0}>
      <div className="w-full flex flex-row relative cursor-pointer group-hover:opacity-90 transition-opacity">
        <div className="flex flex-col justify-start z-10 flex-shrink-0 w-[200px] md:w-[300px] lg:w-[420px]">
          <h2 className="text-white text-3xl font-bold mb-6 leading-tight">
            {name}
          </h2>
          <div className="text-gray-300 text-base leading-relaxed font-normal break-words px-2 max-w-full">
            {description}
          </div>
        </div>

        <div className="flex items-center ml-3 md:ml-12 flex-grow w-full">
          <div className="flex flex-row items-center relative">
          {Array.isArray(animes_posters) && (isMobile ? animes_posters.slice(0, 1) : animes_posters).map((item, idx) => (
  <div
    key={idx}
    className="relative"
    style={{
      zIndex: animes_posters.length - idx,
      marginLeft: idx === 0 ? 0 : -16,
    }}
  >
    <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-600 to-blue-600 w-32 h-48 md:w-[140px] md:h-[200px]">
      <Image
        src={item.poster}
        alt={`anime-${idx}`}
        fill
        className="w-full h-full object-cover"
        style={{ filter: "brightness(0.9) contrast(1.1)" }}
      />
    </div>
  </div>
))}

          </div>
          <div className="flex-grow" />
          <div className="ml-3 md:ml-8 flex items-center justify-end">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-opacity-10 flex items-center justify-center cursor-pointer hover:bg-opacity-20 transition-all">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 49"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M18.0001 12.0469C18.0001 12.0469 30 20.8847 30 24.0469C30 27.2093 18 36.0469 18 36.0469"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    // </Link>
  );
};

export default GenreCard;
