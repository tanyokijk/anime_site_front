"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthInput } from "@/components/auth/auth-input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { forgotPassword, loading, error, clearError } = useAuth();

  const isEmailValid = email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const emailError = touched && !isEmailValid ? "Введіть дійсний e-mail" : "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();
    setTouched(true);

    if (!isEmailValid) return;

    const success = await forgotPassword(email);
    if (success) {
      setSuccessMessage("Інструкції з відновлення паролю надіслані на e-mail.");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6 w-full md:max-w-lg items-center", className)} {...props}>
      <Card className="bg-transparent border-none w-full pt-0">
        <AuthHeader title="Забули пароль?" subtitle="Введіть свою e-mail адресу і ми надішлемо вам посилання для відновлення паролю." />
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
                    setSuccessMessage("");
                    clearError();
                  }}
                  onBlur={() => setTouched(true)}
                  required
                  aria-invalid={touched && !isEmailValid}
                />
                {emailError && <span className="text-red-500 text-xs pl-2">{emailError}</span>}
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
                    !isEmailValid ? "opacity-60 pointer-events-none" : ""
                  )}
                  disabled={loading || !isEmailValid}
                >
                  {loading ? "Відправка..." : "Надіслати посилання"}
                </Button>
              </div>

              {error && <span className="text-red-500 text-xs text-center">{error}</span>}
              {successMessage && <span className="text-green-600 text-sm text-center">{successMessage}</span>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
