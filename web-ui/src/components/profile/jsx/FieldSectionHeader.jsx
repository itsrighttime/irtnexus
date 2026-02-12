import styles from "../css/FieldSectionHeader.module.css";
import { IconButton } from "#components/common/jsx/Icon";
import { Icons } from "core-ui";
import { MyEssentials } from "#widgets";

const { Tooltip } = MyEssentials;

export function FieldSectionHeader({ header }) {
  const { title, buttons = [] } = header || {};

  const onClick = (btnId) => {
    console.log(`Button clicked: ${btnId}`);
    // You can add more logic here based on the button ID
  };

  /**
   * Button Registry
   * You can add more buttons here later
   */
  const BUTTONS = {
    refresh: {
      id: "refresh",
      label: "Refresh",
      icon: Icons.RefreshIcon,
      color: "#17a2b8",
    },
    public: {
      id: "public",
      label: "Public",
      icon: Icons.GlobeIcon,
      color: "#28a745",
    },
    edit: {
      id: "edit",
      label: "Edit",
      icon: Icons.EditIcon,
      color: "#0f2854",
    },
    delete: {
      id: "delete",
      label: "Delete",
      icon: Icons.DeleteIcon,
      color: "#ff5969",
    },
  };

  return (
    <div className={styles.header}>
      <div className={styles.left}>{title}</div>

      <div className={styles.right}>
        {buttons.map((btnId) => {
          const btn = BUTTONS[btnId];
          if (!btn) return null;

          return (
            <IconButton
              key={btn.id}
              svg={btn.icon}
              size={20}
              color={btn.color}
              title={btn.label}
              onClick={() => onClick(btn.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
