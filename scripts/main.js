getBestFilm()

const genresList = getGenres()
const fixedCategories = ["", "Mystery", "Adventure", "Fantasy", "Animation", "Thriller"]

for (let i = 0; i < fixedCategories.length; i++) {
    getFilmsCategory(fixedCategories[i]);
}
