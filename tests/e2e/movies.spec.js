const { test, expect } = require ('../support')
const data = require('../support/fixtures/movies.json')

const { executeSql } = require('../support/fixtures/database')

test('deve cadastrar um novo filme', async ({ page }) => {
    const movie = data.create

    await executeSql(`DELETE FROM movies WHERE title = '${movie.title}';`)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.create(movie.title, movie.overview, movie.company, movie.release_year)
    await page.toast.containText('UhullCadastro realizado com sucesso!')
})

test('não deve cadastrar um filme já existente', async ({ page }) => {
    const movie = data.create

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.create(movie.title, movie.overview, movie.company, movie.release_year)
    await page.toast.containText('Oops!Este conteúdo já encontra-se cadastrado no catálogo')
})

test('não deve cadastrar quando os campos obrigatórios não são preenchidos', async ({ page }) => {

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')

    await page.movies.goForm()
    await page.movies.submit()
    await page.movies.alertHaveText([
        'Por favor, informe o título.',
        'Por favor, informe a sinopse.',
        'Por favor, informe a empresa distribuidora.',
        'Por favor, informe o ano de lançamento.'
    ])
})