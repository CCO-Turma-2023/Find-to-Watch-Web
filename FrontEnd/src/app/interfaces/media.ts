export interface Media {
  id: number;
  backdrop_path: string;
  title: string;
  overview: string;
  type: string;
  runtime: string;
  genres: string[];
  year: string;
  trailer: string;
}

export interface fetchMediaProps {
  page: number;
  genreId: number;
  mediaType: string;
}
