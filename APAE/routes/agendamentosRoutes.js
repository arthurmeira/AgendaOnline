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

router.post('/agendamentos', async (req, res) => {
    console.log('POST /agendamentos chamado com dados:', req.body);
    try {
        // Extrair os dados do corpo da requisição
        const { dia, horario_inicio, horario_fim, cod_profissional, cod_aluno } = req.body;
        console.log(req.body);  // Verificar o corpo da requisição

        // Verificar se todos os campos obrigatórios foram preenchidos
        if (!cod_aluno || !cod_profissional || !dia || !horario_inicio || !horario_fim) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        // Verificar se o profissional e o aluno existem
        const checkProfissional = await pool.query('SELECT 1 FROM profissional WHERE id = $1', [cod_profissional]);
        const checkAluno = await pool.query('SELECT 1 FROM aluno WHERE id = $1', [cod_aluno]);

        if (checkProfissional.rowCount === 0) {
            return res.status(400).json({ error: 'Profissional não encontrado.' });
        }

        if (checkAluno.rowCount === 0) {
            return res.status(400).json({ error: 'Aluno não encontrado.' });
        }

        // Definir a query SQL para inserir um novo agendamento
        const query = `
            INSERT INTO agendamento (dia, horario_inicio, horario_fim, cod_profissional, cod_aluno)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        
        // Passar os valores extraídos da requisição para a query
        const values = [dia, horario_inicio, horario_fim, cod_profissional, cod_aluno];

        // Executar a query no banco de dados
        const { rows } = await pool.query(query, values);

        // Retornar o agendamento criado com status 201 (Created)
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error('Erro ao criar agendamento:', err);
        res.status(500).json({ error: 'Erro ao criar agendamento' });
    }
});

router.get('/agendamentos/:id', async (req, res) => {
    const agendamentoId = req.params.id; // Obtém o ID do agendamento a partir da URL

    try {
        // Consulta para buscar o agendamento pelo ID
        const query = 'SELECT * FROM agendamento WHERE id = $1';
        const { rows } = await pool.query(query, [agendamentoId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Agendamento não encontrado' });
        }

        res.json(rows[0]); // Retorna o agendamento encontrado
    } catch (err) {
        console.error('Erro ao buscar agendamento:', err);
        res.status(500).json({ error: 'Erro interno ao buscar agendamento' });
    }
});


router.delete('/agendamentos/:id', async (req, res) => {
    const agendamentoId = req.params.id;  // Obtém o ID do agendamento da URL

    try {
        // Consulta para excluir o agendamento pelo ID
        const deleteQuery = 'DELETE FROM agendamento WHERE id = $1 RETURNING *';
        
        const { rows } = await pool.query(deleteQuery, [agendamentoId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Agendamento não encontrado' });
        }

        console.log(`Agendamento com ID ${agendamentoId} excluído com sucesso`);
        res.status(200).json({ message: 'Agendamento excluído com sucesso!' });
    } catch (err) {
        console.error('Erro ao excluir agendamento:', err);
        res.status(500).json({ error: 'Erro interno ao excluir o agendamento' });
    }
});

module.exports = router;  // Exporta o router para ser utilizado no server.js
