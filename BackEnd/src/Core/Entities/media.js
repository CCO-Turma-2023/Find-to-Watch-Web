const imageBaseUrl = "https://image.tmdb.org/t/p/original";

class Media {
  constructor({
    id,
    backdrop_path,
    poster_path,
    genres,
    title,
    trailer,
    overview,
    type,
    runtime,
    year,
    cast,
    providers,
  }) {
    this.id = id;
    this.backdrop_path = backdrop_path
      ? `${imageBaseUrl}${backdrop_path}`
      : null;

    this.poster_path = poster_path ? `${imageBaseUrl}${poster_path}` : null;

    this.title = title;
    this.overview = overview;
    this.type = type;
    this.genres = genres;
    this.providers = providers;
    this.trailer = trailer;
    this.runtime = runtime
      ? `${Math.floor(runtime / 60)}h ${runtime % 60}m`
      : "N/A";
    this.year = year;
    this.cast = cast;
  }
}

module.exports = Media;
