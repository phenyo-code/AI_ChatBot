"use client";

import { motion } from "framer-motion";
import NextLink from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";

export default function About() {
  // Animation variants for staggered section entrances
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.2, ease: "easeOut" },
    }),
  };

  return (
    <div className="min-h-screen flex flex-col mt-6 bg-white dark:bg-gray-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-10 bg-white dark:bg-gray-900"
      >
        <Header toggleSidebar={() => {}} isSidebarOpen={false} />
      </motion.div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col mt-4 items-center justify-center py-12 px-4">
        <div className="w-full max-w-4xl">
          {/* Hero Section */}
          <motion.section
            custom={0}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-900 dark:text-blue-100 mb-4">
              About Lwazi
            </h1>
            <p className="text-base sm:text-lg text-blue-600 dark:text-blue-400 max-w-md mx-auto">
              Your intelligent companion for curiosity, creativity, and discovery, powered by Groq.
            </p>
          </motion.section>

          {/* Mission Section */}
          <motion.section
            custom={1}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Our Mission
            </h2>
            <p className="text-base sm:text-lg text-blue-600 dark:text-blue-400 max-w-2xl mx-auto">
              Lwazi is designed to empower users to explore the world through intelligent conversations. Whether you’re seeking answers, brainstorming ideas, or diving into complex topics, Lwazi provides a seamless and intuitive experience to spark inspiration and learning.
            </p>
          </motion.section>

          {/* Features Section */}
          <motion.section
            custom={2}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-blue-900 dark:text-blue-100 mb-6">
              Why Lwazi?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Intelligent Responses",
                  description:
                    "Leverage Groq’s cutting-edge AI to get accurate, context-aware answers tailored to your questions.",
                },
                {
                  title: "Versatile Conversations",
                  description:
                    "From coding tips to creative ideas, Lwazi adapts to your needs, making every interaction meaningful.",
                },
                {
                  title: "User-Friendly Design",
                  description:
                    "Enjoy a clean, intuitive interface that makes chatting with AI effortless and enjoyable.",
                },
                {
                  title: "Always Evolving",
                  description:
                    "Lwazi continuously improves with new features and models to keep your experience fresh.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -3 }}
                  className="p-6 bg-white dark:bg-gray-800 rounded-lg  border border-blue-200 dark:border-blue-700"
                >
                  <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-base text-blue-600 dark:text-blue-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Powered by Groq Section */}
          <motion.section
            custom={3}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="mb-16 text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Powered by Groq
            </h2>
            <p className="text-base sm:text-lg text-blue-600 dark:text-blue-400 max-w-2xl mx-auto mb-6">
              Lwazi is built on Groq’s advanced AI technology, delivering fast, reliable, and insightful responses. Learn more about the innovation behind Lwazi at{" "}
              <NextLink
                target="_blank"
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                href="https://groq.com/"
                aria-label="Visit Groq website"
              >
                groq.com
              </NextLink>.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg"
                aria-label="Visit Groq website"
              >
                <NextLink target="_blank" href="https://groq.com/">
                  Explore Groq
                </NextLink>
              </Button>
            </motion.div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            custom={4}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Ready to Start?
            </h2>
            <p className="text-base sm:text-lg text-blue-600 dark:text-blue-400 max-w-md mx-auto mb-6">
              Jump into a conversation with Lwazi and discover the possibilities.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg"
                aria-label="Start chatting with Lwazi"
              >
                <NextLink href="/">Start Chatting</NextLink>
              </Button>
            </motion.div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}