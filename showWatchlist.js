import {listMovies, moviesWatchlist, urlImg, inputSearch, watchlistAddOrDelete} from './app.js'
import { limitCharacters } from './otherFunctions.js';

// The function generate a list of the movies on Watchlist
export function showWatchlist() {
    inputSearch.value = ''
    listMovies.innerHTML = ''
    if (moviesWatchlist.length !== 0) {
        moviesWatchlist.forEach(movie => {
            const {
                title,
                poster_path,
                vote_average,
                overview,
                id,
                isWatched
            } = movie
            movie = `
            <div class="movies__card" data-id="${id}">
            <div class="movies__card-area-img">
                <img src="${poster_path !== null ? urlImg + poster_path : './img/empty.png'}" class="movies__card-img" alt="${title}">
                <div class="movies__card-score">
                    <p class="movies__card-score-number">${vote_average}</p>
                </div>
            </div>
            <div class="movies__card-content">
                <h3 class="movies__card-title">${title}</h3>
                <p class="movies__card-text">${limitCharacters(`${overview}`, 150)}</p>
                <div class="movies__card-btns-watchlist">
                ${!isWatched ? `<button class="movies__card-btn" data-type="watched">Watched <i class="fa-solid fa-circle-check movies__card-btn-done"></i></button>` 
                : `<button class="movies__card-btn movies__watched" data-type="watched">Watched <i class="fa-solid fa-circle-check movies__card-btn-done"></i></button>`}
                <button class="movies__card-btn" data-type="remove">Remove <i class="fa-solid fa-circle-minus movies__card-btn-delete"></i></button>
                </div>
            </div>
        </div>`
            listMovies.innerHTML += movie
        });
        watchlistAddOrDelete ()
  
    } if (moviesWatchlist.length === 0) {
        listMovies.innerHTML = '<i class="fa-solid fa-clapperboard movies__icon"></i><p class="movies__empty">Your Watchlist is currently empty. Add some movies to your Watchlist.</p>'
    }
}
