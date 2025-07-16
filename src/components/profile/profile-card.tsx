"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { User } from "@/types/user";

interface ProfileCardProps {
  user: User | null;
  isLoading: boolean;
  isOnline?: boolean;
}

export default function ProfileCard({ user, isLoading, isOnline: isOnlineProp }: ProfileCardProps) {
  const avatarUrl = user?.avatar || "assets/mock-user-logo.png";
  const username = user?.name || "Користувач";
  const achievementsCount = user?.achievements_count || 0;
  const isOnline = isOnlineProp ?? (user?.last_seen_at === null || user?.is_online || false);
  const lastSeen = user?.formatted_last_seen || "";
  
  // Форматуємо дату народження
  const formatBirthday = (birthday: string) => {
    if (!birthday) return null;
    
    try {
      const date = new Date(birthday);
      return date.toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return null;
    }
  };

  const birthday = formatBirthday(user?.birthday || "");
  const gender = user?.gender === 'male' ? 'Чоловік' : user?.gender === 'female' ? 'Жінка' : null;

  return (
    <div className="z-1 flex w-full max-w-160 flex-col">
      <Card className="border-none bg-transparent p-0 shadow-none!">
        <CardContent className="flex flex-row gap-6 p-0">
          <div className="relative h-30 w-30 lg:h-50 lg:w-50 flex-shrink-0">
            {isLoading ? (
              <Skeleton className="h-30 w-30 rounded-md bg-stone-500 lg:h-50 lg:w-50" />
            ) : (
              <div className="relative">
                <Avatar className="h-30 w-30 cursor-pointer rounded-md border-none object-cover lg:h-50 lg:w-50">
                  <AvatarImage src={avatarUrl} alt={username} />
                </Avatar>
                {/* Індикатор онлайн статусу */}
                {isOnline && (
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-[#0f0f0f]"></div>
                )}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="relative flex flex-col gap-4 flex-1">
              <Skeleton className="h-8 max-w-40 rounded bg-stone-500" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-48 rounded bg-stone-500" />
                <Skeleton className="h-5 w-36 rounded bg-stone-500" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-full rounded bg-stone-500" />
                <Skeleton className="h-4 w-3/4 rounded bg-stone-500" />
              </div>
            </div>
          ) : (
            <div className="relative flex flex-col gap-2 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-[1.5rem] font-[700] text-white">
                  {username}
                </h1>
                {isOnline && (
                  <span className="text-sm text-green-400 font-medium">
                    • Онлайн
                  </span>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                {/* Досягнення та статус через dot */}
                <div className="flex items-center gap-2 text-[1rem] font-[500] text-[#918c8c]">
                  <span>
                    <span className="text-white">{achievementsCount}</span> досягнень
                  </span>
                  {!isOnline && lastSeen && (
                    <>
                      <span>•</span>
                      <span>Був в мережі {lastSeen}</span>
                    </>
                  )}
                </div>

                {/* Стать та дата народження через dot */}
                <div className="flex items-center gap-2 text-sm text-[#B6B6B6]">
                  {gender && <span>{gender}</span>}
                  {gender && birthday && <span>•</span>}
                  {birthday && <span>{birthday}</span>}
                </div>
              </div>
              
              {user?.description && (
                <p className="text-sm text-[#B6B6B6] max-w-full line-clamp-3 leading-relaxed mt-2">
                  {user.description}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}