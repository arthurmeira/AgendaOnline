const express = require('express');
const pool = require('../db/db');
const router = express.Router();  // Aqui você define a variável 'router'

router.get('/usuarios', async (req, res) => {
    try {
        const queryUsuarios = `
            SELECT * FROM ALUNO;
        `;

        const { rows } = await pool.query(queryUsuarios);
        console.log('Usuários retornados:', rows); // Depuração

        res.json(rows);
    } catch (err) {
        console.error('Erro ao obter dados dos usuários:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;  // Exporta o router para ser utilizado no server.js
