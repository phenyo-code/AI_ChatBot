"use client";

import NextLink from "next/link";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

export const ProjectOverview = () => {
  const suggestedPrompts = [
    { text: "Ask about AI advancements", action: "What are the latest advancements in AI?" },
    { text: "Explore coding tips", action: "Give me some tips for writing clean code." },
    { text: "Get creative ideas", action: "Suggest some creative project ideas." },
    { text: "Learn about science", action: "Explain a fascinating scientific concept." },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center text-center px-4 py-16 min-h-[70vh] bg-white dark:bg-gray-900">
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl w-full"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-900 dark:text-blue-100 mb-3">
          Welcome to Convo
        </h1>
        <h2 className="text-lg sm:text-xl font-medium text-blue-700 dark:text-blue-300 mb-4 max-w-lg mx-auto">
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
        <p className="text-base sm:text-lg text-blue-600 dark:text-blue-400 max-w-md mx-auto mb-8">
          Convo is your intelligent companion for exploring ideas, solving problems, and sparking creativity. Ask anything, anytime.
        </p>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg"
              aria-label="Start chatting with Convo"
            >
              <NextLink href="/chat">Start Chatting</NextLink>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              asChild
              variant="outline"
              className="border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800/20 font-semibold py-3 px-8 rounded-lg text-lg"
              aria-label="Learn more about Convo"
            >
              <NextLink href="/about">Learn More</NextLink>
            </Button>
          </motion.div>
        </div>

        {/* Suggested Prompts */}
        <div className="max-w-3xl w-full">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
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
                  className="w-full h-auto py-4 px-4 text-left rounded-lg border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 text-blue-900 dark:text-blue-100 hover:bg-blue-50 dark:hover:bg-blue-800/30"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("sendMessage", { detail: prompt.action }));
                  }}
                  aria-label={`Try prompt: ${prompt.text}`}
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