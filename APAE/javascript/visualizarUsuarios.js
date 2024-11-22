document.addEventListener("DOMContentLoaded", async () => {
    try {
        const resposta = await fetch('http://localhost:8080/api/usuarios'); // Chamada à API
        const usuarios = await resposta.json();


        console.log('Dados retornados:', usuarios); // Depuração

        // Pegue o tbody da tabela
        const tabelaBody = document.getElementById("usuarios-tabela").getElementsByTagName("tbody")[0];
        tabelaBody.innerHTML = ''; // Limpa qualquer conteúdo anterior

        // Adicione os dados à tabela
        usuarios.forEach(usuario => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nome}</td>
                <td>${usuario.tipo}</td>
                <td>${usuario.especialidade || '-'}</td>
                <td>${usuario.deficiencia || '-'}</td>
                <td>${usuario.email || '-'}</td>
                <td>${usuario.numero || '-'}</td>
            `;
            linha.classList.add("visible"); // Adiciona a classe para exibir a linha
            tabela.appendChild(linha);
        });
        
    } catch (err) {
        console.error('Erro ao buscar ou renderizar dados:', err);
    }
});
