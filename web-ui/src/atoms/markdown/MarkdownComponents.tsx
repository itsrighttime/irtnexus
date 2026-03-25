"use client";

import { lazy, type ReactNode } from "react";
import styles from "./Markdown.module.css";
import { MarkdownTable } from "./MarkdownTable.jsx";

const SyntaxHighlighter = lazy(() =>
  import("react-syntax-highlighter").then(
    (mod) => ({ default: mod.Prism as React.ComponentType<any> }), // <- type override
  ),
);

// Import styles
import { materialLight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface HeadingProps {
  children: ReactNode;
}

interface ParagraphProps {
  node: Node & { children: any[] };
  children: ReactNode;
}

interface AnchorProps {
  href?: string;
  children: ReactNode;
}

interface ListProps {
  children: ReactNode;
}

interface ListItemProps {
  children: ReactNode;
}

interface BlockquoteProps {
  children: ReactNode;
}

interface CodeProps {
  node: Node & { properties?: Record<string, any> };
  className?: string;
  children: ReactNode;
}

interface TableProps {
  node: any;
}

export const markdownComponents = {
  h1: ({ children }: HeadingProps) => <h1 className={styles.h1}>{children}</h1>,
  h2: ({ children }: HeadingProps) => <h2 className={styles.h2}>{children}</h2>,
  h3: ({ children }: HeadingProps) => <h3 className={styles.h3}>{children}</h3>,

  p: ({ node, children }: ParagraphProps) => {
    const hasCodeBlock = node.children.some(
      (child) =>
        child.type === "code" ||
        (child.tagName === "code" && !child.properties?.inline),
    );

    return hasCodeBlock ? (
      <>{children}</>
    ) : (
      <p className={styles.p}>{children}</p>
    );
  },

  a: ({ href, children }: AnchorProps) => (
    <a
      href={href}
      className={styles.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),

  ul: ({ children }: ListProps) => <ul className={styles.ul}>{children}</ul>,
  ol: ({ children }: ListProps) => <ol className={styles.ol}>{children}</ol>,
  li: ({ children }: ListItemProps) => (
    <li className={styles.li}>{children}</li>
  ),

  blockquote: ({ children }: BlockquoteProps) => (
    <blockquote className={styles.blockquote}>{children}</blockquote>
  ),

  code: ({ node, className, children }: CodeProps) => {
    const match = /language-(\w+)/.exec(className || "");

    if (match) {
      return (
        <SyntaxHighlighter language={match[1]} style={materialLight}>
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      );
    }

    const hasNewlines = String(children).includes("\n");

    if (hasNewlines) {
      return (
        <pre className={styles.codeBlock}>
          <code className={className}>{children}</code>
        </pre>
      );
    }

    return <code className={styles.inlineCode}>{children}</code>;
  },

  table: ({ node }: TableProps) => <MarkdownTable node={node} />,
};
