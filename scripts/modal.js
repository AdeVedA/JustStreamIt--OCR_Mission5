
document.addEventListener('DOMContentLoaded', function(){
    const btn = document.getElementById("bouton-details");
    const modalTriggers = document.querySelectorAll(".modal-trigger");
    if (btn) {
        btn.addEventListener('click', function(){
            modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal))
        });
    }
});

function toggleModal(){
    const modal = document.getElementById("fenetre-modale");
    if (modal) {
        if (modal.classList.contains("active")) {
            modal.classList.remove("active");
        } else {
        modal.classList.add("active");
        }
    }    
}

// FENETRE MODALE
// fonction qui récupère les infos du film sur l'API
// et les charge dans la fenêtre modale du film
async function getFilmDetails(idFilm) {
    const id = await idFilm;
    const url = `http://localhost:8000/api/v1/titles/${id}`;
    const titreFilm = document.getElementById('film-titre')
    const anneeGenresFilm = document.getElementById('année-genres')
    const pgDureeFilm = document.getElementById('pg-duree-origine')
    const revenuBrut = document.getElementById('revenu-brut')
    const imdbScoreFilm = document.getElementById('imdb-score')
    const realFilm = document.getElementById('realisateurs')
    const coverFilm = document.getElementById('modal-image-film')
    const synopsis = document.getElementById('modal-desc')
    const casting = document.getElementById('casting')
    try {
        const response = await fetch(url);
        const data = await response.json();
        // mettre à jour la fenêtre modale avec les infos du film
        titreFilm.textContent = data.title;
        anneeGenresFilm.textContent = data.year +' - '+ data.genres;
        pgDureeFilm.textContent = data.rated +' - '+ data.duration +' minutes '+'('+data.countries+')';
        if (data.worldwide_gross_income === null) {
            revenuBrut.textContent = "Recettes inconnues..."
        } else {
            revenuBrut.textContent = data.worldwide_gross_income +'$';
        }
        imdbScoreFilm.textContent = 'IMDB score: '+ data.imdb_score +" / 10";
        realFilm.textContent = data.directors;
        coverFilm.src = data.image_url;
        synopsis.textContent = data.long_description;
        casting.textContent = data.actors;
        //récupérer de l'url du film la description
    } catch (error) {
        console.error('Erreur en voulant récupérer les infos détaillées du film:', error);
    } 
}
