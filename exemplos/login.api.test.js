// Exemplo PROPOSITALMENTE RUIM — usado na aula para o agente encontrar problemas.
const request = require('supertest');
const { expect } = require('chai');

const api = request('https://api.minhaloja.com.br');
let token;
let idUsuario;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

describe('Login', () => {
  it('teste 1', async () => {
    const res = await api
      .post('/login')
      .send({ email: 'admin@minhaloja.com.br', password: 'Admin@2024' });
    console.log(res.body);
    token = res.body.token;
    expect(res.status).to.equal(200);
  });

  it('teste 2', async () => {
    await sleep(3000);
    const res = await api.get('/usuarios/me').set('Authorization', 'Bearer ' + token);
    idUsuario = res.body.id;
    expect(res.body).to.exist;
  });

  it.only('atualiza usuario', async () => {
    try {
      const res = await api
        .put('/usuarios/' + idUsuario)
        .set('Authorization', 'Bearer ' + token)
        .send({ nome: 'Fulano ' + Math.random() });
      expect(res.status).to.not.equal(500);
    } catch (e) {
      console.log(e);
    }
  });

  it('teste 4', async () => {
    const res = await api.get('/usuarios/' + idUsuario).set('Authorization', 'Bearer ' + token);
    expect(res.body.criadoEm).to.equal(new Date().toISOString().slice(0, 10));
  });

  // it('login invalido', async () => {
  //   const res = await api.post('/login').send({ email: 'x', password: 'y' });
  //   expect(res.status).to.equal(401);
  // });
});
