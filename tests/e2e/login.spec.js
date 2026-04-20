const { test, expect } = require('@playwright/test')
const { LoginPage } = require('../pages/LoginPage')
const { Toast } = require('../pages/Components')
const { MoviesPage } = require('../pages/MoviesPage')

let loginPage
let toast
let moviesPage

test.beforeEach(({ page }) => {
    loginPage = new LoginPage(page)
    toast = new Toast(page)
    moviesPage = new MoviesPage(page)
})

test('deve logar como administrador', async ({ page }) => {
    await loginPage.visit()
    await loginPage.submit('admin@zombieplus.com', 'pwd123')
    await moviesPage.isLoggedIn()
})

test('não deve logar com senha incorreta', async ({ page }) => {
    await loginPage.visit()
    await loginPage.submit('admin@zombieplus.com', '000000')

    const message = 'Oops!Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.'
    await toast.containText(message)
})

test('não deve logar com email incorreto', async ({ page }) => {
    await loginPage.visit()
    await loginPage.submit('invalid@zombieplus.com', 'pwd123')

    const message = 'Oops!Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.'
    await toast.containText(message) 
})

test('não deve logar com email invalido', async ({ page }) => {
    await loginPage.visit()
    await loginPage.submit('invalid', '123')

    await loginPage.alertHaveText('Email incorreto'); 
})

test('não deve logar quando o email não é preenchido', async ({ page }) => {
    await loginPage.visit()
    await loginPage.submit('', 'pwd123')

    await loginPage.alertHaveText('Campo obrigatório'); 
})

test('não deve logar quando a senha não é preenchida', async ({ page }) => {
    await loginPage.visit()
    await loginPage.submit('admin@zombieplus.com', '')

    await loginPage.alertHaveText('Campo obrigatório'); 
})

test('não deve logar quando não preenche nenhuma informação', async ({ page }) => {
    await loginPage.visit()
    await loginPage.submit('', '')

    await loginPage.alertHaveText([
    'Campo obrigatório',
    'Campo obrigatório'
    ]); 
})