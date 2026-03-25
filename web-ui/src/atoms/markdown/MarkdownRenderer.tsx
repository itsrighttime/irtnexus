"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./Markdown.module.css";
import { markdownComponents } from "./MarkdownComponents";
import type { JSX } from "react";

// Props interface
interface MarkdownRendererProps {
  content: string;
}

/**
 * MarkdownRenderer
 *
 * Renders a Markdown string as styled HTML using `react-markdown`
 * with GitHub Flavored Markdown (GFM) support and custom renderers.
 *
 * @param {MarkdownRendererProps} props - Component props
 * @returns {JSX.Element} Rendered Markdown
 */
export function MarkdownRenderer({
  content,
}: MarkdownRendererProps): JSX.Element {
  return (
    <article className={styles.markdown}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents as any}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
