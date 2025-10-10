import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { SnackbarItem, SnackbarType } from "../../types/snackbar";

interface SnackbarState {
  queue: SnackbarItem[];
  showSnackbar: (message: string, type?: SnackbarType, duration?: number) => void;
  removeSnackbar: (id: string) => void;
}

export const useSnackbar = create<SnackbarState>((set) => ({
  queue: [],

  showSnackbar: (message, type = "info", duration = 3000) => {
    const id = uuidv4();
    set((state) => ({
      queue: [...state.queue, { id, message, type, duration }],
    }));
  },

  removeSnackbar: (id) => {
    set((state) => ({
      queue: state.queue.filter((snackbar) => snackbar.id !== id),
    }));
  },
}));
