import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  interface User {
    id: string;
    role: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile: async (profile) => {
        let userRole = "user";
        if (profile?.email === "your-admin-email@example.com") {
          userRole = "admin";
        }

        // Check if user exists by email
        let user = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (!user) {
          // Create new user
          user = await prisma.user.create({
            data: {
              name: profile.name,
              email: profile.email,
              password: null, // No password for Google users
              role: userRole,
              emailVerified: true, // Match working project
            },
          });
        } else if (user.role !== userRole) {
          // Update role if needed
          await prisma.user.update({
            where: { email: profile.email },
            data: { role: userRole },
          });
          user.role = userRole;
        }

        // Upsert GoogleUser
        await prisma.googleUser.upsert({
          where: { googleId: profile.sub },
          update: {
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            userId: user.id,
          },
          create: {
            googleId: profile.sub,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            userId: user.id,
          },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: profile.picture,
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.trim().toLowerCase() },
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        // Optional: Check email verification
        if (!user.emailVerified) {
          throw new Error("Please verify your email before signing in");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.image = token.image as string | undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};