/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { Suspense } from "react";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const urlError = searchParams.get("error");
  const verified = searchParams.get("verified");
  const message = searchParams.get("message");

  useEffect(() => {
    if (verified === "true") {
      setSuccess("Email verified successfully! Please sign in.");
    }
    if (message) {
      setSuccess(decodeURIComponent(message));
    }
  }, [verified, message]);

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        if (result.error === "Please verify your email before signing in") {
          setError(
            `Please verify your email before signing in. ` +
              `<a href="/auth/resend-verification?email=${encodeURIComponent(
                email
              )}" class="text-blue-600 hover:underline">Resend verification email</a>`
          );
        } else {
          setError(result.error);
        }
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccess(null);
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch (err) {
      setError("Failed to sign in with Google");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-semibold text-blue-900 dark:text-blue-100 mb-6 tracking-tight text-center">
          Sign In to Lwazi
        </h2>

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-200 rounded-lg">
            {success}
          </div>
        )}
        {(error || urlError) && (
          <div
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg"
            dangerouslySetInnerHTML={{ __html: error || decodeURIComponent(urlError || "") }}
          />
        )}

        {/* Google Sign-In Button */}
        <Button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed mb-6"
          disabled={loading || googleLoading}
        >
          <FcGoogle className="mr-2" size={20} />
          {googleLoading ? "Signing In with Google..." : "Sign In with Google"}
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <form onSubmit={handleCredentialsSignIn} className="space-y-6">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              required
              disabled={loading || googleLoading}
            />
          </div>
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              required
              disabled={loading || googleLoading}
            />
          </div>
          <div className="text-center">
            <Link href="/auth/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Forgot Password?
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed"
            disabled={loading || googleLoading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}