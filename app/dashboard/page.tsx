// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Chat {
  id: string;
  title: string;
  createdAt: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recentChats, setRecentChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl w-full text-center"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 dark:text-blue-100 mb-4">
          Welcome, {session.user.name || "User"}!
        </h1>
        <p className="text-lg text-blue-600 dark:text-blue-400 mb-8">
          Start a new conversation or explore your recent chats below.
        </p>

        <Button
          onClick={handleNewChat}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg mb-12"
          disabled={loading}
          aria-label="Create a new chat"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Start New Chat"
          )}
        </Button>

        {recentChats.length > 0 && (
          <div className="w-full">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Recent Chats
            </h2>
            <ul className="space-y-2 max-w-md mx-auto">
              {recentChats.map((chat) => (
                <li key={chat.id}>
                  <Button
                    variant="outline"
                    className="w-full text-left p-3 rounded-lg border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100 hover:bg-blue-50 dark:hover:bg-blue-800/30"
                    onClick={() => router.push(`/chat?chatId=${chat.id}`)}
                    aria-label={`Open chat: ${chat.title}`}
                  >
                    {chat.title || "Untitled Chat"}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </div>
  );
}