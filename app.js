import {
    noSearchResults,
    limitCharacters,
    clickLogo,
} from "./otherFunctions.js";

import {
    showWatchlist
} from "./showWatchlist.js";

// List of important API's datas.
const API = 'api_key=d5c35e51c81488b19da7c1f572507a3d&]';
const website = 'https://api.themoviedb.org/3/';
const urlImg = 'https://image.tmdb.org/t/p/original';
const fullMovieUrl = website + 'movie/popular?' + API

// List of selectors.
const listMovies = document.querySelector('.movies')
const btnSearch = document.querySelector('.search__btn')
const logo = document.querySelector('.search__logo')
const searchPocketNumber = document.querySelector('.search__pocket-number')
const watchlist = document.querySelector('.search__pocket')
const inputSearch = document.querySelector('.search__input')

// The array, in which the movies are stored.
let moviesWatchlist = []

// Add movies to the localstorage.
function addToLocalStorage() {
    const toStorage = JSON.stringify(moviesWatchlist)
    localStorage.setItem('watchMoviesList', toStorage);
}

// Implement datas from localstorage to the array.
function showLocalStorage() {
    if (localStorage.getItem('watchMoviesList') === null) moviesWatchlist = []
    else moviesWatchlist = JSON.parse(localStorage.getItem("watchMoviesList"));
}

// This function responsible for get all function's of API and render the list of movies.
function renderListMovies() {
    showLocalStorage()
    getFullDataMovies(fullMovieUrl)
}

// Fetch API from TMDB.
function getFullDataMovies(fullMovie) {
    fetch(fullMovie)
        .then(response => response.json())
        .then(data => {
            showTopMovies(data)
        })
        .catch(error => {
            noSearchResults()
            throw (error)
        })
}

// The functions allows searching the movie.
function searchTheMovie(e) {
    e.preventDefault()
    const apiKeyword = website + 'search/movie?' + API + '&query=' + inputSearch.value
    listMovies.innerHTML = ''
    if (inputSearch.value == '') listMovies.innerHTML = noSearchResults()
    else getFullDataMovies(apiKeyword)
    inputSearch.value = ''
}

// The function allows to generate list of movies from database.
function showTopMovies(data) {
    searchPocketNumber.innerHTML = moviesWatchlist.length
    data.results.forEach(element => {
        const {
            title,
            poster_path,
            vote_average,
            overview,
            id
        } = element
        element = `<div class="movies__card" data-id="${id}">
        <div class="movies__card-area-img">
            <img src="${poster_path !== null ? urlImg + poster_path : './img/empty.png'}" class="movies__card-img" alt="${title}">
            <div class="movies__card-score">
                <p class="movies__card-score-number">${vote_average}</p>
            </div>
        </div>
        <div class="movies__card-content">
            <h3 class="movies__card-title">${title}</h3>
            <p class="movies__card-text">${limitCharacters(`${overview}`, 150)}</p>
            ${checkButtonStatus(id)}
        </div>
    </div>`
        listMovies.innerHTML += element
    })
    addToTheWatchlist(data)
}

// The function check buttons status and add class and valid parametrs.
function checkButtonStatus(id) {
    const checkID = moviesWatchlist.some(el => el.id == id)
    if (checkID) return `<button class="movies__card-btn">Remove from the list <i class="fa-solid fa-circle-minus movies__card-btn-delete"></i></button>`
    else if (!checkID) return `<button class="movies__card-btn">Add to watch! <i class="fa-solid fa-star movies__card-btn-star"></i></button>`
}

// The function is responsible for add and delete movie to the array
function addToTheWatchlist(data) {
    const btnCards = document.querySelectorAll('.movies__card-btn')
    const searchStar = document.querySelector('.movies__card-btn-star')
    btnCards.forEach(btn => {
        btn.addEventListener('click', () => {
            const checkElement = moviesWatchlist.some(element => element.id == btn.parentNode.parentNode.dataset.id)
            const addElement = data.results.find(element => element.id == btn.parentNode.parentNode.dataset.id)
            const deleteElement = moviesWatchlist.filter(element => element.id != btn.parentNode.parentNode.dataset.id)

            if (!checkElement) {
                moviesWatchlist.push({
                    ...addElement,
                    isWatched: false
                })
                searchStar.classList.add('starAnimation')
                setTimeout(() => searchStar.classList.remove('starAnimation'), 1000)
                btn.innerHTML = `Remove from the list <i class="fa-solid fa-circle-minus movies__card-btn-delete"></i>`
            } else if (checkElement) {
                moviesWatchlist = deleteElement
                searchStar.classList.add('starAnimationDelete')
                setTimeout(() => searchStar.classList.remove('starAnimationDelete'), 1000)
                btn.innerHTML = `Add to watch! <i class="fa-solid fa-star movies__card-btn-star"></i>`
            }

            addToLocalStorage()
            searchPocketNumber.innerHTML = moviesWatchlist.length
        })
    })
}

// The function allows to add movie to "watched" or delete a movie from watchlist.
function watchlistAddOrDelete() {
    const watchlistBtns = document.querySelectorAll('.movies__card-btn')
    watchlistBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const addToTheWatchedMovies = moviesWatchlist.find(element => element.id == btn.parentNode.parentNode.parentNode.dataset.id)
            const deleteMovieFromWatchList = moviesWatchlist.filter(movie => movie.id != btn.parentNode.parentNode.parentNode.dataset.id)

            if (btn.dataset.type == 'watched' && addToTheWatchedMovies) {
                if (addToTheWatchedMovies.isWatched === false) {
                    addToTheWatchedMovies.isWatched = true
                    btn.classList.add('movies__watched')
                } else if (addToTheWatchedMovies.isWatched === true) {
                    addToTheWatchedMovies.isWatched = false
                    btn.classList.remove('movies__watched')
                }
            } else if (btn.dataset.type == 'remove' && addToTheWatchedMovies) {
                moviesWatchlist = deleteMovieFromWatchList
                const movieCarts = document.querySelectorAll('.movies__card')
                movieCarts.forEach(cart => {
                    if (cart.dataset.id == addToTheWatchedMovies.id) cart.remove()
                })
                if (moviesWatchlist.length === 0) {
                    listMovies.innerHTML = '<i class="fa-solid fa-clapperboard movies__icon"></i><p class="movies__empty">Your Watchlist is currently empty. Add some movies to your Watchlist</p>'
                }
            }
            searchPocketNumber.innerHTML = moviesWatchlist.length
            addToLocalStorage()
        })
    })
}

// When you click the logo you will return to the homepage.
logo.addEventListener('click', clickLogo)

// AddEventListener is responsible for showing the Watchlist, DOM Content Loaded,Search Engine and back to the homepage
watchlist.addEventListener('click', showWatchlist)
btnSearch.addEventListener('click', searchTheMovie)
window.addEventListener('DOMContentLoaded', renderListMovies)
logo.addEventListener('click', clickLogo)

export {
    urlImg,
    listMovies,
    searchPocketNumber,
    moviesWatchlist,
    addToLocalStorage,
    showLocalStorage,
    watchlistAddOrDelete,
    inputSearch,
    getFullDataMovies,
    fullMovieUrl
}