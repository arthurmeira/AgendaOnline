const { Pool } = require('pg');

// Configuração do banco de dados
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'agenda_online',
    password: 'M4r4cuj4',
    port: 5432, // Porta padrão do PostgreSQL
});

// Testar a conexão
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.stack);
    } else {
        console.log('Conexão bem-sucedida ao banco de dados:', res.rows[0]);
    }
});

module.exports = pool; // Exporta a conexão do banco
