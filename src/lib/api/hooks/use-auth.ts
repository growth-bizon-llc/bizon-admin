"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useRouter } from "next/navigation";

export function useLogin() {
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: () => {
      router.push("/dashboard");
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async () => {
      logout();
    },
    onSuccess: () => {
      window.location.href = "/login";
    },
  });
}
