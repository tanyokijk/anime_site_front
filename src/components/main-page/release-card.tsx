import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ReleaseCardProps {
  id: string;
  anime_id: string;
  anime_name: string;
  air_date: string;
  month: string;
  number: number;
  slug: string;
  anime_poster: string;
}

function getEpisodesText(episodes: number) {
  const lastTwo = episodes % 100;
  const last = episodes % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return `${episodes} епізодів`;
  if (last === 1) return `${episodes} епізод`;
  if (last >= 2 && last <= 4) return `${episodes} епізоди`;
  return `${episodes} епізодів`;
}

const ReleaseCard: React.FC<ReleaseCardProps> = ({
  id,
  anime_id,
  anime_name,
  air_date,
  month,
  number,
  slug,
  anime_poster,
}) => (
  <Link href={`/anime/${slug}`}>
    <div className="w-full h-[140px] rounded-2xl px-4 py-3 flex items-center cursor-pointer hover:bg-gray-800/30 transition-colors duration-200">
      <div className="w-[120px] h-[180px] rounded-xl overflow-hidden flex-shrink-0 mr-4">
        <Image src={anime_poster} alt={anime_name} width={120} height={180} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="text-white text-lg font-semibold leading-tight whitespace-normal break-words">
          {anime_name}
        </div>
        <div className="text-gray-400 text-xs whitespace-normal break-words">
          {anime_name}
        </div>
        <div className="flex items-center mt-1 gap-3 justify-between w-full">
          <div className="text-gray-400 text-sm">{getEpisodesText(number)}</div>
          <span
            className="border border-[#4B7FCC] rounded-xl px-3 py-1 text-[#4B7FCC] font-medium text-sm leading-none"
            style={{ lineHeight: "20px" }}
          >
            {air_date}
          </span>
        </div>
      </div>
    </div>
  </Link>
);

export default ReleaseCard;