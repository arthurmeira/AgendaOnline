document.addEventListener("DOMContentLoaded", async () => {
    try {
        const resposta = await fetch('http://localhost:8080/api/agendamentos');
        
        if (!resposta.ok) {
            throw new Error('Erro na requisição');
        }

        const usuarios = await resposta.json();
        
        // Verifique o que está sendo retornado pela API
        console.log(usuarios);  // Adicione essa linha para verificar a estrutura da resposta

        const tabelaBody = document.getElementById("agendamento-tbody");
        tabelaBody.innerHTML = '';

        // Adicionar os dados na tabela
        usuarios.forEach(usuario => {
            const linha = document.createElement("tr");
            
            // Verifique as propriedades de cada usuário antes de acessar
            console.log(usuario);  // Adicione um log para verificar cada objeto de usuário

            // Garanta que as propriedades existam antes de usá-las
            const profissional = usuario.cod_profissional || 'N/A'; // Fallback se o campo não existir
            const aluno = usuario.cod_aluno || 'N/A'; // Fallback se o campo não existir

            linha.innerHTML = `
                <td>${usuario.id}</td>
                <td>${new Date(usuario.dia).toLocaleDateString()}</td>
                <td>${usuario.horario_inicio}</td>
                <td>${usuario.horario_fim}</td>
                <td>${profissional}</td>
                <td>${aluno}</td>
                <td style="text-align: center;">
                    <a href="#"><img width="32px" src="/APAE/images/visualizar.png" alt="Visualizar"></a>
                    <a href="#"><img width="32px" src="/APAE/images/editar.png" alt="Editar"></a>
                    <a href="#" class="delete" data-id="${usuario.id}">
                        <img width="32px" src="/APAE/images/excluir.png" alt="Excluir">
                    </a>
                </td>  
            `;
            tabelaBody.appendChild(linha);
        });

        // Adiciona evento de clique para excluir
        const deleteButtons = document.querySelectorAll('.delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                event.preventDefault();
                const agendamentoId = button.getAttribute('data-id');
                
                // Pergunta ao usuário se ele tem certeza de que deseja excluir
                const confirmacao = confirm('Tem certeza que deseja excluir este agendamento?');
                if (confirmacao) {
                    try {
                        const resposta = await fetch(`http://localhost:8080/api/agendamentos/${agendamentoId}`, {
                            method: 'DELETE'
                        });

                        if (resposta.ok) {
                            // Remove a linha da tabela
                            const linha = button.closest('tr');
                            linha.remove();
                            alert('Agendamento excluído com sucesso!');
                        } else {
                            throw new Error('Erro ao excluir o agendamento');
                        }
                    } catch (err) {
                        console.error('Erro ao excluir o agendamento:', err);
                        alert('Erro ao excluir o agendamento');
                    }
                } else {
                    alert('Exclusão cancelada.');
                }
            });
        });

    } catch (err) {
        console.error('Erro ao buscar ou renderizar dados:', err);
    }
});
