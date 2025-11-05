export interface castProp {
  name: string;
  profile_path: string;
}

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
  poster_path: string;
  providers?: string[];
  cast: castProp[];
}

export interface fetchMediaProps {
  page: number;
  genreId: number;
  mediaType: string;
}

export interface genreData {
  titulo: string;
  index: number;
  content: Media[];
  page: number;
  genreId: number;
  mediaType: string;
}
