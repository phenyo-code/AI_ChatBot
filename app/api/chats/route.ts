import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error("Invalid JSON:", error);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { messages }: { messages: { id?: string; role: string; content: string }[] } = body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    console.error("Invalid messages:", messages);
    return NextResponse.json({ error: "Messages must be a non-empty array" }, { status: 400 });
  }

  const invalidMessage = messages.find(
    (msg) => !msg.role || typeof msg.role !== "string" || typeof msg.content !== "string"
  );
  if (invalidMessage) {
    console.error("Invalid message format:", invalidMessage);
    return NextResponse.json({ error: "Each message must have a valid role and content" }, { status: 400 });
  }

  try {
    const firstMessageContent = messages[0].content.trim();
    const title = firstMessageContent.substring(0, 50) || "Untitled Chat";
    const preview = firstMessageContent.substring(0, 50) || "";
    const now = new Date();

    console.log("Creating chat for user:", session.user.id, "title:", title, "preview:", preview);
    const chat = await prisma.chat.create({
      data: {
        userId: session.user.id,
        title,
        preview,
        lastAccessed: now,
        messages: {
          create: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        },
      },
      select: {
        id: true,
        title: true,
        preview: true,
        lastAccessed: true,
        createdAt: true,
        messages: {
          select: {
            id: true,
            role: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });

    console.log("Chat created:", chat.id);
    return NextResponse.json(
      {
        ...chat,
        lastAccessed: chat.lastAccessed?.toISOString(),
        createdAt: chat.createdAt.toISOString(),
        messages: chat.messages.map((msg) => ({
          ...msg,
          createdAt: msg.createdAt.toISOString(),
        })),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json({ error: "Failed to create chat" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const chats = await prisma.chat.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        title: true,
        preview: true,
        lastAccessed: true,
        createdAt: true,
      },
      orderBy: { lastAccessed: "desc" },
    });

    console.log("Chats fetched for user:", session.user.id, "count:", chats.length);
    return NextResponse.json(
      chats.map((chat) => ({
        ...chat,
        lastAccessed: chat.lastAccessed?.toISOString() || null,
        createdAt: chat.createdAt.toISOString(),
      }))
    );
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}