export interface Media {
  id: number;
  backdrop_path: string;
  title: string;
  overview: string;
  type: string;
  duration?: string;
  genres?: string[];
  year?: string;
}

export interface fetchMediaProps {
  page: number;
  genreId: number;
  mediaType: string;
}
