const express = require('express');
const pool = require('../db/db');
const router = express.Router();

// Obter todos os profissionais
router.get('/profissionais', async (req, res) => {
    try {
        const query = 'SELECT * FROM profissional';
        const { rows } = await pool.query(query);
        res.status(200).json(rows);
    } catch (err) {
        console.error('Erro ao obter profissionais:', err);
        res.status(500).json({ error: 'Erro ao obter profissionais' });
    }
});

// Obter um profissional por ID
router.get('/profissionais/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM profissional WHERE id = $1';
        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Profissional não encontrado.' });
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Erro ao obter profissional:', err);
        res.status(500).json({ error: 'Erro ao obter profissional' });
    }
});

// Criar um novo profissional
router.post('/profissionais', async (req, res) => {
    try {
        const { nome, especialidade_id, email, numero } = req.body;

        if (!nome || !especialidade_id || !email || !numero) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        const query = `
            INSERT INTO profissional (nome, especialidade_id, email, numero)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [nome, especialidade_id, email, numero];
        const { rows } = await pool.query(query, values);
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error('Erro ao criar profissional:', err);
        res.status(500).json({ error: 'Erro ao criar profissional' });
    }
});

// Excluir um profissional
router.delete('/profissionais/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM profissional WHERE id = $1 RETURNING *;';
        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Profissional não encontrado.' });
        }

        res.status(200).json({ message: 'Profissional excluído com sucesso.' });
    } catch (err) {
        console.error('Erro ao excluir profissional:', err);
        res.status(500).json({ error: 'Erro ao excluir profissional' });
    }
});

module.exports = router;
