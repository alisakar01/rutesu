import { trpc } from "@/providers/trpc";
import { useCallback, useMemo } from "react";

export function useAuth() {
  const utils = trpc.useUtils();

  const {
    data: user,
    isLoading,
    error,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !!localStorage.getItem("token"),
  });

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    utils.invalidate();
    window.location.reload();
  }, [utils]);

  return useMemo(
    () => ({
      user: user ?? null,
      isAuthenticated: !!user,
      isLoading,
      error,
      logout,
    }),
    [user, isLoading, error, logout],
  );
}
