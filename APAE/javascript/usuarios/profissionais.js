document.addEventListener("DOMContentLoaded", async () => {
    try {
        const resposta = await fetch('http://localhost:8080/api/profissionais');
        const profissionais = await resposta.json();

        const especialidades = {
            1: "Cardiologia",
            2: "Ortopedia",
            3: "Neurologia",
            4: "Dermatologia",
            5: "Pediatria"
        };

        const tabelaBody = document.getElementById("profissional-tbody");
        if (!tabelaBody) {
            console.error('Elemento com ID "profissional-tbody" não encontrado!');
            return;
        }

        tabelaBody.innerHTML = ''; // Limpar tabela

        profissionais.forEach(profissional => {
            const linha = document.createElement("tr");
            const nomeEspecialidade = especialidades[profissional.especialidade_id] || "Desconhecida";

            linha.innerHTML = `
                <td>${profissional.id}</td>
                <td>${profissional.nome}</td>
                <td>${nomeEspecialidade}</td>
                <td>${profissional.email}</td>
                <td>${profissional.numero}</td>
                <td style="text-align: center;">
                    <a href="#" class="visualizar-profissional" data-id="${profissional.id}">
                        <img width="32px" src="/images/visualizar.png" alt="">
                    </a>
                    <a href="#" class="editar-profissional" data-id="${profissional.id}">
                        <img width="32px" src="/images/editar.png" alt="">
                    </a>
                    <a href="#" class="excluir" data-id="${profissional.id}">
                        <img width="32px" src="/images/excluir.png" alt="">
                    </a>
                </td>
            `;
            tabelaBody.appendChild(linha);
        });


        // Adicionar evento de exclusão
        const excluirLinks = document.querySelectorAll('.excluir');
        excluirLinks.forEach(link => {
            link.addEventListener('click', async (event) => {
                event.preventDefault(); // Impede o comportamento padrão do link
                
                const profissionalId = link.getAttribute('data-id');
                
                // Confirmar a exclusão
                const confirmacao = confirm('Tem certeza que deseja excluir este profissional?');
                
                if (confirmacao) {
                    try {
                        const respostaDelete = await fetch(`http://localhost:8080/api/profissionais/${profissionalId}`, {
                            method: 'DELETE'
                        });

                        const resultado = await respostaDelete.json();
                        
                        if (respostaDelete.ok) {
                            alert('Profissional excluído com sucesso!');
                            // Remover a linha da tabela localmente
                            link.closest('tr').remove(); // Remove a linha da tabela
                        } else {
                            alert(`Erro: ${resultado.error}`);
                        }
                    } catch (err) {
                        console.error('Erro ao excluir profissional:', err);
                        alert('Erro ao excluir profissional');
                    }
                }
            });
        });

        // Função para visualizar um profissional
        const visualizarLinks = document.querySelectorAll('.visualizar-profissional');
        visualizarLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const profissionalId = link.getAttribute('data-id');
                window.location.href = `/html/profissionais/visualizarProfissional.html?id=${profissionalId}`;
            });
        });


        // Evento para "Editar" profissional
        const editarLinks = document.querySelectorAll('.editar-profissional');
        editarLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const profissionalId = link.getAttribute('data-id');
                // Redirecionar para a página de edição
                window.location.href = `/html/profissionais/editarProfissionais.html?id=${profissionalId}`;
            });
        });
    } catch (err) {
        console.error('Erro ao buscar dados dos profissionais:', err);
    }
});
