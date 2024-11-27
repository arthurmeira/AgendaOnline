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

        // Adicione os dados à tabela
        usuarios.forEach(usuario => {
            const linha = document.createElement("tr");
            linha.setAttribute('data-id', usuario.id); // Adiciona o atributo data-id para identificar a linha
            linha.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nome}</td>
                <td>${usuario.deficiencia}</td>
                <td>${new Date(usuario.data_nascimento).toLocaleDateString()}</td>
                <td style="text-align: center;">
                    <a href="#" class="visualizar"><img width="32px" src="/APAE/images/visualizar.png" alt=""></a>
                    <a href="#" class="editar-aluno"><img width="32px" src="/APAE/images/editar.png" alt=""></a>
                    <a href="#" class="excluir-aluno" data-id="${usuario.id}"><img width="32px" src="/APAE/images/excluir.png" alt=""></a>
                </td>                
            `;
            tabelaBody.appendChild(linha); // Adiciona a linha à tabela
        });

        // Adicionando a funcionalidade de exclusão apenas para alunos
        const excluirLinks = document.querySelectorAll('.excluir-aluno'); // Seletor específico para alunos
        excluirLinks.forEach(link => {
            link.addEventListener('click', async (event) => {
                event.preventDefault(); // Impede o comportamento padrão do link
                const alunoId = link.getAttribute('data-id'); // Pega o ID do aluno
                
                // Confirmação antes de excluir
                const confirmacao = confirm('Tem certeza que deseja excluir este aluno?');
                
                if (confirmacao) {
                    try {
                        // Requisição DELETE para o back-end para excluir o aluno no banco de dados
                        const respostaDelete = await fetch(`http://localhost:8080/api/alunos/${alunoId}`, {
                            method: 'DELETE',
                        });

                        const resultado = await respostaDelete.json();

                        if (respostaDelete.ok) {
                            alert('Aluno excluído com sucesso!');
                            // Remover a linha da tabela localmente, após exclusão no banco
                            const linhaParaRemover = link.closest('tr'); // Encontra a linha correspondente ao aluno
                            linhaParaRemover.remove(); // Remove a linha da tabela
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

    document.querySelectorAll('.editar-aluno').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Impede o comportamento padrão do link
            const linha = link.closest('tr'); // Pega a linha correspondente ao aluno
            const alunoId = linha.getAttribute('data-id'); // Recupera o ID do aluno
    
            // Redireciona para a página de edição com o ID na URL
            window.location.href = `/APAE/html/edicaoAluno.html?id=${alunoId}`;
        });
    });
});