import styles from "../css/IconRender.module.css";

export const IconRender = ({ icon }) => {
  return <span className={styles.icon}>{icon}</span>;
};
