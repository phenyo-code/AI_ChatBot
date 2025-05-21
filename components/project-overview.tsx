
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useSession, signIn } from "next-auth/react";
import NextLink from "next/link";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

export const ProjectOverview = () => {
  const { data: session, status } = useSession();

  const suggestedPrompts = [
    { text: "Explore coding tips", action: "Give me some tips for writing clean code." },
    { text: "Learn about science", action: "Explain a fascinating scientific concept." },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center text-center px-4 py-8 sm:py-16 min-h-[70vh] bg-white dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-3xl"
      >
        {session?.user ? (
          <>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-900 dark:text-blue-100 mb-3">
              Hi, {session.user.name || session.user.email || "User"}!
            </h1>
            <h2 className="text-base sm:text-lg md:text-xl font-medium text-blue-700 dark:text-blue-300 mb-4 max-w-lg mx-auto">
              Welcome back to Lwazi.
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-blue-600 dark:text-blue-400 max-w-md mx-auto mb-6 sm:mb-8">
              Ready to continue exploring ideas, solving problems, or sparking creativity? Jump into your dashboard or try a new prompt.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-900 dark:text-blue-100 mb-3">
              Hi, I'm Lwazi
            </h1>
            <h2 className="text-base sm:text-lg md:text-xl font-medium text-blue-700 dark:text-blue-300 mb-4 max-w-lg mx-auto">
              Powered by{" "}
              <NextLink
                target="_blank"
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                href="https://groq.com/"
                aria-label="Visit Groq website"
              >
                Groq
              </NextLink>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-blue-600 dark:text-blue-400 max-w-md mx-auto mb-6 sm:mb-8">
              Your intelligent companion for exploring ideas, solving problems, and sparking creativity. Sign in to get started.
            </p>
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10 sm:mb-12">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            {status === "loading" ? (
              <Button
                disabled
                className="bg-blue-600 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-lg text-sm sm:text-lg opacity-50"
                aria-label="Loading"
              >
                Loading...
              </Button>
            ) : session?.user ? (
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-lg text-sm sm:text-lg"
                aria-label="Go to your dashboard"
              >
                <NextLink href="/dashboard">Go to Dashboard</NextLink>
              </Button>
            ) : (
              <Button
                onClick={() => signIn()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-lg text-sm sm:text-lg"
                aria-label="Sign in to start chatting"
              >
                Sign In
              </Button>
            )}
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              asChild
              variant="outline"
              className="border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800/20 font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-lg text-sm sm:text-lg"
              aria-label="Learn more about Lwazi"
            >
              <NextLink href="/about">Learn More</NextLink>
            </Button>
          </motion.div>
        </div>

        <div className="w-full">
          <h3 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
            Try These Prompts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestedPrompts.map((prompt, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -3 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-auto py-3 sm:py-4 px-4 text-left rounded-lg border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 text-blue-900 dark:text-blue-100 hover:bg-blue-50 dark:hover:bg-blue-800/30 text-sm sm:text-base"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("sendMessage", { detail: prompt.action }));
                  }}
                  aria-label={`Try prompt: ${prompt.text}`}
                  disabled={!session?.user}
                >
                  <span className="font-medium">{prompt.text}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
