const url = "http://localhost:8000/api/v1/titles"

async function getFilmsCategory(category) {
    const box6Uri = "?page_size=6&sort_by=-imdb_score&genre="
    const listDivs = document.querySelectorAll(`#movie${category}`);
    // definir l'endpoint de l'API pour trouver les 6 meilleurs films
    // la categorie donnée en argument
    const urlCategory = `${url}${box6Uri}${category}`;
    // récupérer les infos de l'API
    try {
        // récupérer les infos du film le mieux noté
        let response = await fetch(urlCategory);
        let data = await response.json();
        let listFilms = data.results;
        // mettre à jour l'UI avec les infos du film
        for(let i = 0; i < 6; i++) {
            let monFilm = listFilms[i]
            let maDiv = listDivs[i]
            maDiv.querySelector("img").onerror = function() {
                this.src = "images/no_cover.png"
            }
            maDiv.querySelector("img").src = monFilm.image_url
            maDiv.querySelector(".title").textContent = monFilm.title
            maDiv.querySelector("button").dataset.id = monFilm.id
        }
    } catch (error) {
        console.error("Erreur en voulant récupérer le film:", error);
    }
}

// document.addEventListener('DOMContentLoaded', function(event){
//     const btn = document.getElementById("bouton-details");
//     const modalTriggers = document.querySelectorAll(".modal-trigger");
//     if (btn) {
//         btn.addEventListener('click', function(){
//             modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal))
//         });
//     }
// });
// document.addEventListener('click', function(event) {
//     const modalTriggers = document.querySelectorAll(".modal-trigger");
//     const boutonDetails = event.target
//     let idFilm = boutonDetails.dataset.id
//     const monFilm = getFilmDetails(idFilm)
//     if (boutonDetails) {
//         boutonDetails.addEventListener('click', function(){
//             modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal))
//         });
//     }
//     // mamodal = document.querySelector(#modal)
//     // mamodal.querySelector(".titre").innerHtml = monfilm.titre
//     // mamodal.classList.add("active")
// })

// récupérer les noms des genres de film (marge d'extensibilité jusqu'à 1000 genres)
// et insérer les genres de film dans les listes déroulantes pour les 2 blocs à formulaire
async function getGenres() {
    const url = "http://localhost:8000/api/v1/genres?page_size=1000"
    try {
        const response = await fetch(url);
        const data = await response.json();
        const genresList = data.results.map(genre => genre.name);
        const selectElements = document.querySelectorAll("select");

        selectElements.forEach(select => {
            genresList.forEach(genre => {
                const option = document.createElement("option");
                option.value = genre;
                option.textContent = genre;
                select.appendChild(option);
            });
        });
        return genresList        
    } catch (error) {
        console.error("Erreur en voulant récupérer la liste de genres:", error);
    }
}


//fonction pour récupérer le meilleur film (image et titre et id)
async function getBestFilm() {
    const imageFilm = document.getElementById('image-film');
    const titreFilm = document.getElementById('titre-film');
    const descriptionFilm = document.getElementById('description-film');
    // definir l'endpoint de l'API pour trouver le film au meilleur score imdb
    const url = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
    // récupérer les infos de l'API
    let idFilm = null;
    try {
        // récupérer les infos du film le mieux noté
        const response = await fetch(url);
        const data = await response.json();
        const topFilm = data.results[0];
        // mettre à jour l'UI avec les infos du film
        imageFilm.src = topFilm.image_url;
        titreFilm.textContent = topFilm.title;
        //récupérer de l'url du film la description
        document.querySelector(".film-infos button").dataset.id = topFilm.id
        // idFilm = topFilm.id;
        const urlTopFilmDetails = topFilm.url
        try {
            const response = await fetch(urlTopFilmDetails)
            const data = await response.json();
            descriptionFilm.textContent = data.description;
        } catch (error) {
            console.error("Erreur en voulant récupérer la description du film:", error);
        }
    } catch (error) {
        console.error("Erreur en voulant récupérer le film:", error);
    }
    // cacher le message initial de "chargement en cours"
    document.querySelector('.film-encart p').style.display = 'none';
    return idFilm
}

