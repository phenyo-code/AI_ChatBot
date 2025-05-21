
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { LwaziIcon } from "./icons";
import { Button } from "./ui/button";
import { RiMenu2Line } from "react-icons/ri";
import { Sun, Moon } from "lucide-react";

interface HeaderProps {
  toggleSidebar?: () => void; // Optional for dashboard
  isSidebarOpen?: boolean; // Optional for dashboard
}

export const Header = ({ toggleSidebar, isSidebarOpen }: HeaderProps) => {
  const { data: session, status } = useSession();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load theme from local storage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  // Toggle theme and update local storage
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Menu Icon for Mobile (only if toggleSidebar is provided) */}
          {toggleSidebar && (
            <Button
              variant="ghost"
              className="sm:hidden text-blue-600 dark:text-blue-400 p-2"
              onClick={toggleSidebar}
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <RiMenu2Line size={24} />
            </Button>
          )}
          <Link href="/" className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <LwaziIcon size={32} />
            <span className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-100">
              Lwazi
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggle Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-800/30"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          {status === "loading" ? (
            <span className="text-blue-700 dark:text-blue-300 text-sm sm:text-base">
              Loading...
            </span>
          ) : session?.user ? (
            <>
              <Button
                onClick={() => signOut({ callbackUrl: "/" })}
                variant="outline"
                className="text-blue-600 dark:text-blue-300 border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-800/20 text-sm sm:text-base"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              onClick={() => signIn()}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
