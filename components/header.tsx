import Link from "next/link";
import { ConvoIcon } from "./icons"; // Replace with your icon component

export const Header = () => {
  return (
    <header className="fixed z-50 top-0 left-0 right-0 bg-white dark:bg-blue-950 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <ConvoIcon size={32} />
            <span className="text-xl font-bold text-blue-900 dark:text-blue-100">Convo</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="https://groq.com"
            target="_blank"
            className="text-blue-600 dark:text-blue-300 hover:underline text-sm"
          >
            Powered by Groq
          </Link>
        </div>
      </div>
    </header>
  );
};