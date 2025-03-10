const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Dados de exemplo, substitua pelo que for necessário
const clientes = [
  {
    id: 1,
    cpf: "123.456.789-00",
    nome: "João Silva",
    email: "joao@email.com",
    celular: "11999999999",
    telefone: "1133333333",
    aniversario: "01/01/1980",
    cep: "12345-678",
    endereco: "Rua Exemplo",
    numero: "123",
    complemento: "Apt 1",
    cidade: "São Paulo",
    uf: "SP",
    bairro: "Centro",
  },
  // Adicione mais clientes aqui
];

app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

// Nova rota para /tabela
app.get("/tabela", (req, res) => {
  res.json(clientes);
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
