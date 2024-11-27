const express = require('express');
const cors = require('cors');
const path = require('path');
const usuariosRoutes = require('../routes/usuariosRoutes'); // Defina corretamente o caminho
const profissionaisRoutes = require('../routes/profissionaisRoutes');
const agendamentosRoutes = require('../routes/agendamentosRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve arquivos estáticos
app.use('/css', express.static(path.join(__dirname, '..', 'css')));
app.use('/images', express.static(path.join(__dirname, '..', 'images')));
app.use('/html', express.static(path.join(__dirname, '..', 'html')));
app.use('/javascript', express.static(path.join(__dirname, '..', 'javascript')));

// Rotas para páginas HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'index.html'));
});

app.get('/visualizarUsuarios', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'visualizarUsuarios.html'));
});

// Rotas específicas de API
app.use('/api', usuariosRoutes); // Prefixo '/api' para rotas de usuários
app.use('/api', profissionaisRoutes); // Prefixo '/api' para rotas de profissionais
app.use('/api', agendamentosRoutes); // Prefixo '/api' para rotas de agendamentos

// Iniciando o servidor
app.listen(8080, () => {
    console.log('Servidor rodando na porta 8080');
});
