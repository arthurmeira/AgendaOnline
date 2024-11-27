document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM completamente carregado!");

    
    document.getElementById('tipo-visualizacao').addEventListener('change', exibirTabela);

    function exibirTabela() {
        const tipoSelect = document.getElementById('tipo-visualizacao').value;
        const alunoForm = document.getElementById('aluno-form');
        const profissionalForm = document.getElementById('profissional-form');

        // Exibe a tabela correspondente com base na escolha
        if (tipoSelect === 'aluno') {
            alunoForm.style.display = 'block';
            profissionalForm.style.display = 'none';
        } else if (tipoSelect === 'profissional') {
            profissionalForm.style.display = 'block';
            alunoForm.style.display = 'none';
        }
    }

    // Função para formatar a data
    function formatarData(data) {
        const novaData = new Date(data);
        const dia = novaData.getDate().toString().padStart(2, '0');
        const mes = (novaData.getMonth() + 1).toString().padStart(2, '0');
        const ano = novaData.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    // Requisição de usuários (alunos e profissionais)
    async function carregarUsuarios() {
        try {
            const resposta = await fetch('http://localhost:8080/api/usuarios');
            if (!resposta.ok) {
                throw new Error(`Erro na API. Status: ${resposta.status}`);
            }

            const usuarios = await resposta.json();
            console.log('Dados recebidos da API:', usuarios); // Verificando a resposta da API

            // Verifique se os dados retornados são válidos
            if (Array.isArray(usuarios) && usuarios.length > 0) {
                // Filtra os alunos
                const alunos = usuarios.filter(usuario => usuario.tipo === 'Aluno');
                const tabelaAlunoBody = document.getElementById("aluno-tbody");
                tabelaAlunoBody.innerHTML = ''; // Limpa a tabela antes de preenchê-la

                alunos.forEach(aluno => {
                    console.log('Adicionando aluno:', aluno); // Verificando os dados do aluno
                    const linha = document.createElement("tr");
                    linha.innerHTML = `
                        <td>${aluno.id}</td>
                        <td>${aluno.nome}</td>
                        <td>${aluno.deficiencia || '-'}</td>
                        <td>${formatarData(aluno.data_nascimento) || '-'}</td>
                        <td style="text-align: center;">
                            <a href="#"><img width="36px" src="/APAE/images/visao.png" alt="Ver"></a>
                            <a href="#"><img width="36px" src="/APAE/images/caneta.png" alt="Editar"></a>
                            <a href="#"><img width="36px" src="/APAE/images/excluir.png" alt="Excluir"></a>
                        </td>
                    `;
                    tabelaAlunoBody.appendChild(linha);
                });

                // Filtra os profissionais
                const profissionais = usuarios.filter(usuario => usuario.tipo === 'Profissional');
                const tabelaProfissionalBody = document.getElementById("profissional-tbody");
                tabelaProfissionalBody.innerHTML = ''; // Limpa a tabela antes de preenchê-la

                profissionais.forEach(profissional => {
                    console.log('Adicionando profissional:', profissional); // Verificando os dados do profissional
                    const linha = document.createElement("tr");
                    linha.innerHTML = `
                        <td>${profissional.id}</td>
                        <td>${profissional.nome}</td>
                        <td>${profissional.especialidade || '-'}</td>
                        <td>${profissional.email || '-'}</td>
                        <td>${profissional.numero || '-'}</td>

                    `;
                    tabelaProfissionalBody.appendChild(linha);
                });
            } else {
                console.error('Erro: A resposta da API não contém dados válidos.');
            }
        } catch (err) {
            console.error('Erro ao carregar os usuários:', err);
        }
    }

    console.log("Script carregado corretamente!");

    // Carregar os usuários quando a página for carregada
    carregarUsuarios();
});
