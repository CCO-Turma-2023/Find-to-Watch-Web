import type { ToastMessage } from "primereact/toast";
import { useContext } from "react";
import { createContext } from "react";

interface ToastContextType {
  showToast: (message: ToastMessage) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
