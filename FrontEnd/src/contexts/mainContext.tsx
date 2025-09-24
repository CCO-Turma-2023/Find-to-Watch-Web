import { useState, type ReactNode } from "react";
import { MainContext } from "./contexts";

export interface MainContextType {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  menu: number;
  setMenu: (value: number) => void;
  isVisibleEyeBrows: boolean;
  setIsVisibleEyebrows: (value: boolean) => void;
}

export function MainProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const [menu, setMenu] = useState<number>(1);
  const [isVisibleEyeBrows, setIsVisibleEyebrows] = useState(false);

  return (
    <MainContext.Provider
      value={{
        isVisible,
        setIsVisible,
        menu,
        setMenu,
        isVisibleEyeBrows,
        setIsVisibleEyebrows,
      }}
    >
      {children}
    </MainContext.Provider>
  );
}
