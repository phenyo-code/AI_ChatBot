/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sun, Moon, Trash2, Edit2, User, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/header";

interface Chat {
  id: string;
  title: string;
  preview?: string;
  createdAt: string;
  lastAccessed?: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recentChats, setRecentChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [renameInputs, setRenameInputs] = useState<{ [key: string]: string }>({});
  const [editingChatId, setEditingChatId] = useState<string | null>(null);

  // Theme handling
  useEffect(() => {
    // Load theme from local storage
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // Load recent chats
  useEffect(() => {
    if (session?.user?.id) {
      fetchRecentChats();
    }
  }, [session]);

  const fetchRecentChats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chats");
      if (res.ok) {
        const data = await res.json();
        setRecentChats(data.slice(0, 5)); // Show up to 5 recent chats
        // Load rename inputs from local storage
        const savedInputs = localStorage.getItem("renameInputs");
        if (savedInputs) {
          setRenameInputs(JSON.parse(savedInputs));
        }
      } else {
        toast.error("Failed to load recent chats", {
          style: { background: "#1E40AF", color: "#F3F4F6" },
        });
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("Failed to load recent chats", {
        style: { background: "#1E40AF", color: "#F3F4F6" },
      });
    } finally {
      setLoading(false);
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
        toast.success("New chat created!", {
          style: { background: "#1E40AF", color: "#F3F4F6" },
        });
        router.push(`/chat?chatId=${chat.id}`);
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

  const handleDeleteChat = async (chatId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRecentChats(recentChats.filter((chat) => chat.id !== chatId));
        toast.success("Chat deleted!", {
          style: { background: "#1E40AF", color: "#F3F4F6" },
        });
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to delete chat", {
          style: { background: "#1E40AF", color: "#F3F4F6" },
        });
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat", {
        style: { background: "#1E40AF", color: "#F3F4F6" },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRenameChat = async (chatId: string) => {
    const newTitle = renameInputs[chatId]?.trim();
    if (!newTitle) {
      toast.error("Please enter a valid title", {
        style: { background: "#1E40AF", color: "#F3F4F6" },
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      if (res.ok) {
        setRecentChats(
          recentChats.map((chat) =>
            chat.id === chatId ? { ...chat, title: newTitle } : chat
          )
        );
        setEditingChatId(null);
        toast.success("Chat renamed!", {
          style: { background: "#1E40AF", color: "#F3F4F6" },
        });
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to rename chat", {
          style: { background: "#1E40AF", color: "#F3F4F6" },
        });
      }
    } catch (error) {
      console.error("Error renaming chat:", error);
      toast.error("Failed to rename chat", {
        style: { background: "#1E40AF", color: "#F3F4F6" },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRenameInputChange = (chatId: string, value: string) => {
    const newInputs = { ...renameInputs, [chatId]: value };
    setRenameInputs(newInputs);
    localStorage.setItem("renameInputs", JSON.stringify(newInputs));
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return null; // Handled by middleware or layout
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Header /> {/* No toggleSidebar/isSidebarOpen props */}
      <div className="flex-1 flex flex-col items-center pt-16 sm:pt-0 px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl w-full"
        >
          {/* Theme Toggle */}
          <div className="flex justify-end mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              className="border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-800/30"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>

          {/* User Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 flex flex-col sm:flex-row items-center gap-4"
          >
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {session.user.name || "User"}
              </h2>
              <p className="text-blue-600 dark:text-blue-400">{session.user.email}</p>
              <p className="text-sm text-blue-500 dark:text-blue-300">
                Joined {new Date().toLocaleDateString()}
              </p>
            </div>
            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
              variant="outline"
              className="w-full sm:w-auto text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-800/30"
            >
              Sign Out
            </Button>
          </motion.div>

          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 dark:text-blue-100 mb-4">
              Welcome Back!
            </h1>
            <p className="text-lg text-blue-600 dark:text-blue-400">
              Start a new conversation or dive into your recent chats.
            </p>
            <Button
              onClick={handleNewChat}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg"
              disabled={loading}
              aria-label="Create a new chat"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Start New Chat"
              )}
            </Button>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
              <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                {recentChats.length}
              </p>
              <p className="text-blue-600 dark:text-blue-400">Total Chats</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
              <User className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">1</p>
              <p className="text-blue-600 dark:text-blue-400">Active Session</p>
            </div>
          </motion.div>

          {/* Recent Chats */}
          {recentChats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="w-full"
            >
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
                Recent Chats
              </h2>
              <ul className="space-y-4 max-w-md mx-auto">
                {recentChats.map((chat) => (
                  <motion.li
                    key={chat.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
                  >
                    {editingChatId === chat.id ? (
                      <div className="flex items-center gap-2 mb-2">
                        <Input
                          value={renameInputs[chat.id] || chat.title || ""}
                          onChange={(e) => handleRenameInputChange(chat.id, e.target.value)}
                          placeholder="Enter new title"
                          className="flex-1 text-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-700"
                          aria-label="Rename chat"
                        />
                        <Button
                          onClick={() => handleRenameChat(chat.id)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={loading}
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingChatId(null)}
                          size="sm"
                          variant="outline"
                          className="text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => router.push(`/chat?chatId=${chat.id}`)}
                        >
                          <p className="text-blue-900 dark:text-blue-100 font-semibold truncate">
                            {chat.title || "Untitled Chat"}
                          </p>
                          <p className="text-sm text-blue-600 dark:text-blue-400 truncate">
                            {chat.preview || "No preview available"}
                          </p>
                          <p className="text-xs text-blue-500 dark:text-blue-300">
                            Last accessed:{" "}
                            {chat.lastAccessed
                              ? new Date(chat.lastAccessed).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingChatId(chat.id)}
                            aria-label="Rename chat"
                            className="text-blue-600 dark:text-blue-400"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteChat(chat.id)}
                            aria-label="Delete chat"
                            className="text-red-600 dark:text-red-400"
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}