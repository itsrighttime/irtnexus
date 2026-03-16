import { Outlet } from "react-router-dom";

import styles from "./Layout.module.css";
import { Sidebar } from "../sidebar/jsx/Sidebar";
import { Header } from "../header/Header";

export const Layout = () => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainWrapper}>
        <Header />
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
