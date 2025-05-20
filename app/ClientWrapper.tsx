"use client";

import { SessionProvider } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function HomeLoading() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-blue-900">
      <div className="text-blue-600 dark:text-blue-400">Loading...</div>
    </div>
  );
}

function OfflineNotification() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-red-500 text-white text-center py-3 z-50 shadow-md">
      <span className="font-medium">You are offline.</span> Some features may be unavailable.
    </div>
  );
}

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const { scrollYProgress } = useScroll();

  // Animate background color on scroll (client-only)
  const backgroundColor = useTransform(scrollYProgress, [0, 1], ["#ffffff", "#f5f5f5"]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.6]);
  const headerScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.97]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Server-side rendering: static styles
  if (!isClient) {
    return (
      <SessionProvider>
        <Suspense fallback={<HomeLoading />}>
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              right: "0",
              bottom: "0",
              zIndex: -1,
              backgroundColor: "#ffffff",
            }}
          />
          <main>{children}</main>
        </Suspense>
      </SessionProvider>
    );
  }

  // Client-side rendering: animated styles
  return (
    <SessionProvider>
      <Suspense fallback={<HomeLoading />}>
        <motion.div
          style={{
            backgroundColor,
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            zIndex: -1,
            transition: "background-color 0.3s ease",
          }}
        />
        <OfflineNotification />
        <motion.div
          style={{
            opacity: headerOpacity,
            scale: headerScale,
          }}
        />
        <main>{children}</main>
      </Suspense>
    </SessionProvider>
  );
}