"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthData } = useAuth();

  // Локальний стан, щоб логіка виконувалась лише 1 раз
  const [processed, setProcessed] = useState(false);

  // Отримаємо параметри поза useEffect
  const token = searchParams?.get('token') || null;
  const userParam = searchParams?.get('user') || null;
  const error = searchParams?.get('error') || null;

  useEffect(() => {
    if (processed) return; // Якщо вже обробили, не запускаємо знову

    if (!searchParams) {
      router.push('/login?error=' + encodeURIComponent('No search parameters found'));
      setProcessed(true);
      return;
    }

    if (error) {
      console.error('Auth error:', error);
      router.push('/login?error=' + encodeURIComponent(error));
      setProcessed(true);
      return;
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        setAuthData(user, token);
        router.push('/');
      } catch (e) {
        console.error('Failed to parse user data:', e);
        router.push('/login?error=' + encodeURIComponent('Invalid authentication response'));
      }
      setProcessed(true);
    } else {
      router.push('/login?error=' + encodeURIComponent('Missing authentication data'));
      setProcessed(true);
    }
  }, [token, userParam, error, processed, router, searchParams, setAuthData]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-white">Authenticating...</div>
    </div>
  );
}
