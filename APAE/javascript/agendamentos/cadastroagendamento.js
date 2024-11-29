 // Função para carregar os alunos
 async function carregarAlunos() {
    try {
        const response = await fetch('http://localhost:8080/api/alunos');
        const alunos = await response.json();
        const alunoSelect = document.getElementById('aluno2');

        // Limpa as opções existentes
        alunoSelect.innerHTML = '<option selected disabled>Selecione um estudante...</option>';

        // Adiciona os alunos como opções
        alunos.forEach(aluno => {
            const option = document.createElement('option');
            option.value = aluno.id;
            option.textContent = aluno.nome;
            alunoSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar alunos:', error);
    }
}

// Função para carregar os profissionais
async function carregarProfissionais() {
    try {
        const response = await fetch('http://localhost:8080/api/profissionais');
        const profissionais = await response.json();
        const profissionalSelect = document.getElementById('profissional2');

        // Limpa as opções existentes
        profissionalSelect.innerHTML = '<option selected disabled>Selecione um profissional...</option>';

        // Adiciona os profissionais como opções
        profissionais.forEach(profissional => {
            const option = document.createElement('option');
            option.value = profissional.id;
            option.textContent = profissional.nome;
            profissionalSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar profissionais:', error);
    }
}

// Event listener para o formulário de agendamento
document.getElementById('agendamento-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Coletar dados dos campos
    const cod_aluno = document.getElementById('aluno2').value;
    const cod_profissional = document.getElementById('profissional2').value;
    const dia = document.getElementById('dia2').value;
    const horario_Inicio = document.getElementById('horario-inicio2').value;
    const horario_Fim = document.getElementById('hora-fim2').value;

    // Validação dos campos
    if (!cod_aluno || !cod_profissional || !dia || !horario_Inicio || !horario_Fim) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    // Objeto de agendamento
    const agendamento = { dia, horario_Inicio, horario_Fim, cod_profissional, cod_aluno };

    try {
        const response = await fetch('http://localhost:8080/api/agendamentos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(agendamento),
        });

        if (response.ok) {
            alert('Agendamento realizado com sucesso!');
            document.getElementById('agendamento-form').reset(); // Resetar o formulário
        } else {
            const errorResponse = await response.json();
            alert(`Erro ao agendar: ${errorResponse.error || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Erro de rede:', error);
        alert('Erro ao conectar com o servidor');
    }
});

// Carregar alunos e profissionais ao carregar a página
window.onload = function () {
    carregarAlunos();
    carregarProfissionais();
};