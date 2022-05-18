import {
    listMovies,
    getFullDataMovies,
    fullMovieUrl
} from "./app.js"

// The information will appear, when the movie doesn't exist in database or your title movie is incorrect.
function noSearchResults() {
    return '<i class="fa-solid fa-clapperboard movies__icon"></i><p class="movies__empty">Not find the movie. Please try again.</p>'
}

// The function is responsible for limit characters of the movie.
function limitCharacters(string, limit) {
    return string.substring(string, limit)
}

function clickLogo() {
    const inputSearch = document.querySelector('.search__input')
    listMovies.innerHTML = ''
    getFullDataMovies(fullMovieUrl)
    inputSearch.value = ''
}

export {
    noSearchResults,
    limitCharacters,
    clickLogo
}