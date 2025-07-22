"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Mail } from "lucide-react";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthInput } from "@/components/auth/auth-input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? ""; // беремо токен з URL

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState("");

  // Беремо resetPassword, loading, error і clearError з useAuth
  const { resetPassword, loading, error: authError, clearError } = useAuth();

  const isEmailValid =
    email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;

  const emailError =
    touched.email && !isEmailValid ? "Введіть дійсний e-mail" : "";
  const passwordError =
    touched.password && !isPasswordValid
      ? "Пароль повинен містити щонайменше 6 символів"
      : "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Вмикаємо відображення помилок
    setTouched({ email: true, password: true });
    setLocalError("");
    setSuccess("");
    clearError(); // очищаємо помилки в контексті

    if (!isEmailValid || !isPasswordValid) return;

    try {
      await resetPassword(email, password, token);
      setSuccess("Пароль успішно змінено! Тепер ви можете увійти.");
    } catch (err: any) {
      setLocalError(err.message || "Сталася помилка");
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-6 w-full md:max-w-lg items-center",
        className
      )}
      {...props}
    >
      <Card className="bg-transparent border-none w-full pt-0">
        <AuthHeader title="Встановити новий пароль" />
        <CardContent className="p-3">
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <AuthInput
                  icon={Mail}
                  id="email"
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setLocalError("");
                    setSuccess("");
                    clearError();
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  required
                  aria-invalid={touched.email && !isEmailValid}
                />
                {emailError && (
                  <span className="text-red-500 text-xs pl-2">{emailError}</span>
                )}
              </div>

              <div className="grid gap-3">
                <AuthInput
                  icon={Lock}
                  id="password"
                  type="password"
                  placeholder="Новий пароль"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLocalError("");
                    setSuccess("");
                    clearError();
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  required
                  aria-invalid={touched.password && !isPasswordValid}
                />
                {passwordError && (
                  <span className="text-red-500 text-xs pl-2">{passwordError}</span>
                )}
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  size="sm"
                  className={cn(
                    "text-white hover:text-dark-white bg-blue hover:bg-dark-blue cursor-pointer font-semibold text-lg font-sans",
                    "rounded-[3.25rem]",
                    "px-0 py-0",
                    "w-[12rem] md:w-[12rem] h-[3.75rem]",
                    (!isEmailValid || !isPasswordValid) && "opacity-60 pointer-events-none"
                  )}
                  disabled={loading}
                >
                  {loading ? "Збереження..." : "Скинути пароль"}
                </Button>
              </div>

              {(localError || authError) && (
                <span className="text-red-500 text-sm text-center">
                  {localError || authError}
                </span>
              )}
              {success && (
                <span className="text-green-600 text-sm text-center">{success}</span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
