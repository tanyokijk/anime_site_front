import React from "react";
import { ChartPie } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types/user";

interface AnimeViewTimeChartProps {
  user: User | null;
  isLoading: boolean;
}

export default function AnimeViewTimeChart({ user, isLoading }: AnimeViewTimeChartProps) {
  const watchTime = user?.watch_time || {
    total_hours: 0,
    total_days: 0,
    total_months: 0,
    hours_by_month: {}
  };

  const months = watchTime.total_months;
  const days = watchTime.total_days;
  const totalHours = watchTime.total_hours;
  
  // Обчислюємо прогрес на основі годин (наприклад, 100 годин = 100% прогресу)
  const progress = Math.min(totalHours / 1000, 1); // Максимум 1000 годин для повного бару

  // Форматуємо текст для відображення
  const formatTimeText = () => {
    if (months > 0) {
      return `${months} ${months === 1 ? 'місяць' : months < 5 ? 'місяці' : 'місяців'} ${days} ${days === 1 ? 'день' : days < 5 ? 'дні' : 'днів'}`;
    }
    if (days > 0) {
      return `${days} ${days === 1 ? 'день' : days < 5 ? 'дні' : 'днів'}`;
    }
    return `${totalHours} ${totalHours === 1 ? 'година' : totalHours < 5 ? 'години' : 'годин'}`;
  };

  return (
    <div className="hidden max-h-28 w-90 flex-col items-start justify-center gap-1 rounded-xl border border-white bg-transparent p-3 md:flex">
      <div className="flex items-center gap-2">
        <ChartPie className="h-6 w-6 text-[#787880]" />
        <span className="text-[1rem] font-[500] text-[#787880]">Час аніме</span>
      </div>
      {isLoading ? (
        <Skeleton className="h-12 w-full bg-stone-500" />
      ) : (
        <>
          <div className="flex w-full items-center justify-between">
            <span className="text-[1.25rem] leading-tight font-bold text-white">
              {totalHours === 0 ? 'Ще не дивився' : formatTimeText()}
            </span>
            <span className="text-[1rem] font-[500] text-[#787880]">
              {totalHours} {totalHours === 1 ? 'година' : totalHours < 5 ? 'години' : 'годин'}
            </span>
          </div>
          <div className="mt-2 w-full">
            <div className="relative h-2.5 w-full">
              {/* Bar background */}
              <div className="absolute top-0 left-0 h-2.5 w-full rounded-full bg-[#23242b]" />
              {/* Bar foreground */}
              <div
                className="absolute top-0 left-0 h-2.5 rounded-full bg-[#46618E] transition-all duration-500"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}