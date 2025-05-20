// app/api/chats/[chatId]/route.ts (PUT and GET)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  req: Request,
  context: { params: Promise<{ chatId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { chatId } = await context.params;

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

  try {
    const existingChat = await prisma.chat.findUnique({
      where: { id: chatId, userId: session.user.id },
    });
    if (!existingChat) {
      return NextResponse.json({ error: "Chat not found or unauthorized" }, { status: 404 });
    }

    await prisma.message.deleteMany({ where: { chatId } });

    const chat = await prisma.chat.update({
      where: { id: chatId },
      data: {
        title: messages[0].content.substring(0, 50) || "Untitled Chat",
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

    console.log("Chat updated:", chat.id);
    return NextResponse.json(chat);
  } catch (error) {
    console.error("Error updating chat:", error);
    return NextResponse.json({ error: "Failed to update chat" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ chatId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { chatId } = await context.params;
  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId, userId: session.user.id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            role: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Error fetching chat:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}