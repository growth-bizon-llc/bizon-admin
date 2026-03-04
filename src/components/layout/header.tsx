"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { useAuthStore } from "@/lib/stores/auth-store";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        aria-label="Open menu"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>
      <div className="flex-1" />
      {user && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">{user.email}</span>
          <span className="ml-2 text-xs text-gray-400 capitalize">({user.role})</span>
        </div>
      )}
    </header>
  );
}
