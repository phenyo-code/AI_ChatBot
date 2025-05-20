"use client";

import { Button } from "@/components/ui/button";
import { LwaziIcon } from "@/components/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-blue-900 dark:to-gray-900">
      <div className="text-center">
        <LwaziIcon size={64} className="mx-auto mb-4 text-blue-900 dark:text-blue-100" />
        <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-100 mb-4">Authentication Error</h1>
        <p className="text-lg text-blue-600 dark:text-blue-400 mb-8">
          {error === "Callback"
            ? "There was an issue with the OAuth callback. Please check your Google OAuth configuration."
            : error || "An unknown error occurred during authentication."}
        </p>
        <Button
          onClick={() => router.push("/auth/signin")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}