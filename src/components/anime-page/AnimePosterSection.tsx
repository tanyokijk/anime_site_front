"use client";

import React, { useState } from "react";
import ActionButton from "@/components/ui/action-button";
import ArrowDown from "@/assets/arrow-down.svg";
import { Play, Heart, Clock, Ban, StopCircle, Check, Monitor } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { API_BASE_URL } from "@/config";
import { motion, AnimatePresence } from "framer-motion";
import { createAuthenticatedFetch } from "@/contexts/auth-context";

interface AnimePosterSectionProps {
  poster: string;
  name: string;
  animeId: string;
  isLoading?: boolean;
  token?: string | undefined; // Токен через пропси
}

// Типізовані ключі для списків користувача
type UserListType = 'favorite' | 'not watching' | 'watching' | 'planned' | 'stopped' | 'rewatching' | 'watched';

const USER_LIST_TYPES: Record<UserListType, string> = {
  favorite: "Улюблене",
  "not watching": "Не дивлюся",
  watching: "Дивлюся",
  planned: "В планах",
  stopped: "Перестав",
  rewatching: "Передивляюсь",
  watched: "Переглянуто",
};

const ICON_MAP: Record<UserListType, React.ReactElement> = {
  favorite: <Heart className="w-4 h-4 mr-2" />,
  "not watching": <Ban className="w-4 h-4 mr-2" />,
  watching: <Monitor className="w-4 h-4 mr-2" />,
  planned: <Clock className="w-4 h-4 mr-2" />,
  stopped: <StopCircle className="w-4 h-4 mr-2" />,
  rewatching: <Monitor className="w-4 h-4 mr-2" />,
  watched: <Check className="w-4 h-4 mr-2" />,
};

const AnimePosterSection: React.FC<AnimePosterSectionProps> = ({
  poster,
  name,
  animeId,
  isLoading = false,
  token,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isListPanelOpen, setIsListPanelOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const authenticatedFetch = createAuthenticatedFetch(token || "");

  const handleAddToList = async (listType: UserListType) => {
    if (!isAuthenticated || !user || !token) {
      alert("Увійдіть, щоб додати аніме до списку");
      return;
    }

    console.log("Додавання до списку:", {
      listType,
      animeId,
      userId: user.id,
      hasToken: !!token,
      tokenLength: token?.length
    });

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await authenticatedFetch(`${API_BASE_URL}user-lists`, {
        method: "POST",
        body: JSON.stringify({
          user_id: user.id,
          listable_id: animeId,
          listable_type: "AnimeSite\\Models\\Anime",
          type: listType,
        }),
      });

      console.log("Відправлені дані:", {
        user_id: user.id,
        listable_id: animeId,
        listable_type: "AnimeSite\\Models\\Anime",
        type: listType,
      });

      console.log("Відповідь сервера:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Сесія закінчилася. Будь ласка, увійдіть знову.");
          logout();
          return;
        }
        if (response.status === 422) {
          const errorData = await response.json();
          console.error("Помилка валідації:", errorData);
          throw new Error(errorData.message || "Невалідні дані");
        }
        if (response.status === 409) {
          throw new Error("Аніме вже додано до цього списку");
        }
        throw new Error(`Помилка додавання до списку: ${response.status}`);
      }

      const data = await response.json();
      console.log("Anime added to list:", data);
      setSuccess(`Додано до списку "${USER_LIST_TYPES[listType]}"`);
      setIsListPanelOpen(false);
      
      // Прибираємо повідомлення успіху через 3 секунди
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      console.error("Failed to add anime to list:", err);
      setError(err instanceof Error ? err.message : "Помилка додавання");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Функція для отримання іконки типу списку
  const getIcon = (type: string): React.ReactElement => {
    if (type in ICON_MAP) {
      return ICON_MAP[type as UserListType];
    }
    return <Monitor className="w-4 h-4 mr-2" />; // fallback іконка
  };

  return (
    <div className="flex flex-col items-center gap-4 min-w-[260px]">
      {isLoading ? (
        <Skeleton height={360} width={260} borderRadius={16} />
      ) : (
        <Image
          src={poster}
          alt={name}
          width={260}
          height={400}
          className="rounded-2xl w-full h-[500px] md:w-[260px] md:h-[400px] object-cover shadow-xl border border-zinc-700"
        />
      )}
      <div className="flex flex-col gap-3 w-full mt-2 relative">
        {isLoading ? (
          <>
            <Skeleton
              height={44}
              width={220}
              borderRadius={12}
              className="w-full"
            />
            <Skeleton
              height={44}
              width={220}
              borderRadius={12}
              className="w-full"
            />
          </>
        ) : (
          <>
            {/* Кнопка "Додати до списку" */}
            <div className="relative">
              <ActionButton
                text="Додати до списку"
                icon={<ArrowDown size={22} />}
                colorClass={`${
                  isSubmitting 
                    ? "bg-zinc-600 text-gray-400 cursor-not-allowed" 
                    : "bg-zinc-700 text-white hover:bg-zinc-800"
                }`}
                className="w-full"
                onClick={() => {
                  if (!isSubmitting) {
                    setIsListPanelOpen(!isListPanelOpen);
                    setError(null);
                    setSuccess(null);
                  }
                }}
              />
              
              {/* Індикатор завантаження */}
              {isSubmitting && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-700/80 rounded-xl">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Випадаюча панель зі списками */}
            <AnimatePresence>
              {isListPanelOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-[#1a1e2e] rounded-xl shadow-xl border border-zinc-700 z-10 overflow-hidden"
                >
                  <div className="flex flex-col gap-1 p-2">
                    {(Object.entries(USER_LIST_TYPES) as [UserListType, string][]).map(([type, label]) => (
                      <button
                        key={type}
                        onClick={() => handleAddToList(type)}
                        disabled={isSubmitting}
                        className={`flex items-center text-left px-4 py-2 text-sm text-white hover:bg-[#2C3650] rounded-lg transition-colors ${
                          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {getIcon(type)}
                        {label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Повідомлення про помилку */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-900/50 border border-red-500 rounded-lg p-3 text-red-200 text-sm text-center"
              >
                {error}
                <button
                  onClick={() => setError(null)}
                  className="ml-2 text-red-300 hover:text-white"
                >
                  ✕
                </button>
              </motion.div>
            )}

            {/* Повідомлення про успіх */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-900/50 border border-green-500 rounded-lg p-3 text-green-200 text-sm text-center"
              >
                ✓ {success}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnimePosterSection;