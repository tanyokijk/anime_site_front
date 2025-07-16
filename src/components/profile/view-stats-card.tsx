import { AnimeChartRadial } from "@/components/profile/anime-chart-radial";
import { Card, CardContent } from "@/components/ui/card";
import { AnimeStatsBullet } from "@/components/profile/anime-stats-bullet";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types/user";

interface ViewStatsCardProps {
  user: User | null;
  isLoading: boolean;
}

export function ViewStatsCard({ user, isLoading }: ViewStatsCardProps) {
  const listCounts = user?.list_counts || {
    watching: 0,
    planned: 0,
    watched: 0,
    stopped: 0,
    rewatching: 0
  };

  return (
    <>
      {isLoading ? (
        <Skeleton className="h-50 w-full bg-stone-500 md:max-w-100" />
      ) : (
        <Card className="z-1 m-0 flex w-full bg-transparent px-3 py-0 md:max-w-100">
          <CardContent className="flex flex-row justify-around p-0! py-0!">
            <AnimeChartRadial 
              data={listCounts} 
              isLoading={isLoading} 
            />
            <div className="flex flex-col items-center justify-center gap-4">
              <AnimeStatsBullet
                text="Дивлюсь"
                number={listCounts.watching}
                circleColor="#2b94ab"
              />
              <AnimeStatsBullet
                text="Заплановано"
                number={listCounts.planned}
                circleColor="#ab872b"
              />
              <AnimeStatsBullet
                text="Переглянуто"
                number={listCounts.watched}
                circleColor="#28a745"
              />
              <AnimeStatsBullet
                text="Закинуто"
                number={listCounts.stopped}
                circleColor="#952828"
              />
              <AnimeStatsBullet
                text="Передивляюся"
                number={listCounts.rewatching}
                circleColor="#6f42c1"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}