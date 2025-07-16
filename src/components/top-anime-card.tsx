"use client";

import { FC, forwardRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star, Crown } from "lucide-react";

interface TopAnimeCardProps {
  image: string;
  title: string;
  year: number;
  type: string;
  rank: number;
  rating: number;
  cardClassName?: string;
}

const TopAnimeCard = forwardRef<HTMLDivElement, TopAnimeCardProps>(({
  image,
  title,
  year,
  type,
  rank,
  rating,
  cardClassName = "",
}, ref) => {
  const isTop1 = rank === 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{
        scale: 1.04,
      }}
      className={[
        "flex cursor-pointer flex-col font-sans text-white transition-transform duration-200",
        cardClassName,
        !cardClassName?.includes("w-") ? "w-[260px]" : "",
        !cardClassName?.includes("min-w-") ? "min-w-[260px]" : "",
      ].join(" ")}
    >
      {/* Зображення */}
      <div className="relative h-[390px] w-full overflow-hidden rounded-2xl">
        <Image
          src={image}
          alt={title}
          fill
          className="rounded-2xl object-cover"
          sizes="260px"
        />
      </div>

      {/* Назва */}
      <p className="mt-2 truncate text-[17px] leading-tight font-semibold">
        {title}
      </p>

      {/* Рік + тип */}
      <p className="mt-0.5 text-sm text-neutral-400">
        {year} ● {type}
      </p>

      {/* Ранг + Рейтинг */}
      <div className="mt-1 flex items-center justify-between px-[2px]">
        {/* Топ */}
        <div className="flex items-center text-[14px] font-semibold text-white">
          <Crown
            className={`mr-1 h-[16px] w-[16px] ${
              isTop1 ? "text-yellow-400" : "text-white"
            }`}
            fill={isTop1 ? "#facc15" : "white"}
          />
          {rank}
        </div>

        {/* Рейтинг */}
        <div className="flex items-center text-[14px] font-semibold text-white">
          {rating.toFixed(2)}
          <Star className="ml-1 h-[16px] w-[16px] fill-white text-white" />
        </div>
      </div>
    </motion.div>
  );
});

TopAnimeCard.displayName = 'TopAnimeCard';

export default TopAnimeCard;