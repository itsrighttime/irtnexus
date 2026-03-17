import { getErrorIcon, getErrorTitle } from "./error";
import styles from "./ErrorPage.module.css";
import type { MouseEventHandler } from "react";

interface ErrorPageProps {
  statusCode?: string | number;
  ErrorMsg?: string;
  statusDetail?: string | null;
  responseCode?: string | number | null;
  handleNavigate: MouseEventHandler<HTMLButtonElement>;
  navigateTo?: string;
}

export const ErrorPage = ({
  statusCode = "404",
  ErrorMsg = "not found",
  statusDetail = null,
  responseCode = null,
  handleNavigate,
  navigateTo = "Home Page",
}: ErrorPageProps) => {
  // Convert statusCode to number for getErrorIcon and getErrorTitle
  const numericStatusCode =
    typeof statusCode === "string" ? parseInt(statusCode, 10) : statusCode;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.message}>
          <h1 id="pageTitle" className={styles.title}>
            {getErrorIcon(numericStatusCode)}
          </h1>
          <p className={styles.errorCode}>{statusCode}</p>

          {responseCode !== null && (
            <p className={styles.description}>
              <span className="boldL2"></span> {responseCode}
            </p>
          )}

          <span className={styles.titleText}>
            {getErrorTitle(numericStatusCode)}
          </span>

          <p className={styles.description}>
            The page you are looking for was {ErrorMsg}.
          </p>

          {statusDetail && (
            <p className={styles.description}>
              <span className="boldL2">Detail:</span> {statusDetail}
            </p>
          )}

          <p className={styles.instruction}>
            You may return to{" "}
            <button
              className={styles.link}
              style={{ border: "none", background: "none", cursor: "pointer" }}
              onClick={handleNavigate}
            >
              {navigateTo}
            </button>{" "}
            or try using the correct URL.
          </p>
        </div>
      </div>
    </div>
  );
};
