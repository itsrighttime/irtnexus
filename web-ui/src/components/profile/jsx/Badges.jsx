import { IconButton } from "#components/common/jsx/Icon";
import styles from "../css/Badges.module.css";
import { profileHelpers } from "core-ui";
import { Icons } from "core-ui";

const { validateBadges, getMetaForBadge } = profileHelpers;

export function Badges({ badges = [] }) {
  // Validation (only in development)
  if (process.env.NODE_ENV === "development") {
    const errors = validateBadges(badges);
    if (errors.length) {
      console.warn("[Badge Validation Errors]", errors);
    }
  }

  const badgeCount = badges.length;

  return (
    <div
      className={`${styles.right} ${
        styles[`badges-${Math.min(badgeCount, 3)}`]
      }`}
    >
      {badges.map((badge) => {
        const meta = getMetaForBadge(badge.id);
        const icon = Icons[meta.name];
        const color = meta.color;

        return (
          <div key={badge.id} className={styles.badge}>
            <IconButton svg={icon} color={color} title={badge.tooltip} />
          </div>
        );
      })}
    </div>
  );
}
