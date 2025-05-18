/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from "next/link";
import React, { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Partial<Components> = {
  pre: ({ children }) => <pre className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">{children}</pre>,
  ol: ({ node, children, ...props }) => (
    <ol className="list-decimal list-outside ml-6 text-blue-900 dark:text-blue-100" {...props}>
      {children}
    </ol>
  ),
  li: ({ node, children, ...props }) => (
    <li className="py-1" {...props}>
      {children}
    </li>
  ),
  ul: ({ node, children, ...props }) => (
    <ul className="list-disc list-outside ml-6 text-blue-900 dark:text-blue-100" {...props}>
      {children}
    </ul>
  ),
  strong: ({ node, children, ...props }) => (
    <span className="font-semibold text-blue-900 dark:text-blue-100" {...props}>
      {children}
    </span>
  ),
  a: ({ node, children, href, ...props }) => {
    const isExternal = href && /^https?:\/\//.test(href);
    if (isExternal) {
      return (
        <a
          className="text-blue-600 dark:text-blue-400 hover:underline"
          target="_blank"
          rel="noreferrer"
          href={href}
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        className="text-blue-600 dark:text-blue-400 hover:underline"
        href={href ?? "#"}
        {...props}
      >
        {children}
      </Link>
    );
  },
  h1: ({ node, children, ...props }) => (
    <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-6 mb-2" {...props}>
      {children}
    </h1>
  ),
  h2: ({ node, children, ...props }) => (
    <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-6 mb-2" {...props}>
      {children}
    </h2>
  ),
  h3: ({ node, children, ...props }) => (
    <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mt-6 mb-2" {...props}>
      {children}
    </h3>
  ),
  h4: ({ node, children, ...props }) => (
    <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100 mt-6 mb-2" {...props}>
      {children}
    </h4>
  ),
  h5: ({ node, children, ...props }) => (
    <h5 className="text-base font-bold text-blue-900 dark:text-blue-100 mt-6 mb-2" {...props}>
      {children}
    </h5>
  ),
  h6: ({ node, children, ...props }) => (
    <h6 className="text-sm font-bold text-blue-900 dark:text-blue-100 mt-6 mb-2" {...props}>
      {children}
    </h6>
  ),
};

const remarkPlugins = [remarkGfm];

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);