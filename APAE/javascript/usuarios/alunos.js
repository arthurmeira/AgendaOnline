document.addEventListener("DOMContentLoaded", async () => {
    try {
        const resposta = await fetch('http://localhost:8080/api/alunos'); // Chamada à API
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
            linha.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nome}</td>
                <td>${usuario.deficiencia}</td>
                <td>${new Date(usuario.data_nascimento).toLocaleDateString()}</td>
                <td style="text-align: center;">
                    <a href="#"><img width="32px" src="/images/visualizar.png" alt=""></a>
                    <a href="#"><img width="32px" src="/images/editar.png" alt=""></a>
                    <a href="#"><img width="32px" src="/images/excluir.png" alt=""></a>
                </td>                
            `;
             tabelaBody.appendChild(linha); // Adiciona a linha à tabela
        });
    } catch (err) {
        console.error('Erro ao buscar ou renderizar dados:', err);
    }
});


