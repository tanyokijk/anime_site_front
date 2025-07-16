"use client";

import { useAuth } from "@/contexts/auth-context";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AuthInput } from "@/components/auth/auth-input";
import { Mail, Lock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type AuthMode = "login" | "register";

interface AuthFormProps {
  mode?: AuthMode;
}

export function AuthForm({ mode = "login" }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ 
    email: false, 
    password: false 
  });
  const { login, register, loading, error } = useAuth();
  const router = useRouter();

  const isEmailValid = email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= (mode === "register" ? 6 : 1);
  
  const emailError = touched.email && !isEmailValid ? "Введіть дійсний e-mail" : "";
  const passwordError = touched.password && !isPasswordValid 
    ? mode === "register" 
      ? "Пароль має бути не менше 6 символів" 
      : "Введіть пароль" 
    : "";

  useEffect(() => {
    if (error && (email || password)) {
      // Clear error when user starts typing (if your auth context supports it)
    }
  }, [email, password, error]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    
    if (isEmailValid && isPasswordValid) {
      let success = false;
      if (mode === "login") {
        success = await login(email, password);
      } else {
        // Для реєстрації передаємо email як ім'я (або пустий рядок, якщо потрібно)
        success = await register(email, email, password);
      }
      
      if (success) {
        router.push("/");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-6">
        <div className="grid gap-3">
          <AuthInput
            icon={Mail}
            id="email"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            required
            aria-invalid={touched.email && !isEmailValid}
            disabled={loading}
          />
          {emailError && (
            <span className="pl-2 text-xs text-red-500">{emailError}</span>
          )}
        </div>
        
        <div className="grid gap-3">
          <AuthInput
            icon={Lock}
            id="password"
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            required
            aria-invalid={touched.password && !isPasswordValid}
            disabled={loading}
          />
          {passwordError && (
            <span className="pl-2 text-xs text-red-500">{passwordError}</span>
          )}
          
          {mode === "login" && (
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <Checkbox
                  className="data-[state=checked]:bg-blue border-blue h-5 w-5"
                  id="rememberUser"
                  disabled={loading}
                />
                <Label className="font-sans text-sm font-light text-white">
                  Запам'ятати мене
                </Label>
              </div>
              <a
                href="/reset"
                className="ml-auto inline-block bg-transparent font-sans text-sm font-light text-white underline-offset-4 hover:underline"
              >
                Забули пароль?
              </a>
            </div>
          )}
          
          {mode === "register" && (
            <p className="text-xs text-gray-400">
              Пароль має бути не менше 6 символів
            </p>
          )}
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <span className="text-sm text-red-600">{error}</span>
          </div>
        )}
        
        <div className="flex justify-center">
          <Button
            type="submit"
            size="sm"
            className={cn(
              "hover:text-dark-white bg-blue hover:bg-dark-blue cursor-pointer font-sans text-lg font-semibold text-white",
              "rounded-[3.25rem]",
              "px-0 py-0",
              "h-[3.75rem] w-[7.5rem] md:w-[8.5rem]",
              (!isEmailValid || !isPasswordValid || loading)
                ? "pointer-events-none opacity-60"
                : "",
            )}
            disabled={loading || !isEmailValid || !isPasswordValid}
          >
            {loading 
              ? mode === "login" 
                ? "Вхід..." 
                : "Реєстрація..." 
              : mode === "login" 
                ? "Далі" 
                : "Далі"}
          </Button>
        </div>
      </div>
    </form>
  );
}