// lib/useToken.ts
import { useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

export const useToken = (): {
  token: string | null;
  isLoading: boolean;
  error: Error | null;
} => {
  const { getToken, isSignedIn } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      if (!isSignedIn) {
        setToken(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const tokenValue = await getToken();
        setToken(tokenValue);
      } catch (err) {
        console.error("Error fetching Clerk token:", err);
        setError(err as Error);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, [getToken, isSignedIn]);

  return { token, isLoading, error };
};
