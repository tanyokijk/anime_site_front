import React from "react";
import { ChartSpline } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types/user";

interface ActivityBarChartProps {
  user: User | null;
  isLoading: boolean;
}

export default function ActivityBarChart({ user, isLoading }: ActivityBarChartProps) {
  // Отримуємо дані активності за місяці з API
  const monthlyData = user?.watch_time?.hours_by_month || {};
  
  // Конвертуємо об'єкт у масив для останніх 12 місяців
  const activityData = React.useMemo(() => {
    const now = new Date();
    const data = [];
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const hours = monthlyData[key] || 0;
      data.push(hours);
    }
    
    return data;
  }, [monthlyData]);

  // Обчислюємо максимальне значення для нормалізації
  const maxHours = Math.max(...activityData);
  
  // Якщо немає активності, не показуємо бари
  const hasActivity = maxHours > 0;

  return (
    <div className="hidden max-h-28 max-w-120 flex-col items-start justify-center gap-1 rounded-xl border border-white bg-transparent p-3 md:flex lg:w-90">
      <div className="flex items-center gap-2">
        <ChartSpline className="h-6 w-6 text-[#787880]" />
        <span className="text-[1rem] font-[500] text-[#787880]">
          Активність
        </span>
      </div>
      
      {isLoading ? (
        <Skeleton className="h-12 w-full bg-stone-500" />
      ) : !hasActivity ? (
        <div className="flex w-full h-12 items-center justify-center">
          <span className="text-sm text-[#787880]">Немає активності</span>
        </div>
      ) : (
        <div className="flex w-full justify-between">
          {activityData.map((hours, i) => {
            const normalizedHeight = maxHours > 0 ? (hours / maxHours) : 0;
            
            return (
              <div
                key={i}
                className="relative flex h-12 w-2.5 flex-col items-center justify-end lg:w-3 group"
                title={`${hours} годин`}
              >
                {/* Фон бару */}
                <div className="h-full w-full rounded-full bg-[#23242b] transition-all" />
                
                {/* Активна частина бару */}
                <div
                  className="absolute bottom-0 w-full rounded-full bg-[#46618E] transition-all duration-500 group-hover:bg-[#5A7BA8]"
                  style={{ height: `${Math.round(normalizedHeight * 48)}px` }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}