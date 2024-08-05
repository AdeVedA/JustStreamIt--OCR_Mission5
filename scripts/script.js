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


document.addEventListener('DOMContentLoaded', function() {
    // Sélectionnez toutes les listes déroulantes des genres
    const genreChoixDeroulant = document.querySelectorAll('#AutresGenres');
    
    // Écouter l'événement de changement pour chaque liste déroulante
    genreChoixDeroulant.forEach(select => {
        select.addEventListener('change', function(event) {
            const monGenre = event.target.value;
            const section = event.target.closest('section, section2');
            const mesDivs = section.querySelectorAll('[id^=movie]');
            // console.log(mesDivs)
            // Mettre à jour les ids des divs
            mesDivs.forEach((div, index) => {
                div.id = `movie${monGenre}`;
            });

            // Appelle la fonction pour obtenir des films par la catégorie sélectionnée
            getFilmsCategory(monGenre);
        });
    });
});

// récupérer les noms des genres de film (marge d'extensibilité jusqu'à 1000 genres)
// et insérer les genres de film dans les listes déroulantes pour les 2 blocs à formulaire
async function getGenres() {
    const url = "http://localhost:8000/api/v1/genres?page_size=1000"
    try {
        const response = await fetch(url);
        const data = await response.json();
        const genresList = data.results.map(genre => genre.name);
        const selectElements = document.querySelectorAll("select");
        // pour les 2 balises <select> de sélection de genre cinematographique
        selectElements.forEach(select => {
            // pour chaque genre dans la liste de genres, on crée une option pour ce genre
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

