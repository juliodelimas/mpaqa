// Exemplo BOM — Mocha + SuperTest + Chai, com helpers, dados isolados e cenários negativos.
const request = require('supertest');
const { expect } = require('chai');
const { obterTokenDeCliente } = require('./helpers/autenticacao');
const { criarProduto, removerProduto } = require('./helpers/produtos');
const dados = require('./fixtures/carrinho.json');

const api = request(process.env.BASE_URL);

describe('Carrinho de compras', () => {
  let token;
  let produto;

  beforeEach(async () => {
    token = await obterTokenDeCliente();
    produto = await criarProduto({ preco: dados.precoPadrao, estoque: 5 });
  });

  afterEach(async () => {
    await removerProduto(produto.id);
  });

  it('deve adicionar um produto ao carrinho e recalcular o total', async () => {
    const res = await api
      .post('/carrinho/itens')
      .set('Authorization', `Bearer ${token}`)
      .send({ produtoId: produto.id, quantidade: 2 });

    expect(res.status).to.equal(201);
    expect(res.body.itens).to.have.lengthOf(1);
    expect(res.body.itens[0]).to.include({ produtoId: produto.id, quantidade: 2 });
    expect(res.body.total).to.equal(dados.precoPadrao * 2);
  });

  it('deve retornar 422 quando a quantidade excede o estoque', async () => {
    const res = await api
      .post('/carrinho/itens')
      .set('Authorization', `Bearer ${token}`)
      .send({ produtoId: produto.id, quantidade: 6 });

    expect(res.status).to.equal(422);
    expect(res.body.mensagem).to.equal('Quantidade indisponível em estoque');
  });

  it('deve retornar 400 quando a quantidade é zero', async () => {
    const res = await api
      .post('/carrinho/itens')
      .set('Authorization', `Bearer ${token}`)
      .send({ produtoId: produto.id, quantidade: 0 });

    expect(res.status).to.equal(400);
    expect(res.body.mensagem).to.match(/quantidade/i);
  });

  it('deve retornar 401 quando não há token', async () => {
    const res = await api.post('/carrinho/itens').send({ produtoId: produto.id, quantidade: 1 });

    expect(res.status).to.equal(401);
  });
});
