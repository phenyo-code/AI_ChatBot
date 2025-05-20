/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { defaultModel, modelID } from "@/ai/providers";
import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Textarea } from "./textarea";
import { ProjectOverview } from "./project-overview";
import { Messages } from "./messages";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { toast } from "sonner";
import { SpinnerIcon } from "./icons"; // Replace FiLoader

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
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { messages, input, handleInputChange, handleSubmit, status, stop, setMessages } =
    useChat({
      maxSteps: 5,
      body: { selectedModel },
      onResponse: () => {
        if (session?.user?.id && messages.length > 0) {
          saveChat();
        }
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
          }
        );
      },
    });

  const isLoading = status === "streaming" || status === "submitted";

  // Load chat from query parameter
  useEffect(() => {
    const chatId = searchParams.get("chatId");
    if (chatId && chatId !== currentChatId) {
      loadChat(chatId);
    }
  }, [searchParams, currentChatId]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Polling to refresh chat data every 10 seconds
  useEffect(() => {
    if (currentChatId && session?.user?.id) {
      const interval = setInterval(() => {
        loadChat(currentChatId, true);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [currentChatId, session]);

  // Close sidebar when selecting a chat or tapping chat content on mobile
  const handleSelectChat = (chatId: string) => {
    loadChat(chatId);
    setIsSidebarOpen(false);
  };

  const handleChatTap = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  // Save or update chat to MongoDB
  const saveChat = async () => {
    if (!session?.user?.id) return;

    try {
      const method = currentChatId ? "PUT" : "POST";
      const url = currentChatId ? `/api/chats/${currentChatId}` : "/api/chats";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      if (response.ok) {
        const chat = await response.json();
        if (!currentChatId) {
          setCurrentChatId(chat.id);
        }
        toast.success(currentChatId ? "Chat updated!" : "Chat saved!", {
          style: { background: "#1E40AF", color: "#F3F4F6" },
        });
        router.refresh();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to save chat", {
          style: { background: "#1E40AF", color: "#F3F4F6" },
        });
      }
    } catch (error) {
      console.error("Error saving chat:", error);
      toast.error("Failed to save chat", {
        style: { background: "#1E40AF", color: "#F3F4F6" },
      });
    }
  };

  // Load a specific chat
  const loadChat = async (chatId: string, silent = false) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`);
      if (response.ok) {
        const chat = await response.json();
        setMessages(
          chat.messages.map((msg: { id: string; role: string; content: string }) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
          }))
        );
        setCurrentChatId(chatId);
        if (!silent) {
          toast.success("Chat loaded!", {
            style: { background: "#1E40AF", color: "#F3F4F6" },
          });
        }
      } else {
        if (!silent) {
          toast.error("Failed to load chat", {
            style: { background: "#1E40AF", color: "#F3F4F6" },
          });
        }
      }
    } catch (error) {
      console.error("Error loading chat:", error);
      if (!silent) {
        toast.error("Failed to load chat", {
          style: { background: "#1E40AF", color: "#F3F4F6" },
          });
        }
      }
    };

  // Start a new chat
  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setIsSidebarOpen(false);
    router.refresh();
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 ">
      <div className="relative flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed top-16 sm:top-0 inset-x-0 sm:inset-x-auto z-40 w-64 sm:static sm:w-64 sm:block ${
            isSidebarOpen ? "block" : "hidden"
          } h-[calc(100vh-4rem)] sm:h-full`} // Adjust height for mobile
        >
          <Sidebar
            onSelectChat={handleSelectChat}
            onNewChat={startNewChat}
            currentChatId={currentChatId}
            toggleSidebar={toggleSidebar}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="sticky top-0 z-50 bg-white dark:bg-gray-900" // Higher z-index
          >
            <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          </motion.div>

          {/* Main Content */}
          <main
            className="flex-1 flex flex-col items-center justify-start py-6 px-4 sm:px-6"
            onClick={handleChatTap}
          >
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
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6">
                  <Messages messages={messages} isLoading={isLoading} status={status} />
                  {isLoading && (
                    <div className="flex justify-center mt-4">
                      <SpinnerIcon
                        size={24}
                        className="text-blue-600 dark:text-blue-400 animate-spin"
                        aria-label="Loading"
                      />
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
            className="sticky bottom-0 bg-white dark:bg-gray-900 py-4 px-4 sm:px-6"
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
      </div>
    </div>
  );
}