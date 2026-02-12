import React from 'react';
import clsx from 'clsx';
import styles from './Table.module.css';

export const Table = ({ children, className }) => (
  <div className={clsx(styles.tableContainer, className)}>
    <table className={styles.table}>{children}</table>
  </div>
);

export const TableHeader = ({ children }) => (
  <thead className={styles.thead}>{children}</thead>
);

export const TableBody = ({ children }) => (
  <tbody className={styles.tbody}>{children}</tbody>
);

export const TableRow = ({ children }) => (
  <tr className={styles.tr}>{children}</tr>
);

export const TableHead = ({ children, className }) => (
  <th className={clsx(styles.th, className)}>{children}</th>
);

export const TableCell = ({ children, className }) => (
  <td className={clsx(styles.td, className)}>{children}</td>
);
