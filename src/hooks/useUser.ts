import { useState, useEffect } from 'react';
import { User, UserApiResponse } from '@/types/user';

export const useUser = (userId: string, token?: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const url =
        userId === 'me'
          ? 'http://127.0.0.1:8000/api/v1/profile'
          : `http://127.0.0.1:8000/api/v1/users/${userId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UserApiResponse = await response.json();
      setUser(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId, token]);

  const refetch = () => {
    if (userId) {
      fetchUser();
    }
  };

  return { user, isLoading, error, refetch };
};
