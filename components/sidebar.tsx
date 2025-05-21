/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { FiPlus, FiLoader } from "react-icons/fi";
import { toast } from "sonner";

interface Chat {
  id: string;
  title: string;
  createdAt: string;
}

interface SidebarProps {
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  currentChatId: string | null;
  toggleSidebar: () => void;
}

export const Sidebar = ({ onSelectChat, onNewChat, currentChatId, toggleSidebar }: SidebarProps) => {
  const { data: session, status } = useSession();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.id) {
      fetchChats();
    }

    const interval = setInterval(() => {
      if (session?.user?.id) {
        fetchChats(true);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [session]);

  const fetchChats = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/chats");
      if (res.ok) {
        const data = await res.json();
        setChats(data);
      } else {
        toast.error("Failed to load chats", {
          style: { background: "#1E40AF", color: "#F3F4F6" },
        });
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("Failed to load chats", {
        style: { background: "#1E40AF", color: "#F3F4F6" },
      });
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleNewChat = async () => {
    if (!session?.user?.id) {
      toast.error("Please sign in to create a new chat", {
        style: { background: "#1E40AF", color: "#F3F4F6" },
      });
      return;
    }

    setLoading(true);
    try {
      const initialMessages = [{ role: "system", content: "New chat started" }];
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: initialMessages }),
      });

      if (res.ok) {
        const chat = await res.json();
        await fetchChats();
        onNewChat();
        onSelectChat(chat.id);
        toast.success("New chat created!", {
          style: { background: "#1E40AF", color: "#F3F4F6" },
        });
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to create new chat", {
          style: { background: "#1E40AF", color: "#F3F4F6" },
        });
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to create new chat", {
        style: { background: "#1E40AF", color: "#F3F4F6" },
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="w-full sm:w-64 bg-white dark:bg-gray-800 p-4 flex justify-center items-center h-full">
        <FiLoader className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="w-full sm:w-64 bg-white dark:bg-gray-800 p-4 flex flex-col items-center justify-center h-full">
        <p className="text-blue-900 dark:text-blue-100 mb-4 text-center text-sm sm:text-base">
          Sign in to save and view your chat history.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full sm:w-64 bg-white dark:bg-gray-800 p-4 h-full overflow-y-auto relative shadow-md"
    >


      <div className="flex flex-col gap-4 mb-4 mt-4">

        <Button
          onClick={handleNewChat}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base flex items-center gap-2"
          disabled={loading}
          aria-label="Create new chat"
        >
          <FiPlus className="h-4 w-4" />
          New Chat
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center">
          <FiLoader className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" />
        </div>
      ) : chats.length === 0 ? (
        <p className="text-blue-700 dark:text-blue-300 text-sm">
          No chats yet. Start a new one!
        </p>
      ) : (
        <ul className="space-y-2">
          {chats.map((chat) => (
            <li key={chat.id}>
              <button
                onClick={() => onSelectChat(chat.id)}
                className={`w-full text-left p-2 rounded-lg text-blue-900 dark:text-blue-100 text-sm sm:text-base truncate ${
                  chat.id === currentChatId
                    ? "bg-blue-200 dark:bg-blue-600 font-semibold"
                    : "hover:bg-blue-100 dark:hover:bg-blue-700"
                }`}
              >
                {chat.title || "Untitled Chat"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};