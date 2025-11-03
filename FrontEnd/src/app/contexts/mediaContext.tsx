import { useState, type ReactNode } from "react";
import { MediaContext } from "./contexts";
import type { genreData } from "../interfaces/media";

export interface MediaContextType {
  genres: genreData[];
  setGenres: (genres: genreData[]) => void;
}

export const MediaProvider = ({ children }: { children: ReactNode }) => {
  const [genres, setGenres] = useState<genreData[]>([]);

  return (
    <MediaContext.Provider value={{ genres, setGenres }}>
      {children}
    </MediaContext.Provider>
  );
};
