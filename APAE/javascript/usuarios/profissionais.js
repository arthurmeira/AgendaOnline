document.addEventListener("DOMContentLoaded", async () => {
    try {
        const resposta = await fetch('http://localhost:8080/api/profissionais'); // Chamada à API de profissionais
        const profissionais = await resposta.json();
        
        // Mapeamento de especialidades
        const especialidades = {
            1: "Cardiologia",
            2: "Ortopedia",
            3: "Neurologia",
            4: "Dermatologia",
            5: "Pediatria"
        };

        // Verifique se o tbody está correto
        const tabelaBody = document.getElementById("profissional-tbody");
        if (!tabelaBody) {
            console.error('Elemento com ID "profissional-tbody" não encontrado no DOM!');
            return;
        }

        tabelaBody.innerHTML = ''; // Limpa qualquer conteúdo anterior

        // Adicione os dados à tabela
        profissionais.forEach(profissional => {
            const linha = document.createElement("tr");

            // Substituir o código da especialidade pelo nome
            const nomeEspecialidade = especialidades[profissional.especialidade_id] || "Desconhecida";

            linha.innerHTML = `
                <td>${profissional.id}</td>
                <td>${profissional.nome}</td>
                <td>${nomeEspecialidade}</td>
                <td>${profissional.email}</td>
                <td>${profissional.numero}</td>
                <td style="text-align: center;">
                    <a href="#"><img width="32px" src="/images/visualizar.png" alt=""></a>
                    <a href="#"><img width="32px" src="/images/editar.png" alt=""></a>
                    <a href="#"><img width="32px" src="/images/excluir.png" alt=""></a>
                </td>  
            `;
            tabelaBody.appendChild(linha); // Adiciona a linha à tabela
        });
    } catch (err) {
        console.error('Erro ao buscar ou renderizar dados (Profissionais):', err);
    }
});