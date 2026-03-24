export type AlertType = "success" | "error" | "info" | "warning";

export interface AlertItem {
  id: string;
  message: string;
  type: AlertType;
}

export interface AlertContainerProps {
  /** Array of alert objects to display */
  alertContainer: AlertItem[];
  /** Callback function invoked with the alert's `id` when it is dismissed */
  removeAlert: (id: string) => void;
}
