document.getElementById('main-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const tipo = document.getElementById('tipo').value;
    let url, data;
    
    if (tipo === 'aluno') {
        // Coletar dados do formulário de aluno
        data = {
            nome: document.getElementById('aluno-nome').value,
            deficiencia: document.getElementById('aluno-deficiencia').value,
            data_nascimento: document.getElementById('aluno-data').value,
        };
        url = 'http://127.0.0.1:8080/api/alunos'; // Rota para alunos
    } else if (tipo === 'profissional') {
        // Coletar dados do formulário de profissional
        data = {
            nome: document.getElementById('profissional-nome').value,
            especialidade_id: document.getElementById('profissional-especialidade').value,
            email: document.getElementById('profissional-email').value,
            numero: document.getElementById('profissional-numero').value,
        };
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
            alert('Erro ao cadastrar usuário');
        }
    } catch (error) {
        console.error('Erro de rede:', error);
        alert('Erro ao conectar com o servidor');
    }
});
