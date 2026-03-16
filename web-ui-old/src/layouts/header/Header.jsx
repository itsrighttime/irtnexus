import { Icons, useMockData } from "core-ui";
import styles from "./Header.module.css";

const { Search, Bell, Sun, Moon } = Icons;

export const Header = () => {
  const { user, activeTenant, notifications, theme, toggleTheme } =
    useMockData();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className={styles.header}>
      <div className={styles.searchContainer}>
        {/* <Search size={18} className={styles.searchIcon} /> */}
        {Search}
        <input
          type="text"
          placeholder="Search resources, users, policies..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.actions}>
        <button
          className={styles.iconBtn}
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          {theme === "dark" ? Sun : Moon}
        </button>

        <div className={styles.tenantBadge}>
          <span className={styles.tenantLabel}>Tenant:</span>
          <span className={styles.tenantName}>{activeTenant?.name}</span>
        </div>

        <button className={styles.iconBtn}>
          {Bell}
          {unreadCount > 0 && (
            <span className={styles.badge}>{unreadCount}</span>
          )}
        </button>

        <div className={styles.profile}>
          <img src={user.avatar} alt="User" className={styles.avatar} />
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user.name}</span>
            <span className={styles.userRole}>{user.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
