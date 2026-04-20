// @ts-nocheck
const { test, expect } = require ('@playwright/test')
const { faker } = require('@faker-js/faker')
const { LandingPage } = require('../pages/LandingPage')
const { Toast } = require('../pages/Components')

let landingPage
let toast

test.beforeEach(async ({ page }) => {
  landingPage = new LandingPage(page);
  toast = new Toast(page);
})

test('deve cadastrar um lead na fila de espera', async ({ page }) => {
  const leadName = faker.person.fullName();
  const leadEmail = faker.internet.email();

  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm(leadName, leadEmail);

  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!'
  await toast.containText(message);  
});

test('não deve cadastrar quando o email já existe', async ({ page, request }) => {
  const leadName = faker.person.fullName();
  const leadEmail = faker.internet.email();

  const newLead = await request.post('http://localhost:3333/leads', {
    data: {
      name: leadName,
      email: leadEmail
    }
  })

  expect(newLead.status()).toBe(201);

  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm(leadName, leadEmail);

  const message = 'O endereço de e-mail fornecido já está registrado em nossa fila de espera.'
  await toast.containText(message);  
});

test('não deve cadastrar com email incorreto', async ({ page }) => {

  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm('Fernando Lead', 'email.invalido.com');

  await landingPage.alertHaveText('Email incorreto');
});

test('não deve cadastrar sem informar o nome', async ({ page }) => {

  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm('', 'email@gmail.com');

  await landingPage.alertHaveText('Campo obrigatório');  
});

test('não deve cadastrar quando o email não é preenchido', async ({ page }) => {

  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm('Fernando Lead', '');

  await landingPage.alertHaveText('Campo obrigatório'); 
});

test('não deve cadastrar quando nenhum campo é preenchido', async ({ page }) => {

  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm('', '');
  await landingPage.alertHaveText([
    'Campo obrigatório',
    'Campo obrigatório'
  ])
})



