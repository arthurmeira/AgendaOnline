const express = require('express');
const pool = require('../db/db');
const router = express.Router();  // Aqui você define a variável 'router'

router.get('/agendamentos', async (req, res) => {
    try {
        const queryProfissionais = `
            SELECT * FROM AGENDAMENTO;
        `;

        const { rows } = await pool.query(queryProfissionais);
        console.log('Profissionais retornados:', rows); // Depuração

        res.json(rows);
    } catch (err) {
        console.error('Erro ao obter dados dos profissionais:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;  // Exporta o router para ser utilizado no server.js
