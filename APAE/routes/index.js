const express = require('express');
const router = express.Router();


// Definindo uma rota de exemplo
router.get('/', (req, res) => {
    res.send('Bem-vindo à API!');

});

// Exportando as rotas
module.exports = router;
