"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { LwaziIcon } from "./icons";
import { Button } from "./ui/button";
import { RiMenu2Line } from "react-icons/ri";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header = ({ toggleSidebar, isSidebarOpen }: HeaderProps) => {
  const { data: session, status } = useSession();

  return (
    <header className="fixed z-50 top-0 left-0 right-0 bg-white dark:bg-blue-950 shadow-sm ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Menu Icon for Mobile */}
          <Button
            variant="ghost"
            className="sm:hidden text-blue-600 dark:text-blue-400 p-2"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <RiMenu2Line size={32} />
          </Button>
          <Link href="/" className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <LwaziIcon size={32} />
            <span className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-100">
              Lwazi
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {status === "loading" ? (
            <span className="text-blue-700 dark:text-blue-300 text-sm sm:text-base">
              Loading...
            </span>
          ) : session?.user ? (
            <>
              <span className="text-blue-900 dark:text-blue-100 text-sm sm:text-base truncate max-w-[120px] sm:max-w-[200px]">
              </span>
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