const {api, options} = require('./api');
const Media = require("../../../Core/Entities/media");

class TmdbRequests {
    async fetchCategory(
        mediaType,
        genreId,
        page
        ){
            const isMovie = mediaType === "movie";
            
            const flexibleGenres = [99, 27, 10402, 10764, 10762, 16];
            const isFlexibleGenre = flexibleGenres.includes(parseInt(genreId)); // Melhoria: garantir que genreId seja número
            
            const minVotes = isFlexibleGenre ? 50 : 500;
            const minRating = isFlexibleGenre ? 6.0 : 7.0;
            const dateField = isMovie ? 'primary_release_date.gte' : 'first_air_date.gte';
            const dateCut = isFlexibleGenre ? "1990-01-01" : "2005-01-01";

            let url = '';

            const base = `3/discover/${mediaType}?include_adult=false&include_null_first_air_dates=false&language=pt-BR&page=${page}` +
                         `&sort_by=vote_count.desc&vote_count.gte=${minVotes}&vote_average.gte=${minRating}&${dateField}=${dateCut}&watch_region=BR&include_image_language=pt,null`;

            if (genreId != 0) {
                if (parseInt(genreId) === 16) { // Animação ocidental
                    url = `${base}&with_genres=16&without_keywords=210024`;
                } 
                else if (parseInt(genreId) === 17){ // Animes
                    url = `${base}&with_genres=16&with_original_language=ja`;
                }
                else { // Outros gêneros
                    url = `${base}&with_genres=${genreId}&without_genres=16`;
                }
            } else { // Trending
                url = `3/trending/${mediaType}/day?language=pt-BR&region=BR&page=${page}`;
            }

            const res = await api.get(url, options);

            const filteredResults = res.data.results.filter(
                (item) => item.overview?.trim() !== "" && item.backdrop_path
            );

            const mediaInstances = filteredResults.map(item => {
                item.type = mediaType
                if(!isMovie){
                    item.title = item.name
                }
                return new Media(item)
            });

            return mediaInstances;
        };
}

module.exports = new TmdbRequests();