import { Badges } from "./Badges";
import styles from "../css/Field.module.css";
import { Icons } from "core-ui";

export function Field({ leftIcon, title, value, badges = [] }) {
  return (
    <div className={styles.field}>
      {leftIcon && (
        <div className={styles.left}>
          <div className={styles.leftIcon}>{Icons[leftIcon]}</div>
        </div>
      )}

      <div className={styles.middle}>
        <div className={styles.title}>{title}</div>
        <div className={styles.value}>{value}</div>
      </div>

      {badges.length > 0 && <Badges badges={badges} />}
    </div>
  );
}
