"use client";

import type { JSX } from "react";
import styles from "./MarkdownTable.module.css";
import type { Node } from "unist";

interface ElementNode extends Node {
  type: "element";
  tagName: string;
  children?: TableChildNode[]; // include text nodes too
  value?: string;
  properties?: Record<string, any>;
}

interface MarkdownTableProps {
  node: ElementNode;
}

interface TextNode extends Node {
  type: "text";
  value: string;
}

type TableChildNode = ElementNode | TextNode;

export function MarkdownTable({
  node,
}: MarkdownTableProps): JSX.Element | null {
  if (!node?.children || node.children.length === 0) {
    return null;
  }

  const elementChildren = node.children.filter(
    (child): child is ElementNode => child.type === "element",
  );

  const head = elementChildren.find((child) => child.tagName === "thead");
  const body = elementChildren.find((child) => child.tagName === "tbody");

  const headerRow = head?.children?.find(
    (child): child is ElementNode =>
      child.type === "element" && child.tagName === "tr",
  );

  const headerCells =
    headerRow?.children?.filter(
      (child): child is ElementNode => child.type === "element",
    ) || [];

  const bodyRows =
    body?.children?.filter(
      (child): child is ElementNode =>
        child.type === "element" && child.tagName === "tr",
    ) || [];

  const getCellContent = (cell: ElementNode): string => {
    if (!cell?.children) return "";

    if (cell.children.length === 1 && cell.children[0].type === "text") {
      return cell.children[0].value;
    }

    return cell.children
      .map((child) => {
        if (child.type === "text") {
          return child.value;
        }
        if (child.type === "element") {
          return getCellContent(child);
        }
        return "";
      })
      .join("");
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        {headerCells.length > 0 && (
          <thead>
            <tr>
              {headerCells.map((cell, idx) => (
                <th key={idx}>{getCellContent(cell)}</th>
              ))}
            </tr>
          </thead>
        )}
        {bodyRows.length > 0 && (
          <tbody>
            {bodyRows.map((row, i) => {
              const cells =
                row.children?.filter(
                  (child): child is ElementNode => child.type === "element",
                ) || [];
              return (
                <tr key={i}>
                  {cells.map((cell, j) => (
                    <td key={j}>{getCellContent(cell)}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
    </div>
  );
}
