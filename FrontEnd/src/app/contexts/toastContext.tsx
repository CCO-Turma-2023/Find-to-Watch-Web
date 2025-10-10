import { useRef, type  ReactNode } from 'react';
import { Toast } from 'primereact/toast';
import type { ToastMessage } from 'primereact/toast';
import { ToastContext } from './contexts';

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const toastRef = useRef<Toast>(null);

  const showToast = (message: ToastMessage) => {
    toastRef.current?.show(message);
  };

  const value = { showToast };

  return (
    <ToastContext.Provider value={value}>
      <Toast ref={toastRef} position="bottom-right" />
      {children}
    </ToastContext.Provider>
  );
};

