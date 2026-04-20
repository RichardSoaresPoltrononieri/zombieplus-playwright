const { test } = require ('@playwright/test')
const data = require('../support/fixtures/movies.json')
const { LoginPage } = require('../pages/LoginPage')
const { Toast } = require('../pages/Components')
const { MoviesPage } = require('../pages/MoviesPage')

const { executeSql } = require('../support/fixtures/database')

let loginPage
let toast
let moviesPage

test.beforeEach(({ page }) => {
    loginPage = new LoginPage(page)
    toast = new Toast(page)
    moviesPage = new MoviesPage(page)
})


test('deve cadastrar um novo filme', async ({ page }) => {
    const movie = data.create

    await executeSql(`DELETE FROM movies WHERE title = '${movie.title}';`)

    await loginPage.visit()
    await loginPage.submit('admin@zombieplus.com', 'pwd123')
    await moviesPage.isLoggedIn()

    await moviesPage.create(movie.title, movie.overview, movie.company, movie.release_year)

    await toast.containText('UhullCadastro realizado com sucesso!')
})

test('não deve cadastrar um filme já existente', async ({ page }) => {
    const movie = data.create

    await loginPage.visit()
    await loginPage.submit('admin@zombieplus.com', 'pwd123')
    await moviesPage.isLoggedIn()

    await moviesPage.create(movie.title, movie.overview, movie.company, movie.release_year)
    await toast.containText('Oops!Este conteúdo já encontra-se cadastrado no catálogo')
})