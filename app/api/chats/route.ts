// app/api/chats/route.ts (POST and GET)
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
    (msg) => !msg.role || !msg.content || typeof msg.role !== "string" || typeof msg.content !== "string"
  );
  if (invalidMessage) {
    console.error("Invalid message format:", invalidMessage);
    return NextResponse.json({ error: "Each message must have a valid role and content" }, { status: 400 });
  }

  try {
    const title = messages[0].content.substring(0, 50) || "Untitled Chat";
    console.log("Saving chat for user:", session.user.id, "with title:", title);
    const chat = await prisma.chat.create({
      data: {
        userId: session.user.id,
        title,
        messages: {
          create: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        },
      },
      include: {
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

    console.log("Chat saved:", chat.id);
    return NextResponse.json(chat, { status: 201 });
  } catch (error) {
    console.error("Error saving chat:", error);
    return NextResponse.json({ error: "Failed to save chat" }, { status: 500 });
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
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    console.log("Chats fetched for user:", session.user.id, "count:", chats.length);
    return NextResponse.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}