const express = require('express');
const pool = require('../db/db');
const router = express.Router();

// Get todos os alunos
router.get('/alunos', async (req, res) => {
    try {
        const query = 'SELECT * FROM aluno';
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error('Erro ao obter dados dos alunos:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/alunos', async (req, res) => {
    const { nome, deficiencia, data_nascimento } = req.body;

    if (!nome || !data_nascimento) {
        return res.status(400).json({ error: 'Nome e data de nascimento são obrigatórios' });
    }

    try {
        // Inserção sem enviar o id, pois ele será gerado automaticamente
        const query = `
            INSERT INTO aluno (nome, deficiencia, data_nascimento)
            VALUES ($1, $2, $3)
            RETURNING nome, deficiencia, data_nascimento;
        `;
        
        const values = [nome, deficiencia || null, data_nascimento];
        const result = await pool.query(query, values);
        
        res.status(201).json(result.rows[0]); // Retorna os dados inseridos, incluindo o id gerado
    } catch (error) {
        console.error('Erro ao criar aluno:', error);
        res.status(500).json({ error: 'Erro ao criar aluno' });
    }
});



// Deletar um aluno
router.delete('/alunos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM aluno WHERE id = $1 RETURNING *;';
        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Aluno não encontrado' });
        }

        res.json({ message: 'Aluno deletado com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar aluno:', err);
        res.status(500).json({ error: 'Erro ao deletar aluno' });
    }
});


router.get('/alunos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM aluno WHERE id = $1';
        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Aluno não encontrado' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error('Erro ao buscar aluno:', err);
        res.status(500).json({ error: 'Erro ao buscar aluno' });
    }
});


// Rota para atualizar aluno
router.put('/alunos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, deficiencia, data_nascimento } = req.body;

    try {
        const resultado = await pool.query(
            'UPDATE aluno SET nome = $1, deficiencia = $2, data_nascimento = $3 WHERE id = $4 RETURNING *',
            [nome, deficiencia, data_nascimento, id]
        );

        if (resultado.rowCount === 0) {
            return res.status(404).json({ message: 'Aluno não encontrado' });
        }

        res.json({ message: 'Aluno atualizado com sucesso', aluno: resultado.rows[0] });
    } catch (err) {
        console.error('Erro ao atualizar aluno:', err);
        res.status(500).json({ message: 'Erro ao atualizar aluno' });
    }
});

module.exports = router;
