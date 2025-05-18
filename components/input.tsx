import { ArrowUp } from "lucide-react";
import { Input as ShadcnInput } from "./ui/input";

interface InputProps {
  input: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  status: string;
  stop: () => void;
}

export const Input = ({
  input,
  handleInputChange,
  isLoading,
  status,
  stop,
}: InputProps) => {
  return (
    <div className="relative w-full">
      <ShadcnInput
        className="w-full rounded-lg border border-blue-200 dark:border-blue-700 bg-white dark:bg-blue-800 py-3 px-4 text-blue-900 dark:text-blue-100 placeholder-blue-400 dark:placeholder-blue-300 focus:ring-2 focus:ring-blue-500"
        value={input}
        autoFocus
        placeholder="Type your message..."
        onChange={handleInputChange}
      />
      {status === "streaming" || status === "submitted" ? (
        <button
          type="button"
          onClick={stop}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <div className="animate-spin h-4 w-4">
            <svg className="h-4 w-4 text-white" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </button>
      ) : (
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowUp className="h-4 w-4 text-white" />
        </button>
      )}
    </div>
  );
};