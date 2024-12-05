document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Busca os agendamentos
        const resposta = await fetch('http://localhost:8080/api/agendamentos');
        const agendamentos = await resposta.json();

        // Busca dados de profissionais e alunos
        const respostaProfissionais = await fetch('http://localhost:8080/api/profissionais');
        const profissionais = await respostaProfissionais.json();
        const respostaAlunos = await fetch('http://localhost:8080/api/alunos');
        const alunos = await respostaAlunos.json();

        const tabelaBody = document.getElementById("agendamento-tbody");
        if (!tabelaBody) {
            console.error('Elemento com ID "agendamento-tbody" não encontrado no DOM!');
            return;
        }

        tabelaBody.innerHTML = ''; // Limpa qualquer conteúdo anterior

        // Adiciona os dados à tabela
        agendamentos.forEach(agendamento => {
            const profissional = profissionais.find(p => p.id === agendamento.cod_profissional);
            const aluno = alunos.find(a => a.id === agendamento.cod_aluno);

            const linha = document.createElement("tr");
            linha.setAttribute('data-id', agendamento.id); // Adiciona o atributo data-id para identificar a linha
            linha.innerHTML = `
                <td>${agendamento.id}</td>
                <td>${new Date(agendamento.dia).toLocaleDateString()}</td>
                <td>${agendamento.horario_inicio}</td>
                <td>${agendamento.horario_fim}</td>
                <td>${profissional ? profissional.nome : 'N/A'}</td>
                <td>${aluno ? aluno.nome : 'N/A'}</td>
                <td style="text-align: center;">
                    <a href="#" class="visualizar-agendamento" data-id="${agendamento.id}">
                        <img width="32px" src="/images/visualizar.png" alt="Visualizar">
                    </a>
                    <a href="#" class="editar-agendamento" data-id="${agendamento.id}">
                        <img width="32px" src="/images/editar.png" alt="Editar">
                    </a>
                    <a href="#" class="excluir-agendamento" data-id="${agendamento.id}">
                        <img width="32px" src="/images/excluir.png" alt="Excluir">
                    </a>
                </td>
            `;
            tabelaBody.appendChild(linha); // Adiciona a linha à tabela
        });

        // Função para visualizar agendamentos
        document.querySelectorAll('.visualizar-agendamento').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault(); // Impede o comportamento padrão do link
                const agendamentoId = link.getAttribute('data-id'); // Pega o ID do agendamento
                // Redireciona para a página de visualização com o ID na URL
                window.location.href = `/html/agendamentos/visualizarAg.html?id=${agendamentoId}`;
            });
        });

        // Função para excluir um agendamento
        document.querySelectorAll('.excluir-agendamento').forEach(link => {
            link.addEventListener('click', async (event) => {
                event.preventDefault();
                const agendamentoId = link.getAttribute('data-id');
                const confirmacao = confirm('Tem certeza que deseja excluir este agendamento?');

                if (confirmacao) {
                    try {
                        const respostaDelete = await fetch(`http://localhost:8080/api/agendamentos/${agendamentoId}`, {
                            method: 'DELETE',
                        });

                        const resultado = await respostaDelete.json();

                        if (respostaDelete.ok) {
                            alert('Agendamento excluído com sucesso!');
                            const linhaParaRemover = link.closest('tr');
                            linhaParaRemover.remove();
                        } else {
                            alert(`Erro: ${resultado.error}`);
                        }
                    } catch (err) {
                        console.error('Erro ao excluir agendamento:', err);
                        alert('Erro ao excluir agendamento');
                    }
                }
            });
        });

        // Função para editar um agendamento
        document.querySelectorAll('.editar-agendamento').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const linha = link.closest('tr');
                const agendamentoId = linha.getAttribute('data-id');
                window.location.href = `/html/agendamentos/editarAgendamentos.html?id=${agendamentoId}`;
            });
        });

        // Requisição para buscar os horários disponíveis para o formulário de agendamento
        const respostaHorarios = await fetch('http://localhost:8080/api/horarios'); // Chamada à API de horários
        const horarios = await respostaHorarios.json();

        const horarioInicioSelect = document.getElementById('horario-inicio2');
        const horaFimSelect = document.getElementById('hora-fim2');

        if (!horarioInicioSelect || !horaFimSelect) {
            console.error('Campos de horário não encontrados!');
            return;
        }

        // Limpar as opções anteriores
        horarioInicioSelect.innerHTML = '<option selected disabled>Selecione um horário...</option>';
        horaFimSelect.innerHTML = '<option selected disabled>Selecione um horário...</option>';

        // Adicionar os horários ao select de "horário início" e "hora fim"
        horarios.forEach(horario => {
            const optionInicio = document.createElement('option');
            optionInicio.value = horario;
            optionInicio.textContent = horario;
            horarioInicioSelect.appendChild(optionInicio);

            const optionFim = document.createElement('option');
            optionFim.value = horario;
            optionFim.textContent = horario;
            horaFimSelect.appendChild(optionFim);
        });

    } catch (err) {
        console.error('Erro ao buscar ou renderizar dados:', err);
    }
});