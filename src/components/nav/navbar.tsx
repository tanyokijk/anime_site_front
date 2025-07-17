"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, Users, Tag, List, ChevronDown, Play, BookOpen,Film, Link2, Image as ImageIcon, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Menu } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { createAuthenticatedFetch } from "@/contexts/auth-context";
import { API_BASE_URL } from "@/config";
import SearchModal from "./SearchModal";
import NotificationModal from "./NotificationModal";

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

const NAV_ITEMS = [
  { label: "Аніме", href: "/anime", icon: LayoutGrid },
  { label: "Персонажі", href: "/characters", icon: Users },
  { label: "Жанри", href: "/genres", icon: List },
  { label: "Теги", href: "/tags", icon: Tag },
  { label: "Студії", href: "/studios", icon: Film },
];

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const { user, isAuthenticated, logout, loading, token } = useAuth();

  const [searchOpen, setSearchOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [navOpen, setNavOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [currentAnimeName, setCurrentAnimeName] = React.useState<string | null>(null);
  const [animeNameLoading, setAnimeNameLoading] = React.useState(false);
  const [firstEpisodeSlug, setFirstEpisodeSlug] = React.useState<string | null>(null);
  const notifBtnRef = React.useRef<HTMLButtonElement>(null);

  // Fetch unread notifications count
  // const fetchUnreadCount = React.useCallback(async () => {
  //   if (!isAuthenticated || !token) return;

  //   try {
  //     const authenticatedFetch = createAuthenticatedFetch(token);
  //     const response = await authenticatedFetch(
  //       `${API_BASE_URL}notifications/unread-count`,
  //     );

  //     if (response.ok) {
  //       const data = await response.json();
  //       setUnreadCount(data.count || 0);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch unread notifications count:", error);
  //   }
  // }, [isAuthenticated, token]);

  // Fetch anime name and first episode by slug
  const fetchAnimeData = React.useCallback(async (slug: string) => {
    if (!slug) return;

    setAnimeNameLoading(true);
    try {
      const [animeRes, episodesRes] = await Promise.all([
        fetch(`${API_BASE_URL}animes/${slug}`, {
          cache: "force-cache",
        }),
        fetch(`${API_BASE_URL}animes/${slug}/episodes`, {
          cache: "force-cache",
        }),
      ]);

      if (animeRes.ok) {
        const animeData = await animeRes.json();
        setCurrentAnimeName(animeData.data?.name || null);
      } else {
        setCurrentAnimeName(null);
      }

      if (episodesRes.ok) {
        const episodesData = await episodesRes.json();
        const episodes = episodesData.data;
        if (episodes && episodes.length > 0) {
          // Знайти перший епізод (з найменшим номером)
          const firstEpisode = episodes.reduce((prev: any, current: any) => 
            (prev.number < current.number) ? prev : current
          );
          setFirstEpisodeSlug(firstEpisode.slug);
        } else {
          setFirstEpisodeSlug(null);
        }
      } else {
        setFirstEpisodeSlug(null);
      }
    } catch (error) {
      console.error("Failed to fetch anime data:", error);
      setCurrentAnimeName(null);
      setFirstEpisodeSlug(null);
    } finally {
      setAnimeNameLoading(false);
    }
  }, []);

  // Fetch unread count when user is authenticated
  // React.useEffect(() => {
  //   if (isAuthenticated) {
  //     fetchUnreadCount();
  //   } else {
  //     setUnreadCount(0);
  //   }
  // }, [isAuthenticated, fetchUnreadCount]);

  // Handle notification read (callback for NotificationModal)
  const handleNotificationsRead = React.useCallback(() => {
    setUnreadCount(0);
  }, []);

  // Update unread count when notification modal is opened
  const handleNotificationToggle = () => {
    setNotifOpen((v) => {
      const newState = !v;
      // If opening the modal, refresh unread count after a short delay
      // to account for any read status changes
      // if (newState) {
      //   setTimeout(() => {
      //     fetchUnreadCount();
      //   }, 500);
      // }
      return newState;
    });
  };

  if (!pathname) return null;

  const parts = pathname.split("/").filter(Boolean);
  const currentBase = parts[0];
  const currentItem = NAV_ITEMS.find((item) => item.href.includes(currentBase));
  const currentLabel = currentItem?.label || "Меню";
  const CurrentIcon = currentItem?.icon || LayoutGrid;

  // --- Breadcrumbs для /anime/[slug] ---
  const isAnimeSlugPage =
    parts[0] === "anime" &&
    parts[1] &&
    !["top", "watch", "create-room"].includes(parts[1]);

  // Визначаємо чи знаходимось на сторінці перегляду епізоду
  const isWatchPage = parts[0] === "anime" && parts[2] === "watch";

  // Fetch anime data when on anime slug page
  React.useEffect(() => {
    if ((isAnimeSlugPage || isWatchPage) && parts[1]) {
      fetchAnimeData(parts[1]);
    } else {
      setCurrentAnimeName(null);
      setFirstEpisodeSlug(null);
    }
  }, [isAnimeSlugPage, isWatchPage, parts[1], fetchAnimeData]);

  // Display anime name with fallback
  const displayAnimeName = currentAnimeName || parts[1] || "Завантаження...";

  // Визначаємо активний розділ
  const animeSection = isWatchPage 
    ? "Епізоди"
    : parts.length === 2
      ? "Загальне"
      : parts[2] === "characters"
        ? "Персонажі"
        : parts[2] === "related"
          ? "Пов'язане"
          : parts[2] === "media"
            ? "Медіа"
            : parts[2] === "authors"
              ? "Автори"
              : "Загальне";

  // Функція для переходу на епізоди
  const handleEpisodesClick = () => {
    if (firstEpisodeSlug) {
      router.push(`/anime/${parts[1]}/watch/${firstEpisodeSlug}`);
    } else {
      // Якщо немає епізодів, можна показати повідомлення або нічого не робити
      console.log("Епізоди недоступні");
    }
    setNavOpen(false);
  };

  const sectionLinks = [
    { label: "Загальне", href: `/anime/${parts[1]}`, action: null, icon: BookOpen },
    { label: "Персонажі", href: `/anime/${parts[1]}/characters`, action: null, icon: Users },
    { label: "Пов'язане", href: `/anime/${parts[1]}/related`, action: null, icon: Link2 },
    { label: "Медіа", href: `/anime/${parts[1]}/media`, action: null, icon: ImageIcon },
    { label: "Автори", href: `/anime/${parts[1]}/authors`, action: null, icon: UserCheck },
    { 
      label: "Епізоди", 
      href: null, 
      action: handleEpisodesClick,
      disabled: !firstEpisodeSlug,
      icon: Play
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still redirect even if logout request fails
      router.push("/");
    }
  };

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="z-50 flex w-full items-center justify-between bg-transparent px-8 py-4"
    >
      {pathname === "/" ? (
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Логотип"
            width={256}
            height={256}
            className="h-18 w-18 object-contain"
          />
        </Link>
      ) : (isAnimeSlugPage || isWatchPage) ? (
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="flex items-center gap-2 border border-[#5B7CB2] text-white"
            onClick={() => router.push("/anime")}
          >
            <CurrentIcon className="h-5 w-5 text-[#4B7FCC]" />
            {currentLabel}
            <ChevronDown className="h-4 w-4" />
          </Button>
          <span className="text-sm text-white">/</span>
          <span className="inline-block h-2 w-2 rounded-full bg-[#23A6D5]"></span>
          <Link
            href={`/anime/${parts[1]}`}
            className="text-sm font-medium text-white max-w-[200px] truncate"
            title={displayAnimeName}
          >
            {animeNameLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                Завантаження...
              </div>
            ) : (
              displayAnimeName
            )}
          </Link>
          <span className="text-sm text-white">/</span>
          <div className="relative">
            <Button
              variant="outline"
              className="flex items-center gap-2 border border-[#5B7CB2] text-white"
              onClick={() => setNavOpen((open) => !open)}
              type="button"
            >
              {animeSection}
              <ChevronDown className="h-4 w-4" />
            </Button>
            {navOpen && (
              <div className="absolute left-0 z-50 mt-2 w-48 rounded-xl bg-[#1a1e2e] shadow-xl ring-1 ring-black/5">
                <ul className="flex flex-col py-2">
                  {sectionLinks.map((section) => (
                    <Button
                      key={section.label}
                      variant="ghost"
                      className={`justify-start gap-2 text-white hover:bg-[#2C3650] ${
                        section.disabled ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={section.disabled}
                      onClick={() => {
                        if (section.action) {
                          section.action();
                        } else if (section.href) {
                          setNavOpen(false);
                          router.push(section.href);
                        }
                      }}
                    >
                      {section.icon && <section.icon className="h-4 w-4" />}
                      {section.label}
                      {section.label === "Епізоди" && !firstEpisodeSlug && (
                        <span className="text-xs opacity-60">(недоступно)</span>
                      )}
                    </Button>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="relative">
          <Button
            variant="outline"
            className="flex items-center gap-2 border border-[#5B7CB2] text-white"
            onClick={() => setNavOpen((prev) => !prev)}
          >
            <CurrentIcon className="h-5 w-5 text-[#4B7FCC]" />
            {currentLabel}
            <ChevronDown className="h-4 w-4" />
          </Button>
          {navOpen && (
            <div className="absolute left-0 z-50 mt-2 w-48 rounded-xl bg-[#1a1e2e] shadow-xl ring-1 ring-black/5">
              <div className="flex flex-col gap-2 p-2">
                {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
                  <Button
                    key={href}
                    variant="ghost"
                    className="justify-start gap-2 text-white hover:bg-[#2C3650]"
                    onClick={() => {
                      setNavOpen(false);
                      router.push(href);
                    }}
                  >
                    <Icon className="h-5 w-5 text-[#4B7FCC]" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="xs:gap-2 flex items-center gap-6 sm:gap-4">
        {!isAuthenticated ? (
          <>
            <button
              className="rounded-xl border border-[#5B7CB2] bg-transparent px-6 py-2 text-sm font-medium text-white hover:bg-[#232b45]"
              onClick={() => router.push("/login")}
            >
              Увійти
            </button>
            <button
              className="rounded-xl bg-[#4B7FCC] px-6 py-2 text-sm font-medium text-white hover:bg-[#3a65b2]"
              onClick={() => router.push("/register")}
            >
              Реєстрація
            </button>
          </>
        ) : (
          <>
            {/* Пошук */}
            <div
              className="hidden w-72 max-w-xs cursor-pointer items-center rounded-xl border border-[#5B7CB2] px-4 py-2 md:flex"
              onClick={() => setSearchOpen(true)}
            >
              <svg
                className="mr-2 h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Пошук..."
                className="w-full cursor-pointer bg-transparent text-white placeholder-gray-400 outline-none"
                readOnly
              />
            </div>

            {/* Мобільна кнопка пошуку */}
            <button
              className="xs:w-8 xs:h-8 flex h-12 w-12 items-center justify-center rounded-xl border border-[#5B7CB2] bg-transparent p-0 hover:bg-[#2C3650] sm:h-10 sm:w-10 md:hidden"
              onClick={() => setSearchOpen(true)}
            >
              <svg
                className="xs:w-4 xs:h-4 h-5 w-5 text-white sm:h-5 sm:w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Кнопка нотифікацій */}
            <div className="relative">
              <button
                ref={notifBtnRef}
                className={`xs:w-8 xs:h-8 flex h-12 w-12 items-center justify-center rounded-xl border border-[#5B7CB2] bg-transparent p-0 transition sm:h-10 sm:w-10 ${notifOpen ? "bg-[#2C3650]" : "hover:bg-[#2C3650]"}`}
                onClick={handleNotificationToggle}
              >
                <svg
                  className="xs:w-4 xs:h-4 h-5 w-5 text-white sm:h-5 sm:w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              {/* Red notification badge */}
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </div>
              )}
            </div>

            {/* Аватар і дропдаун */}
            <Menu as="div" className="relative">
              <Menu.Button className="focus:outline-none">
                <Image
                  src={user?.avatar || "/default-avatar.png"}
                  alt="Аватар"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full border border-[#5B7CB2] object-cover"
                />
              </Menu.Button>
              <Menu.Items className="absolute right-0 z-50 mt-2 w-48 rounded-xl bg-[#1a1e2e] shadow-xl ring-1 ring-black/5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/profile"
                      className={`block rounded-t-xl px-4 py-3 text-sm ${active ? "bg-[#2C3650]" : ""} text-white`}
                    >
                      Профіль
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/anime/list"
                      className={`block px-4 py-3 text-sm ${active ? "bg-[#2C3650]" : ""} text-white`}
                    >
                      Список аніме
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/profile/settings"
                      className={`block px-4 py-3 text-sm ${active ? "bg-[#2C3650]" : ""} text-white`}
                    >
                      Налаштування
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      disabled={loading}
                      className={`w-full rounded-b-xl px-4 py-3 text-left text-sm ${active ? "bg-[#2C3650]" : ""} text-white ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      {loading ? "Виходимо..." : "Вийти"}
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>

            <SearchModal
              open={searchOpen}
              onClose={() => setSearchOpen(false)}
            />
            <NotificationModal
              isOpen={notifOpen}
              onClose={() => setNotifOpen(false)}
              anchorRef={notifBtnRef}
              onNotificationsRead={handleNotificationsRead}
            />
          </>
        )}
      </div>
    </motion.header>
  );
};

export default Navbar;