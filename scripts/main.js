//url de base de l'API
const url = "http://localhost:8000/api/v1/titles"
//appel de la fonction qui récupère le film ayant la meilleure note
getBestFilm()
//récupérer la liste des genres et déterminer les catégories d'affichage fixe
const genresList = getGenres()
const fixedCategories = ["", "Mystery", "Adventure", "Fantasy", "Animation", "Thriller"]
//récupérer les films des catégories d'affichage fixe
for (let i = 0; i < fixedCategories.length; i++) {
    getFilmsCategory(fixedCategories[i]);
}

//fonction pour récupérer le meilleur film (image et titre et id)
async function getBestFilm() {
    const imageFilm = document.getElementById('image-film');
    const titreFilm = document.getElementById('titre-film');
    const descriptionFilm = document.getElementById('description-film');
    // definir l'endpoint de l'API pour trouver le film au meilleur score imdb
    const url = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
    // récupérer les infos de l'API
    try {
        // récupérer les infos du film le mieux noté
        const response = await fetch(url);
        const data = await response.json();
        const topFilm = data.results[0];
        // mettre à jour l'UI avec les infos du film
        imageFilm.src = topFilm.image_url;
        titreFilm.textContent = topFilm.title;
        // récupérer de l'url du film la description
        document.querySelector(".film-infos button").dataset.id = topFilm.id
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
}

//récupérer les films d'une catégorie (genre) de films
async function getFilmsCategory(category) {
    const box6Uri = "?page_size=6&sort_by=-imdb_score&genre="
    const listDivs = document.querySelectorAll(`.movie${category}`);
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
            maDiv = listDivs[i]
            if(monFilm !== undefined){
                maDiv.classList.remove("display-none")
                maDiv.querySelector("img").onerror = function() {
                    this.src = "images/no_cover.png"
                    }
                maDiv.querySelector("img").src = monFilm.image_url
                maDiv.querySelector(".title").textContent = monFilm.title
                maDiv.querySelector("button").dataset.id = monFilm.id
            } else {
                maDiv.classList.add("display-none")
            }
        }
        if (listFilms.length <= 4) {
            let maSection = listDivs[0].closest('section')
            showVoirPlusOrNot(maSection);
        }
    } catch (error) {
        console.error("Erreur en voulant récupérer le film:", error);
    }
}

window.addEventListener('resize', function() {
    let mesBlocs6 = document.querySelectorAll('section > div.bloc6')
    mesBlocs6.forEach((monBloc) => {
        let mesFilms = monBloc.querySelectorAll('[class*="movie"]:not(.display-none)');
        if (mesFilms.length <= 4) {
            let maSection = monBloc.closest('section')
            showVoirPlusOrNot(maSection)
        }
    })
})

// cacher le bouton voir+/voir- 
// quand le nombre de films récupérés est <= au nombre d'affiches 
// proposées en fonction de la taille d'affichage
function showVoirPlusOrNot(maSection) {
    let maDiv = maSection.querySelector('.bloc6');
    let monBouton = maDiv.querySelector('button[class*=voir]');
    let mesFilms = maDiv.querySelectorAll('div[class*="movie"]:not(.display-none)');
    if (window.innerWidth <= 600) {
        if (mesFilms.length <= 2) {
            monBouton.classList.add("display-none")
        } else {
            monBouton.classList.remove("display-none")
        }
    } else if (window.innerWidth >= 601 && window.innerWidth <= 992) {
        if (mesFilms.length <= 4) {
            monBouton.classList.add("display-none")
        } else {
            monBouton.classList.remove("display-none")
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Sélectionnez toutes les listes déroulantes des genres
    const genreChoixDeroulant = document.querySelectorAll('.AutresGenres');
    
    // Écouter l'événement de changement pour chaque liste déroulante
    genreChoixDeroulant.forEach(select => {
        select.addEventListener('change', function(event) {
            const monGenre = event.target.value;
            const section = event.target.closest('section');
            const mesDivs = section.querySelectorAll('[class*=movie]');
            // Mettre à jour les ids des divs
            mesDivs.forEach((div) => {
                // Supprimer la classe movie* existante
                div.classList.forEach(className => {
                    if (className.startsWith('movie')) {
                        div.classList.remove(className);
                    }
                });
                // Ajouter la nouvelle classe
                div.classList.add(`movie${monGenre}`);
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
        const genresFullList = data.results.map(genre => genre.name);
        const genresList = genresFullList.filter(genre => !fixedCategories.includes(genre));
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

// effet des boutons "Voir plus" (+2 ou +4 films en visu)
document.addEventListener("DOMContentLoaded", function() {
    document.body.addEventListener("click", function(event) {
        let button = event.target;
        if (event.target.classList.contains("voirplus") || event.target.classList.contains("voirmoins")) {
            let parent = button.closest('.bloc6');
            let items = parent.querySelectorAll('.poster');
            if (event.target.classList.contains("voirplus")) {
                items.forEach(function(item) {
                    item.style.display = 'flex';
                });
                button.textContent = " Voir moins ";
                button.classList.remove("voirplus");
                button.classList.add("voirmoins");
                //et dans l'autre sens... effet des boutons "Voir moins"
                //condition sur 'modal-trigger' ajoutée pour éviter
                //que les boutons "détails" s'appellent " voir plus " en retour de modale
            } else if (!event.target.classList.contains("modal-trigger")) {
                items.forEach(function(item) {
                    item.style.removeProperty('display');
                });
                button.textContent = " Voir plus ";
                button.classList.remove("voirmoins");
                button.classList.add("voirplus");
            }
        }
    });
});

