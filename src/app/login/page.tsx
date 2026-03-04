"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { loginSchema, type LoginFormData } from "@/lib/validations/login-schema";
import { useLogin } from "@/lib/api/hooks/use-auth";
import { useAuthStore } from "@/lib/stores/auth-store";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, loadFromStorage } = useAuthStore();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onError: (error: unknown) => {
        const message =
          (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
          "Invalid credentials";
        toast.error(message);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Bizon Admin</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="admin@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Button type="submit" className="w-full" loading={loginMutation.isPending}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
