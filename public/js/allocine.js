'use strict'

import {HTTP} from './lib/HTTP.js';

window.onload = () => {
    var cines = document.querySelectorAll('.cine');
    var movies = document.querySelector('.movies');
    var actors = document.querySelector('.actors');

    for (let cine of cines) {
        cine.addEventListener('click', e => {
            HTTP.get(`/movies/${cine.getAttribute('meta-code')}`, (err, res) => {
                if (err) throw err;

                movies.innerHTML = null;
                actors.innerHTML = null;

                for (let movie of res) {
                    let mov = document.createElement('div');
                    let stars = null;

                    mov.classList.add('movie');

                    let dom = `
                        <div class="movie-header">
                            <p class="title">${movie.nomFilm}</p>
                            <img src="${movie.imageFilm}", alt="${movie.nomFilm}", width="150">
                        </div>

                        <div class="movie-body">
                            <p>Genre : ${movie.genreFilm}</p>
                            <p class="vote">
                                <span><i class="far fa-star"></i></span>
                                <span><i class="far fa-star"></i></span>
                                <span><i class="far fa-star"></i></span>
                                <span><i class="far fa-star"></i></span>
                                <span><i class="far fa-star"></i></span>
                            </p>
                            <p>Note : ${(movie.totalVotes / movie.nbVotes).toFixed(2)}/5</p>
                        </div>
                    `;

                    mov.innerHTML = dom;
                    movies.appendChild(mov);
                    stars = mov.querySelectorAll('.vote span');

                    for (let range in stars) {
                        stars[range].addEventListener('click', e => {
                            HTTP.post(`/vote/${movie.codeFilm}/${parseInt(range) + 1}`, (err, res) => {
                                if (err) throw err;

                                console.log(res);
                            })
                        });
                    }

                    mov.addEventListener('click', e => {
                        HTTP.get(`/actors/${movie.codeFilm}`, (err, res) => {
                            if (err) throw err;

                            actors.innerHTML = null;

                            for (let actor of res) {
                                let act = document.createElement('div');

                                act.classList.add('actor');

                                let dom = `
                                    <div class="actor-header">
                                        <p class="title">${actor.nomActeur}</p>
                                        <img src="${actor.imageActeur}", alt="${actor.nomActeur}", width="150">
                                    <div>
                                `;

                                act.innerHTML = dom;
                                actors.appendChild(act);
                            }
                        });
                    });
                }
            });
        });
    }
};


