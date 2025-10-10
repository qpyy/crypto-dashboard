export type SnackbarType = "success" | "error" | "info";

export interface SnackbarItem {
  id: string;
  message: string;
  type: SnackbarType;
  duration?: number;
}
