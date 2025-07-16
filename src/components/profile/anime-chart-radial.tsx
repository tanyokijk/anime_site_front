import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ListCounts {
  watching: number;
  planned: number;
  watched: number;
  stopped: number;
  rewatching: number;
}

interface AnimeChartRadialProps {
  data: ListCounts;
  isLoading: boolean;
}

export function AnimeChartRadial({ data, isLoading }: AnimeChartRadialProps) {
  if (isLoading) {
    return <Skeleton className="h-40 w-40 rounded-full bg-stone-500" />;
  }

  const total = data.watching + data.planned + data.watched + data.stopped + data.rewatching;
  const completedCount = data.watched; // Завершено = переглянуто
  
  if (total === 0) {
    return (
      <div className="relative flex h-40 w-40 items-center justify-center">
        <svg width="160" height="160" className="transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#23242b"
            strokeWidth="16"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">0</span>
          <span className="text-base text-[#787880]">завершено</span>
        </div>
      </div>
    );
  }

  // Обчислюємо кути для кожного сегмента з правильними кольорами
  const segments = [
    { value: data.watching, color: "#1CB5E0", name: "Дивлюсь" },
    { value: data.planned, color: "#DFD50A", name: "Заплановано" },
    { value: data.watched, color: "#4CAF50", name: "Переглянуто" },
    { value: data.stopped, color: "#FF4B55", name: "Закинуто" },
    { value: data.rewatching, color: "#787880", name: "Передивляюся" },
  ].filter(segment => segment.value > 0);

  const radius = 70;
  const strokeWidth = 16;
  const centerX = 80;
  const centerY = 80;
  const circumference = 2 * Math.PI * radius;

  let currentAngle = 0;

  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      <svg width="160" height="160" className="transform -rotate-90">
        {/* Фон кола */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="#23242b"
          strokeWidth={strokeWidth}
        />
        
        {/* Сегменти */}
        {segments.map((segment, index) => {
          const percentage = segment.value / total;
          const strokeDasharray = `${percentage * circumference} ${circumference}`;
          const strokeDashoffset = -currentAngle * circumference;
          
          currentAngle += percentage;
          
          return (
            <circle
              key={index}
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300"
            />
          );
        })}
      </svg>
      
      {/* Кількість завершених в центрі */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{completedCount}</span>
        <span className="text-base text-[#787880]">завершено</span>
      </div>
    </div>
  );
}