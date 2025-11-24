class TmdbServices {
  constructor(tmdbRequests) {
    this.tmdbRequests = tmdbRequests;
  }

  async fetchCategory({ mediaType, genreId, page }) {
    const content = await this.tmdbRequests.fetchCategory(
      mediaType,
      genreId,
      page
    );
    return content;
  }

  async searchMedia(query) {
    const content = await this.tmdbRequests.searchMedia(query);
    return content;
  }

  async getMediaDetails(id, mediaType) {
    const content = await this.tmdbRequests.getMediaDetails(id, mediaType);
    return content;
  }
}

module.exports = TmdbServices;
