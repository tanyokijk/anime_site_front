import { Grid2x2, MoveRight } from "lucide-react";
import AnimeHistoryHeader from "@/components/profile/anime-history-header";
import AnimeCard from "@/components/profile/anime-card";
import { User } from "@/types/user";

interface AnimeHistoryProps {
  user: User;
  isLoading: boolean;
}

export default function AnimeHistory({ user, isLoading }: AnimeHistoryProps) {
  const episodes = user.last_watched_episodes || [];

  return (
    <div className="flex w-full flex-col gap-4 md:w-100">
      <AnimeHistoryHeader />
      {episodes.length > 0 ? (
        episodes.map((watch) => (
          <AnimeCard
            key={watch.id}
            animeName={watch.episode.anime.name}
            watchedAge={watch.progress_time} // або обчисли час у хвилинах/годинах
            url={watch.episode.anime.poster}
            isLoading={isLoading}
          />
        ))
      ) : (
        <p className="text-sm text-gray-400">Немає останніх переглядів</p>
      )}
    </div>
  );
}
