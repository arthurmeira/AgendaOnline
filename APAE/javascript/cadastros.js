document.getElementById('main-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const tipo = document.getElementById('tipo').value;
    let url, data;

    if (tipo === 'aluno') {
        // Coletar dados do formulário de aluno
        const nome = document.getElementById('aluno-nome').value.trim();
        const deficiencia = document.getElementById('aluno-deficiencia').value.trim();
        const data_nascimento = document.getElementById('aluno-data').value.trim();

        if (!nome || !deficiencia || !data_nascimento) {
            alert('Todos os campos de aluno devem ser preenchidos.');
            return;
        }

        data = { nome, deficiencia, data_nascimento };
        url = 'http://127.0.0.1:8080/api/alunos'; // Rota para alunos
    } else if (tipo === 'profissional') {
        // Coletar dados do formulário de profissional
        const nome = document.getElementById('profissional-nome').value.trim();
        const especialidade_id = parseInt(document.getElementById('profissional-especialidade').value, 10);
        const email = document.getElementById('profissional-email').value.trim();
        const numero = document.getElementById('profissional-numero').value.trim();

        if (!nome || isNaN(especialidade_id) || !email || !numero) {
            alert('Todos os campos de profissional devem ser preenchidos.');
            return;
        }

        // Validação simples do email (ajuste conforme necessário)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }

        // Validação do número (apenas números, 9 a 15 dígitos)
        const numeroRegex = /^\d{9,15}$/;
        if (!numeroRegex.test(numero)) {
            alert('Número de telefone inválido. Deve conter entre 9 e 15 dígitos.');
            return;
        }

        data = { nome, especialidade_id, email, numero };
        url = 'http://127.0.0.1:8080/api/profissionais'; // Rota para profissionais
    } else {
        alert('Selecione o tipo de usuário');
        return;
    }

    // Enviar dados para o backend usando fetch
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Cadastro realizado com sucesso!');
            document.getElementById('main-form').reset(); // Resetar o formulário
        } else {
            const errorResponse = await response.json();
            alert(`Erro ao cadastrar usuário: ${errorResponse.error || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Erro de rede:', error);
        alert('Erro ao conectar com o servidor');
    }
});
