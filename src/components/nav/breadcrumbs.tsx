"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, Users, Tag, List, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Menu } from "@headlessui/react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@components/ui/button";
import { useAuth } from "@/contexts/auth-context";
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
];

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const [searchOpen, setSearchOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [navOpen, setNavOpen] = React.useState(false);
  const notifBtnRef = React.useRef<HTMLButtonElement>(null);

  if (!pathname) return null;

  const parts = pathname.split("/").filter(Boolean);
  const currentBase = parts[0];
  const currentItem = NAV_ITEMS.find(item => item.href.includes(currentBase));
  const currentLabel = currentItem?.label || "Меню";
  const CurrentIcon = currentItem?.icon || LayoutGrid;

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
      ) : (
        <div className="relative">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-white border border-[#5B7CB2] text-base font-medium"
            onClick={() => setNavOpen((prev) => !prev)}
          >
            <CurrentIcon className="h-5 w-5 text-[#4B7FCC]" />
            {currentLabel}
            <ChevronDown className="h-4 w-4" />
          </Button>
          <div className={`${navOpen ? "block" : "hidden"} absolute left-0 mt-2 w-48 rounded-xl bg-[#1a1e2e] shadow-xl ring-1 ring-black/5 z-50`}>
            <div className="flex flex-col gap-2 p-2">
              {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
                <Button
                  key={href}
                  variant="ghost"
                  className="justify-start text-white hover:bg-[#2C3650] gap-2 text-base font-medium"
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
        </div>
      )}

      <div className="xs:gap-2 flex items-center gap-6 sm:gap-4">
        {!user ? (
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
            <button
              ref={notifBtnRef}
              className={`xs:w-8 xs:h-8 flex h-12 w-12 items-center justify-center rounded-xl border border-[#5B7CB2] bg-transparent p-0 transition sm:h-10 sm:w-10 ${notifOpen ? "bg-[#2C3650]" : "hover:bg-[#2C3650]"}`}
              onClick={() => setNotifOpen((v) => !v)}
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

            {/* Аватар і дропдаун */}
            <Menu as="div" className="relative">
              <Menu.Button className="focus:outline-none">
                <Image
                  src={user.avatar || "/default-avatar.png"}
                  alt="Аватар"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover border border-[#5B7CB2]"
                />
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 rounded-xl bg-[#1a1e2e] shadow-xl ring-1 ring-black/5 z-50 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/profile"
                      className={`block px-4 py-3 text-base font-medium ${active ? "bg-[#2C3650]" : ""} text-white`}
                    >
                      Профіль
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/anime/list"
                      className={`block px-4 py-3 text-base font-medium ${active ? "bg-[#2C3650]" : ""} text-white`}
                    >
                      Список аніме
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/settings"
                      className={`block px-4 py-3 text-base font-medium ${active ? "bg-[#2C3650]" : ""} text-white`}
                    >
                      Налаштування
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => router.push("/logout")}
                      className={`w-full text-left px-4 py-3 text-base font-medium ${active ? "bg-[#2C3650]" : ""} text-white`}
                    >
                      Вийти
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>

            <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
            <NotificationModal
              open={notifOpen}
              onClose={() => setNotifOpen(false)}
              anchorRef={notifBtnRef}
            />
          </>
        )}
      </div>
    </motion.header>
  );
};

export default Navbar;
