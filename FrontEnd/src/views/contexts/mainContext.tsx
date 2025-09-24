import { useState, type ReactNode } from "react";
import { MainContext } from "./contexts";

export interface MainContextType {
  juliana: string;
  setJuliana: (value: string) => void;
}

export function MainProvider({ children }: { children: ReactNode }) {
  const [juliana, setJuliana] = useState("sla man");

  return (
    <MainContext.Provider
      value={{
        juliana,
        setJuliana,
      }}
    >
      {children}
    </MainContext.Provider>
  );
}
