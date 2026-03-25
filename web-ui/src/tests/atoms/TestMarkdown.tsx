"use client";

import { MarkdownRenderer } from "@/atoms";
import React, { type JSX } from "react";

const sampleMarkdown = `
# Heading 1
## Heading 2
### Heading 3

This is a [link](https://example.com) to test.

- Unordered list item 1
- Unordered list item 2

1. Ordered list item 1
2. Ordered list item 2

> This is a blockquote.

\`\`\`ts
// TypeScript code block
function greet(name: string) {
  console.log("Hello, " + name);
}
greet("World");
\`\`\`

Inline code: \`const x = 5;\`

| Name  | Age | City      |
|-------|-----|-----------|
| Alice | 25  | New York  |
| Bob   | 30  | San Francisco |
`;

export function TestMarkdown(): JSX.Element {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1>Markdown Renderer Test</h1>
      <MarkdownRenderer content={sampleMarkdown} />
    </div>
  );
}
