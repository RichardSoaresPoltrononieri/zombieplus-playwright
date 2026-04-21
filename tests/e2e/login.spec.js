const { test, expect } = require ('../support')
const { Toast } = require('../actions/Components')


test('deve logar como administrador', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('admin@zombieplus.com', 'pwd123')
    await page.login.isLoggedIn()
})

test('não deve logar com senha incorreta', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('admin@zombieplus.com', '000000')

    const message = 'Oops!Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.'
    await page.toast.containText(message)
})

test('não deve logar com email incorreto', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('invalid@zombieplus.com', 'pwd123')

    const message = 'Oops!Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.'
    await page.toast.containText(message) 
})

test('não deve logar com email invalido', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('invalid', '123')

    await page.login.alertHaveText('Email incorreto'); 
})

test('não deve logar quando o email não é preenchido', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('', 'pwd123')

    await page.login.alertHaveText('Campo obrigatório'); 
})

test('não deve logar quando a senha não é preenchida', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('admin@zombieplus.com', '')

    await page.login.alertHaveText('Campo obrigatório'); 
})

test('não deve logar quando não preenche nenhuma informação', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('', '')

    await page.login.alertHaveText([
    'Campo obrigatório',
    'Campo obrigatório'
    ]); 
})