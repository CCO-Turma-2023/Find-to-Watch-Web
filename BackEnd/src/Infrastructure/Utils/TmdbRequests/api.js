const axios = require("axios");

const tmdbToken = process.env.TMDB_TOKEN;
const omdbToken = process.env.OMDB_KEY;

const api = axios.create({
  baseURL: "https://api.themoviedb.org/",
  timeout: 10000, // tempo limite de requisição
});

const omdb = axios.create({
  baseURL: `https://www.omdbapi.com/?apikey=${omdbToken}`,
  timeout: 10000,
})

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: tmdbToken,
  },
};

module.exports = {api, options, omdb};