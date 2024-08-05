const genresList = getGenres()
const fixedCategories = ["", "Mystery", "Adventure", "Fantasy"]

console.log(genresList)
for (let i = 0; i < fixedCategories.length; i++) {
    getFilmsCategory(fixedCategories[i]);
}

idBestFilm = getBestFilm()
getFilmDetails(idBestFilm)