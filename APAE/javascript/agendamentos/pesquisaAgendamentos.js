document.addEventListener("DOMContentLoaded", () => {
    const campoPesquisa = document.getElementById("pesquisa");
    const tabelaBody = document.getElementById("agendamento-tbody");

    if (!campoPesquisa || !tabelaBody) {
        console.error('Campo de pesquisa ou tabela não encontrados!');
        return;
    }

    campoPesquisa.addEventListener("input", () => {
        const termoPesquisa = campoPesquisa.value.toLowerCase();

        // Itera sobre as linhas da tabela para aplicar o filtro
        Array.from(tabelaBody.children).forEach(linha => {
            const colunas = Array.from(linha.children);
            const [id, dia, horarioInicio, horarioFim, profissional, aluno] = colunas.map(coluna =>
                coluna.textContent.trim().toLowerCase()
            );

            // Aplica o filtro nos critérios informados
            const corresponde = id.includes(termoPesquisa) ||
                dia.includes(termoPesquisa) ||
                profissional.includes(termoPesquisa) ||
                aluno.includes(termoPesquisa);

            // Alterna a visibilidade da linha conforme o resultado do filtro
            linha.style.display = corresponde ? "" : "none";
        });
    });
});
