const genresList = getGenres()
const fixedCategories = ["", "Mystery", "Adventure", "Fantasy", "Animation", "Thriller"]

console.log(genresList)
for (let i = 0; i < fixedCategories.length; i++) {
    getFilmsCategory(fixedCategories[i]);
}

idBestFilm = getBestFilm()
getFilmDetails(idBestFilm)