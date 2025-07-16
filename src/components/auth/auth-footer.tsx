import React from "react";
import Image from "next/image";
import { API_BASE_URL } from "@/config";

type AuthMode = "login" | "register";

interface AuthFooterProps {
  mode?: AuthMode;
}

export function AuthFooter({ mode = "login" }: AuthFooterProps) {
  const handleGoogleAuth = () => {
    window.location.href = `${API_BASE_URL}auth/google`;
  };

  return (
    <div className="flex flex-col gap-6 items-center justify-center w-full mt-4">
      <Image
        className="rotate-180 w-full"
        src="/assets/auth/separator-line.svg"
        alt="Logo"
        width={75}
        height={10}
        unoptimized
      />

      <div className="flex flex-col gap-6 mt-6 items-center">
        {mode === "login" ? (
          <div className="flex flex-row items-center gap-2">
            <span className="text-blue font-sans text-base md:text-lg">
              Немає аккаунту?
            </span>
            <a
              href="/register"
              className="text-white font-sans text-base md:text-lg underline underline-offset-4"
            >
              Реєстрація
            </a>
          </div>
        ) : (
          <div className="flex flex-row items-center gap-2">
            <span className="text-blue font-sans text-base md:text-lg">
              Вже є аккаунт?
            </span>
            <a
              href="/login"
              className="text-white font-sans text-base md:text-lg underline underline-offset-4"
            >
              Увійти
            </a>
          </div>
        )}

        <div className="text-white font-sans text-base md:text-lg text-center">
          Вхід за допомогою
        </div>

        <div className="flex flex-row items-center gap-[3rem]">
          <button
            onClick={handleGoogleAuth}
            aria-label="Google"
            className="flex items-center justify-center w-[3rem] h-[3rem] md:w-18 md:h-18 rounded-full bg-blue hover:bg-dark-blue hover:cursor-pointer transition-colors"
          >
            <Image
              className="w-6 h-6 md:w-13 md:h-13 text-white bg-transparent rounded-full"
              src="/assets/auth/google.svg"
              alt="Google"
              width={24}
              height={24}
              unoptimized
            />
          </button>
        </div>
      </div>
    </div>
  );
}