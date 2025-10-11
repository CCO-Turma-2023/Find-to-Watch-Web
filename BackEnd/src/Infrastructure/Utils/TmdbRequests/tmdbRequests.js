const {api, options, omdb} = require('./api');
const Media = require("../../../Core/Entities/media");

class TmdbRequests {
    async fetchCategory(
        mediaType,
        genreId,
        page
    ){
        const isMovie = mediaType === "movie";
        
        const flexibleGenres = [99, 27, 10402, 10764, 10762, 16];
        const isFlexibleGenre = flexibleGenres.includes(parseInt(genreId));
        
        const minVotes = isFlexibleGenre ? 50 : 500;
        const minRating = isFlexibleGenre ? 6.0 : 7.0;
        const dateField = isMovie ? 'primary_release_date.gte' : 'first_air_date.gte';
        const dateCut = isFlexibleGenre ? "1990-01-01" : "2005-01-01";

        let url = '';

        const base = `3/discover/${mediaType}?include_adult=false&include_null_first_air_dates=false&language=pt-BR&page=${page}` +
                     `&sort_by=vote_count.desc&vote_count.gte=${minVotes}&vote_average.gte=${minRating}&${dateField}=${dateCut}&watch_region=BR&include_image_language=pt,null`;

        if (genreId != 0) {
            if (parseInt(genreId) === 16) {
                url = `${base}&with_genres=16&without_keywords=210024`;
            } 
            else if (parseInt(genreId) === 17){
                url = `${base}&with_genres=16&with_original_language=ja`;
            }
            else {
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
            const data = await this.RequestMediabyId(item.id, mediaType);
            
            item.type = mediaType;
            if(!isMovie){
                item.title = item.name;
            }

            item.genres = data.genres.map(genre => genre.name);
            item.runtime = isMovie ? data.runtime : (data.episode_run_time?.[0] || 0);
            item.year = (isMovie ? data.release_date : data.first_air_date)?.split("-")[0];
            item.cast = data.cast;

            return item;
        });

        const detailedItems = await Promise.all(promises);

        const mediaInstances = detailedItems.map(item => new Media(item));

        return mediaInstances;
    };

    async RequestMediabyId(id, mediaType){
        const isMovie = mediaType === "movie";

        const endpoint = isMovie
            ? `3/movie/${id}`
            : `3/tv/${id}`;
        
        const res = await api.get(`${endpoint}?language=pt-BR&region=BR`, options);
        
        const castEndpoint = isMovie ? `3/movie/${id}/credits` : `3/tv/${id}/credits`;
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
    };
}

module.exports = new TmdbRequests();