const { api, options, omdb } = require("./api");
const Media = require("../../../Core/Entities/media");

class TmdbRequests {
  async fetchCategory(mediaType, genreId, page) {
    const isMovie = mediaType === "movie";

    const flexibleGenres = [99, 27, 10402, 10764, 10762, 16];
    const isFlexibleGenre = flexibleGenres.includes(parseInt(genreId));

    const minVotes = isFlexibleGenre ? 50 : 500;
    const minRating = isFlexibleGenre ? 6.0 : 7.0;
    const dateField = isMovie
      ? "primary_release_date.gte"
      : "first_air_date.gte";
    const dateCut = isFlexibleGenre ? "1990-01-01" : "2005-01-01";

    let url = "";

    const base =
      `3/discover/${mediaType}?include_adult=false&include_null_first_air_dates=false&language=pt-BR&page=${page}` +
      `&sort_by=vote_count.desc&vote_count.gte=${minVotes}&vote_average.gte=${minRating}&${dateField}=${dateCut}&watch_region=BR&include_image_language=pt,null`;

    if (genreId != 0) {
      if (parseInt(genreId) === 16) {
        url = `${base}&with_genres=16&without_keywords=210024`;
      } else if (parseInt(genreId) === 17) {
        url = `${base}&with_genres=16&with_original_language=ja`;
      } else {
        url = `${base}&with_genres=${genreId}&without_genres=16`;
      }
    } else {
      url = `3/trending/${mediaType}/day?language=pt-BR&region=BR&page=${page}`;
    }

    const res = await api.get(url, options);

    const filteredResults = res.data.results.filter(
      (item) => item.overview?.trim() !== "" && item.backdrop_path
    );

    const promises = filteredResults.map(async (item) => {
      const detailsPromise = this.RequestMediabyId(item.id, mediaType);
      const providersPromise = this.RequestProviders(item.id, mediaType);

      const [data, providers] = await Promise.all([
        detailsPromise,
        providersPromise,
      ]);

      item.type = mediaType;
      if (!isMovie) {
        item.title = item.name;
      }

      item.genres = data.genres.map((genre) => genre.name);
      item.runtime = isMovie ? data.runtime : data.episode_run_time?.[0] || 0;
      item.year = (isMovie ? data.release_date : data.first_air_date)?.split(
        "-"
      )[0];
      item.cast = data.cast;
      item.providers = providers;

      return item;
    });

    const detailedItems = await Promise.all(promises);
    const mediaInstances = detailedItems.map((item) => new Media(item));
    return mediaInstances;
  }

  async RequestMediabyId(id, mediaType) {
    const isMovie = mediaType === "movie";

    const endpoint = isMovie ? `3/movie/${id}` : `3/tv/${id}`;

    const res = await api.get(`${endpoint}?language=pt-BR&region=BR`, options);

    const castEndpoint = isMovie
      ? `3/movie/${id}/credits`
      : `3/tv/${id}/credits`;
    const creditsRes = await api.get(castEndpoint, options);
    const cast = creditsRes.data.cast;

    let ratings = [];
    let imdb_id = res.data.imdb_id;

    if (!isMovie && !imdb_id) {
      const externalIdsRes = await api.get(`3/tv/${id}/external_ids`, options);
      imdb_id = externalIdsRes.data.imdb_id;
    }

    /*if (imdb_id) {
            try {
                const omdbResponse = await omdb.get('', {
                    params: { i: imdb_id },
                });
                ratings = omdbResponse.data.Ratings || [];
            } catch (error) {
                console.error(`Falha ao buscar dados do OMDb para imdb_id: ${imdb_id}`, error);
            }
        }*/

    res.data.cast = cast;
    res.data.ratings = ratings;
    return res.data;
  }

  async RequestProviders(id, mediaType) {
    const supportedProvidersMap = new Map([
      [8, { id: 8, name: "Netflix" }],
      [119, { id: 119, name: "Amazon Prime Video" }],
      [10, { id: 119, name: "Amazon Prime Video" }],
      [337, { id: 337, name: "Disney Plus" }],
      [384, { id: 384, name: "Max" }],
      [1899, { id: 384, name: "Max" }],
      [350, { id: 350, name: "Apple TV Plus" }],
      [2, { id: 350, name: "Apple TV Plus" }],
      [531, { id: 531, name: "Paramount Plus" }],
      [167, { id: 167, name: "Claro video" }],
      [484, { id: 484, name: "Claro TV+" }],
      [283, { id: 283, name: "Crunchyroll" }],
      [307, { id: 309, name: "Globoplay" }],
    ]);

    try {
      const endpoint = `3/${mediaType}/${id}/watch/providers`;
      const res = await api.get(endpoint, options);
      const brazilProviders = res.data.results.BR;

      if (!brazilProviders) return [];

      const allApiProviders = [
        ...(brazilProviders.flatrate || []),
        ...(brazilProviders.buy || []),
        ...(brazilProviders.rent || []),
      ];

      const finalProviders = new Map();

      for (const provider of allApiProviders) {
        if (supportedProvidersMap.has(provider.provider_id)) {
          const canonicalProvider = supportedProvidersMap.get(
            provider.provider_id
          );
          if (!finalProviders.has(canonicalProvider.id)) {
            finalProviders.set(canonicalProvider.id, {
              provider_id: canonicalProvider.id,
              provider_name: canonicalProvider.name,
              logo_path: provider.logo_path,
              display_priority: provider.display_priority,
            });
          }
        }
      }

      return Array.from(finalProviders.values()).map(
        (provider) => provider.provider_name
      );
    } catch (error) {
      console.error(
        `Falha ao buscar providers para ${mediaType} ID ${id}:`,
        error.message
      );
      return [];
    }
  }
}

module.exports = new TmdbRequests();
