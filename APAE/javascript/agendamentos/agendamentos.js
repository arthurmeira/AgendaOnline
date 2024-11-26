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
                <td>${profissional}</td> <!-- Corrigido -->
                <td>${aluno}</td>
                <td style="text-align: center;">
                    <a href="#"><img width="32px" src="/images/visualizar.png" alt=""></a>
                    <a href="#"><img width="32px" src="/images/editar.png" alt=""></a>
                    <a href="#"><img width="32px" src="/images/excluir.png" alt=""></a>
                </td>  
            `;
            tabelaBody.appendChild(linha);
        });
    } catch (err) {
        console.error('Erro ao buscar ou renderizar dados:', err);
    }
});
