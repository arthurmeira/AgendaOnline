const express = require('express');
const pool = require('../db/db');
const router = express.Router();  // Aqui você define a variável 'router'

// Rota GET para retornar todos os agendamentos
router.get('/agendamentos', async (req, res) => {
    try {
        const query = `
            SELECT * FROM AGENDAMENTO;
        `;
        const { rows } = await pool.query(query);
        console.log('Agendamentos retornados:', rows); // Depuração

        res.json(rows);
    } catch (err) {
        console.error('Erro ao obter dados dos agendamentos:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota POST para criar um novo agendamento
router.post('/agendamentos', async (req, res) => {
    console.log('POST /agendamentos chamado com dados:', req.body);
    try {
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

// Rota GET para buscar um agendamento por ID
router.get('/agendamentos/:id', async (req, res) => {
    const agendamentoId = req.params.id;

    try {
        const query = 'SELECT * FROM agendamento WHERE id = $1';
        const { rows } = await pool.query(query, [agendamentoId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Agendamento não encontrado' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error('Erro ao buscar agendamento:', err);
        res.status(500).json({ error: 'Erro interno ao buscar agendamento' });
    }
});

// Rota DELETE para excluir um agendamento por ID
router.delete('/agendamentos/:id', async (req, res) => {
    const agendamentoId = req.params.id;

    try {
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

// Rota PUT para atualizar um agendamento por ID
router.put('/agendamentos/:id', async (req, res) => {
    const agendamentoId = req.params.id;
    const { dia, horario_inicio, horario_fim, cod_profissional, cod_aluno } = req.body;

    console.log('Dados recebidos para atualização:', req.body); // Verifica o conteúdo do corpo da requisição

    try {
        // Verificar se todos os campos obrigatórios foram preenchidos
        if (!cod_aluno || !cod_profissional || !dia || !horario_inicio || !horario_fim) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        // Verificar se o profissional e o aluno existem
        const checkProfissional = await pool.query('SELECT 1 FROM profissional WHERE id = $1', [cod_profissional]);
        const checkAluno = await pool.query('SELECT 1 FROM aluno WHERE id = $1', [cod_aluno]);

        console.log('Check Profissional:', checkProfissional.rowCount);
        console.log('Check Aluno:', checkAluno.rowCount);

        if (checkProfissional.rowCount === 0) {
            return res.status(400).json({ error: 'Profissional não encontrado.' });
        }

        if (checkAluno.rowCount === 0) {
            return res.status(400).json({ error: 'Aluno não encontrado.' });
        }

        // Verificar se o horário de término é maior que o horário de início
        if (horario_fim <= horario_inicio) {
            return res.status(400).json({ error: 'O horário de término deve ser maior que o horário de início.' });
        }

        // Definir a query SQL para atualizar o agendamento
        const updateQuery = `
            UPDATE agendamento
            SET dia = $1, horario_inicio = $2, horario_fim = $3, cod_profissional = $4, cod_aluno = $5
            WHERE id = $6
            RETURNING *;
        `;

        const values = [dia, horario_inicio, horario_fim, cod_profissional, cod_aluno, agendamentoId];

        console.log('Valores da query de atualização:', values); // Verifica os valores que estão sendo passados para a query

        // Executar a query no banco de dados
        const { rows } = await pool.query(updateQuery, values);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Agendamento não encontrado' });
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar agendamento:', err);
        res.status(500).json({ error: 'Erro ao atualizar agendamento' });
    }
});


module.exports = router;  // Exporta o router para ser utilizado no server.js
