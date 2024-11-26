document.addEventListener("DOMContentLoaded", () => {
    const selectTipo = document.getElementById("tipo-visualizacao");
    const alunoForm = document.getElementById("aluno-form");
    const profissionalForm = document.getElementById("profissional-form");

    const pesquisaAluno = document.getElementById("pesquisa-aluno");
    const pesquisaProfissional = document.getElementById("pesquisa-profissional");

    selectTipo.addEventListener("change", () => {
        // Esconde ambas as tabelas
        alunoForm.style.display = "none";
        profissionalForm.style.display = "none";

        // Exibe a tabela correspondente
        if (selectTipo.value === "aluno") {
            alunoForm.style.display = "block";
        } else if (selectTipo.value === "profissional") {
            profissionalForm.style.display = "block";
        }
    });

    // Função para filtrar a tabela de Alunos
    pesquisaAluno.addEventListener("input", () => {
        filterTable("aluno-tbody", pesquisaAluno.value.toLowerCase());
    });

    // Função para filtrar a tabela de Profissionais
    pesquisaProfissional.addEventListener("input", () => {
        filterTable("profissional-tbody", pesquisaProfissional.value.toLowerCase());
    });

    // Função genérica para filtrar as tabelas
    function filterTable(tbodyId, query) {
        const tbody = document.getElementById(tbodyId);
        const rows = tbody.getElementsByTagName("tr");

        // Loop através das linhas da tabela
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName("td");
            let match = false;

            // Verificar cada célula da linha
            for (let j = 0; j < cells.length; j++) {
                const cellText = cells[j].textContent.toLowerCase();
                if (cellText.includes(query)) {
                    match = true; // Encontrou uma correspondência
                    break; // Não precisa verificar mais células dessa linha
                }
            }

            // Exibe ou oculta a linha dependendo da correspondência
            if (match) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
});
