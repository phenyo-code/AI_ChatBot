// app/page.tsx
import { Suspense } from "react";
import Chat from "@/components/chat";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <Chat />
    </Suspense>
  );
}