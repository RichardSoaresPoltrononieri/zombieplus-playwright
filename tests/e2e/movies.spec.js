const { test, expect } = require ('../support')
const data = require('../support/fixtures/movies.json')

const { executeSql } = require('../support/fixtures/database')

test.beforeAll(async () => {
    await executeSql(`DELETE FROM movies`)
})

test('deve cadastrar um novo filme', async ({ page }) => {
    const movie = data.create

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.create(movie)
    await page.popup.haveText(`O filme '${movie.title}' foi adicionado ao catálogo.`)
})

test('não deve cadastrar um filme já existente', async ({ page, request }) => {
    const movie = data.duplicate
    await request.api.postMovie(movie)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.create(movie)
    await page.popup.haveText(`O título '${movie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)
})

test('não deve cadastrar quando os campos obrigatórios não são preenchidos', async ({ page }) => {

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')

    await page.movies.goForm()
    await page.movies.submit()
    await page.movies.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório'
    ])
})