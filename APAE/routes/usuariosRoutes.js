const express = require('express');
const pool = require('../db/db');

const router = express.Router();

router.get('/usuarios', async (req, res) => {
    try {
        const queryUsuarios = `
            SELECT u.id, u.nome, 'Aluno' AS tipo, u.deficiencia, NULL AS email, NULL AS numero, NULL AS especialidade
            FROM aluno u
            UNION
            SELECT p.id, p.nome, 'Profissional' AS tipo, NULL AS deficiencia, p.email, p.numero, e.descricao AS especialidade
            FROM profissional p
            LEFT JOIN especialidade e ON p.especialidade_id = e.id;
        `;

        const { rows } = await pool.query(queryUsuarios);

        res.json(rows);
    } catch (err) {
        console.error('Erro ao obter dados dos usuários:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
