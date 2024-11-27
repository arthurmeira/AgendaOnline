const express = require('express');
const pool = require('../db/db');
const router = express.Router();

// Get todos os profissionais
router.get('/profissionais', async (req, res) => {
    try {
        const query = 'SELECT * FROM profissional';
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error('Erro ao obter dados dos profissionais:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/profissionais', async (req, res) => {
    try {
        const { nome, especialidade_id, email, numero } = req.body;

        // Verificar se todos os campos obrigatórios foram preenchidos
        if (!nome || !especialidade_id || !email || !numero) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios (nome, especialidade_id, email, numero).' });
        }

        // Verificar se o especialidade_id está dentro das especialidades válidas (1 a 5)
        const especialidadesValidas = [1, 2, 3, 4, 5];
        if (!especialidadesValidas.includes(especialidade_id)) {
            return res.status(400).json({ error: 'A especialidade informada não é válida. Escolha uma das especialidades disponíveis.' });
        }

        // Query para inserir o novo profissional
        const query = `
            INSERT INTO profissional (nome, especialidade_id, email, numero)
            VALUES ($1, $2, $3, $4)
            RETURNING nome, especialidade_id, email, numero;
        `;
        
        const values = [nome, especialidade_id, email, numero];
        
        const result = await pool.query(query, values);
        
        // Retorna o profissional criado com sucesso
        res.status(201).json(result.rows[0]);
    } catch (error) {
        // Verificar se o erro é devido a violação de chave primária (ou outro erro de unicidade)
        if (error.code === '23505') {
            return res.status(409).json({ error: 'O profissional com esse e-mail ou número já existe.' });
        }

        // Verificar outros tipos de erro e retornar uma mensagem genérica
        console.error('Erro ao criar profissional:', error);
        res.status(500).json({ error: 'Erro ao criar profissional. Por favor, tente novamente.' });
    }
});

// Deletar um profissional
router.delete('/profissionais/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM profissional WHERE id = $1 RETURNING *;';
        const { rows } = await pool.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Profissional não encontrado' });
        }
        res.json({ message: 'Profissional deletado com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar profissional:', err);
        res.status(500).json({ error: 'Erro ao deletar profissional' });
    }
});

module.exports = router;
