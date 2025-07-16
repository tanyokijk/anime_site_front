"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star, Crown } from "lucide-react";
import Link from "next/link";

interface TopAnimeCardProps {
  image: string;
  title: string;
  year: number| undefined;
  kind: string;
  rank?: number| null;
  imdb_score: number;
  showRank?: boolean;
  href?: string;
  small?: boolean;
  cardClassName?: string;
  slug: string; // Додано slug для навігації
}

const TopAnimeCard: FC<TopAnimeCardProps> = ({
  image,
  title,
  year,
  kind,
  rank,
  imdb_score,
  showRank = true,
  href = "#",
  small = false,
  cardClassName = "",
  slug,
}) => {
  const isTop1 = rank === 1;

  return (
    <Link href={`/anime/${slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        whileHover={{
          scale: 1.04,
        }}
        className={[
          small
            ? "xs:min-w-0 flex min-w-[140px] cursor-pointer flex-col font-sans text-white transition-transform duration-200 sm:w-[170px]"
            : "xs:min-w-0 flex min-w-[200px] cursor-pointer flex-col font-sans text-white transition-transform duration-200 sm:w-[250px]",
          cardClassName,
        ].join(" ")}
      >
        <div
          className={
            small
              ? "relative h-[200px] w-full overflow-hidden rounded-2xl sm:h-[250px]"
              : "relative h-[250px] w-full overflow-hidden rounded-2xl sm:h-[390px]"
          }
        >
          <Image
            src={image}
            alt={title}
            fill
            className="rounded-2xl object-cover"
            sizes={small ? "170px" : "250px"}
            priority
          />
        </div>

        <p className="mt-2 truncate text-[17px] leading-tight font-semibold">
          {title}
        </p>

        <p className="mt-0.5 text-sm text-neutral-400">
          {year} ● {kind}
        </p>
        {/* {showRank && ( */}
          <div className="mt-1 flex items-center justify-between px-[2px]">
            <div className="flex items-center text-[14px] font-semibold text-white">
              <Crown
                className={`mr-1 h-[16px] w-[16px] ${
                  isTop1 ? "text-yellow-400" : "text-white"
                }`}
                fill={isTop1 ? "#facc15" : "white"}
              />
              {rank}
            </div>

            <div className="flex items-center text-[14px] font-semibold text-white">
              {imdb_score.toFixed(2)}
              <Star className="ml-1 h-[16px] w-[16px] fill-white text-white" />
            </div>

          </div>
        {/* )} */}
      </motion.div>
    </Link>
  );
};

export default TopAnimeCard;
