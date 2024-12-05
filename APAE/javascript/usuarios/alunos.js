document.addEventListener("DOMContentLoaded", async () => {
    try {
        const resposta = await fetch('http://localhost:8080/api/alunos'); // Chamada à API de alunos
        const usuarios = await resposta.json();
        
        // Verifique se o tbody está correto
        const tabelaBody = document.getElementById("aluno-tbody");
        if (!tabelaBody) {
            console.error('Elemento com ID "aluno-tbody" não encontrado no DOM!');
            return;
        }

        tabelaBody.innerHTML = ''; // Limpa qualquer conteúdo anterior

        // Adiciona os dados à tabela
        usuarios.forEach(usuario => {
            const linha = document.createElement("tr");
            linha.setAttribute('data-id', usuario.id); // Adiciona o atributo data-id para identificar a linha
            linha.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nome}</td>
                <td>${usuario.deficiencia}</td>
                <td>${new Date(usuario.data_nascimento).toLocaleDateString()}</td>
                <td style="text-align: center;">
                    <a href="#" class="visualizar-aluno" data-id="${usuario.id}"><img width="32px" src="/images/visualizar.png" alt=""></a>
                    <a href="#" class="editar-aluno" data-id="${usuario.id}"><img width="32px" src="/images/editar.png" alt=""></a>
                    <a href="#" class="excluir-aluno" data-id="${usuario.id}"><img width="32px" src="/images/excluir.png" alt=""></a>
                </td>                
            `;
            tabelaBody.appendChild(linha); // Adiciona a linha à tabela
        });

        // Função para visualizar um aluno específico
        const visualizarLinks = document.querySelectorAll('.visualizar-aluno');
        visualizarLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const alunoId = link.getAttribute('data-id');
                window.location.href = `/html/visualizarAluno.html?id=${alunoId}`;
            });
        });

        // Função para redirecionar para edição
        document.querySelectorAll('.editar-aluno').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const alunoId = link.getAttribute('data-id');
                // Redireciona para a página de edição com o ID na URL
                window.location.href = `/html/editarAluno.html?id=${alunoId}`;
            });
        });

        // Adicionando a funcionalidade de exclusão
        const excluirLinks = document.querySelectorAll('.excluir-aluno');
        excluirLinks.forEach(link => {
            link.addEventListener('click', async (event) => {
                event.preventDefault();
                const alunoId = link.getAttribute('data-id');
                const confirmacao = confirm('Tem certeza que deseja excluir este aluno?');
                
                if (confirmacao) {
                    try {
                        const respostaDelete = await fetch(`http://localhost:8080/api/alunos/${alunoId}`, {
                            method: 'DELETE',
                        });

                        const resultado = await respostaDelete.json();

                        if (respostaDelete.ok) {
                            alert('Aluno excluído com sucesso!');
                            const linhaParaRemover = link.closest('tr');
                            linhaParaRemover.remove();
                        } else {
                            alert(`Erro: ${resultado.error}`);
                        }
                    } catch (err) {
                        console.error('Erro ao excluir aluno:', err);
                        alert('Erro ao excluir aluno');
                    }
                }
            });
        });

    } catch (err) {
        console.error('Erro ao buscar ou renderizar dados:', err);
    }
});
