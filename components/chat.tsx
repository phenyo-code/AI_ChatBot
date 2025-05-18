"use client";

import { defaultModel, modelID } from "@/ai/providers";
import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Textarea } from "./textarea";
import { ProjectOverview } from "./project-overview";
import { Messages } from "./messages";
import { Header } from "./header";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export interface InputProps {
  selectedModel: modelID;
  setSelectedModel: React.Dispatch<React.SetStateAction<modelID>>;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  input: string;
  isLoading: boolean;
  status: string;
  stop: () => void;
  "aria-label": string;
  className?: string;
}

export default function Chat() {
  const [selectedModel, setSelectedModel] = useState<modelID>(defaultModel);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, status, stop } =
    useChat({
      maxSteps: 5,
      body: {
        selectedModel,
      },
      onError: (error) => {
        toast.error(
          error.message.length > 0
            ? error.message
            : "An error occurred, please try again later.",
          {
            position: "top-center",
            style: {
              background: "#1E40AF",
              color: "#F3F4F6",
              borderRadius: "8px",
              padding: "12px",
            },
          },
        );
      },
    });

  const isLoading = status === "streaming" || status === "submitted";

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm"
      >
        <Header />
      </motion.div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start py-8 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-4xl"
          ref={chatContainerRef}
        >
          {messages.length === 0 ? (
            <div className="w-full">
              <ProjectOverview />
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <Messages messages={messages} isLoading={isLoading} status={status} />
              {isLoading && (
                <div className="flex justify-center mt-4">
                  <Loader2 className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" aria-label="Loading" />
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>

      {/* Sticky Input Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky bottom-0 bg-white dark:bg-gray-900 py-6 px-4 shadow-t-sm"
      >
        <div className="w-full max-w-4xl mx-auto">
          <Textarea
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            handleInputChange={handleInputChange}
            input={input}
            isLoading={isLoading}
            status={status}
            stop={stop}
            aria-label="Chat input"
          />
        </div>
      </motion.form>
    </div>
  );
}