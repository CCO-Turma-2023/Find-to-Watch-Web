const imageBaseUrl = "https://image.tmdb.org/t/p/original";

class Media {
  constructor({ id, backdrop_path, title, overview, type,}) {
    this.id = id;
    this.backdrop_path = backdrop_path ? `${imageBaseUrl}${backdrop_path}` : null
    this.title = title;
    this.overview = overview;
    this.type = type; 
  }
}

module.exports = Media;