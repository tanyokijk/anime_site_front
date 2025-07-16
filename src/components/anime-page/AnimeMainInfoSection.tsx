import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ActionButton from "@/components/ui/action-button";
import StandartButtonIcon from "@/components/ui/standart-button-icon";
import SectionHeader from "@/components/shared/section-header";
import Rating from "@/components/ui/rating";
import { Play, Share2Icon, EllipsisVertical } from "lucide-react";
import WatchTogether from "@/assets/watch-together.svg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Episode {
  id: string;
  slug: string;
  number: number;
  name: string;
}

interface AnimeMainInfoSectionProps {
  anime: any;
  tags: string[];
  description: string;
  isLoading?: boolean;
  isMainPage?: boolean; // Новий параметр
}

const AnimeMainInfoSection: React.FC<AnimeMainInfoSectionProps> = ({
  anime,
  tags,
  description,
  isLoading = false,
  isMainPage = true, // За замовчуванням true для зворотної сумісності
}) => {
  const router = useRouter();
  const [firstEpisodeSlug, setFirstEpisodeSlug] = useState<string | null>(null);
  const [episodesLoading, setEpisodesLoading] = useState(false);

  // Отримати перший епізод аніме
  useEffect(() => {
    const fetchFirstEpisode = async () => {
      if (!anime?.slug || isLoading) return;
      
      try {
        setEpisodesLoading(true);
        const response = await fetch(`http://127.0.0.1:8000/api/v1/animes/${anime.slug}/episodes`);
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          // Знайти перший епізод (з найменшим номером)
          const firstEpisode = data.data.reduce((prev: Episode, current: Episode) => 
            (prev.number < current.number) ? prev : current
          );
          setFirstEpisodeSlug(firstEpisode.slug);
        } else {
          setFirstEpisodeSlug(null);
        }
      } catch (error) {
        console.error('Failed to fetch episodes:', error);
        setFirstEpisodeSlug(null);
      } finally {
        setEpisodesLoading(false);
      }
    };

    fetchFirstEpisode();
  }, [anime?.slug, isLoading]);

  // Обробник кліку для перегляду першого епізоду
  const handleWatchFirstEpisode = () => {
    if (firstEpisodeSlug && anime?.slug && !isLoading && !episodesLoading) {
      router.push(`/anime/${anime.slug}/watch/${firstEpisodeSlug}`);
    }
  };

  // Визначити стан кнопки перегляду
  const getWatchButtonState = () => {
    if (isLoading || episodesLoading) {
      return {
        text: "Завантаження...",
        colorClass: "bg-gray-500 text-white cursor-not-allowed",
        onClick: () => {} // Пустий обробник для disabled стану
      };
    }
    
    if (!firstEpisodeSlug) {
      return {
        text: "Епізоди недоступні",
        colorClass: "bg-gray-500 text-white opacity-50 cursor-not-allowed",
        onClick: () => {} // Пустий обробник для disabled стану
      };
    }
    
    return {
      text: "Дивитися E1",
      colorClass: "bg-[#4B7FCC] text-white hover:bg-[#3c70bd]",
      onClick: handleWatchFirstEpisode
    };
  };

  const watchButtonState = getWatchButtonState();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
        <div className="flex flex-col w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mb-1">
            {isLoading ? (
              <Skeleton height={36} width={320} />
            ) : (
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {anime.name}
              </h1>
            )}
          </div>
          {isLoading ? (
            <Skeleton height={24} width={180} className="mb-2" />
          ) : (
            anime.seo?.title && (
              <div className="text-lg text-zinc-400 mb-2">{anime.seo.title}</div>
            )
          )}
          {isLoading ? (
            <Skeleton height={24} width={120} />
          ) : (
            <Rating
              localRating={anime.localRating}
              imdb={anime.imdb_score}
              maxRating={10}
            />
          )}
        </div>
      </div>
      
      <div className="flex flex-row flex-wrap items-center gap-3 min-h-[27px]">
        {isLoading ? (
          <>
            <Skeleton height={24} width={60} />
            <Skeleton height={24} width={60} />
            <Skeleton height={24} width={60} />
          </>
        ) : (
          <>
            {tags &&
              tags.map((tag, idx) => (
                <span
                  key={tag + idx}
                  className="font-sans text-white text-base font-normal leading-6 underline underline-dotted underline-offset-4 decoration-[#49638A] cursor-pointer bg-none rounded-none p-0"
                >
                  {tag}
                </span>
              ))}
          </>
        )}
      </div>
      
      {/* Кнопки дій - показуємо тільки на головній сторінці */}
      {isMainPage && (
        <div className="items-center text-center content-center justify-center">
          <div className="flex flex-row gap-3 mb-4 justify-center content-center items-center">
            {isLoading ? (
              <>
                <Skeleton height={44} width={120} />
                <Skeleton height={44} width={120} />
                <Skeleton height={44} width={44} />
                <Skeleton height={44} width={44} />
              </>
            ) : (
              <>
                <ActionButton
                  text={watchButtonState.text}
                  icon={<Play size={22} />}
                  colorClass={watchButtonState.colorClass}
                  className="w-full"
                  onClick={watchButtonState.onClick}
                />
                {/* <ActionButton
                  text="Дивитись разом"
                  icon={<WatchTogether size={22} />}
                  colorClass="bg-[#D06005] text-white hover:bg-[#c25903]"
                  className="w-full"
                /> */}
                <StandartButtonIcon
                  className="w-23"
                  icon={<Share2Icon color="white" size={22} />}
                />
                <StandartButtonIcon
                  icon={<EllipsisVertical size={22} color="white" />}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Секція опису - показуємо тільки на головній сторінці */}
      {isMainPage && (
        <div className="items-center text-center content-center justify-center">
          {isLoading ? (
            <>
              <Skeleton height={32} width={120} className="mb-2" />
              <div className="text-zinc-200 text-[20px] leading-[1.5] text-left">
                <Skeleton height={24} width={500} className="mb-2" />
                <Skeleton height={24} width={400} className="mb-2" />
                <Skeleton height={24} width={300} className="mb-2" />
              </div>
            </>
          ) : (
            <>
              <SectionHeader title="Опис" badge="UA" className="mb-2" />
              <div className="text-zinc-200 text-[20px] leading-[1.5] text-left">
                <p>{description}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AnimeMainInfoSection;