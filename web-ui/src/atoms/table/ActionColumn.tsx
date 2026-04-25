import type { TableAction } from "./table.type";
import styles from "./Table.module.css";
import { Button } from "../button/Button";

interface Props<T> {
  row: T;
  actions?: TableAction<T>[];
}

export function ActionColumn<T>({ row, actions = [] }: Props<T>) {
  return (
    <td className={styles.actionButton}>
      {actions.map((action, i) => (
        <Button
          key={i}
          onClick={() => action.onClick(row)}
          variant="secondary"
          size="small"
          type="button"
        >
          {action.label}
        </Button>
      ))}
    </td>
  );
}
