/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import bcrypt from "bcryptjs";

type SignUpProps = {
  searchParams: Promise<{ error?: string }>;
};

const SignUp = async ({ searchParams }: SignUpProps) => {
  const prisma = new PrismaClient();
  const { error } = await searchParams; // Await the searchParams Promise

  async function handleSignUp(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        redirect(`/auth/signup?error=${encodeURIComponent("Email already in use")}`);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: "user",
          emailVerified: false, // Align with schema
        },
      });

      redirect("/auth/signin?message=Account created! Please sign in.");
    } catch (error: any) {
      console.error("Error creating user:", error);
      let errorMessage = "Failed to create account";
      if (error.code === "P2002") {
        errorMessage = "Email already in use";
      } else if (error.message.includes("database")) {
        errorMessage = "Database connection error";
      }
      redirect(`/auth/signup?error=${encodeURIComponent(errorMessage)}`);
    } finally {
      await prisma.$disconnect();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-6 text-center">
          Sign Up for Lwazi
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
            {decodeURIComponent(error)}
          </div>
        )}

        <form action={handleSignUp} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-blue-900 dark:text-blue-100">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              className="border-blue-200 dark:border-blue-700 bg-white dark:bg-blue-800 text-blue-900 dark:text-blue-100"
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-blue-900 dark:text-blue-100">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              className="border-blue-200 dark:border-blue-700 bg-white dark:bg-blue-800 text-blue-900 dark:text-blue-100"
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-blue-900 dark:text-blue-100">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              className="border-blue-200 dark:border-blue-700 bg-white dark:bg-blue-800 text-blue-900 dark:text-blue-100"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Sign Up
          </Button>
        </form>

        <p className="mt-4 text-center text-blue-700 dark:text-blue-300">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-blue-600 dark:text-blue-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;