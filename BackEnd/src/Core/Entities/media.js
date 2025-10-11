const imageBaseUrl = "https://image.tmdb.org/t/p/original";

class Media {
  constructor({ id, backdrop_path, genres, title, overview, type, runtime, year, cast}) {
    this.id = id;
    this.backdrop_path = backdrop_path ? `${imageBaseUrl}${backdrop_path}` : null;
    this.title = title;
    this.overview = overview;
    this.type = type; 
    this.genres = genres;
    this.runtime = runtime ? `${Math.floor(runtime / 60)}h ${runtime % 60}m` : 'N/A';
    this.year = year;
    this.cast = cast;
  }
}

module.exports = Media;