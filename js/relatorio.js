document.addEventListener("DOMContentLoaded", function() {
    generateReport();

    // Event listeners para filtros
    document.getElementById("filter-week").addEventListener("click", () => filterByPeriod("week"));
    document.getElementById("filter-month").addEventListener("click", () => filterByPeriod("month"));
});

function generateReport() {
    const registros = JSON.parse(localStorage.getItem("register")) || [];
    const ausencias = JSON.parse(localStorage.getItem("absences")) || [];
    const reportContainer = document.getElementById("report-container");

    // Ordena registros por data e horário de forma decrescente
    registros.sort((a, b) => {
        const dateA = new Date(a.date.split("/").reverse().join("-") + " " + a.time);
        const dateB = new Date(b.date.split("/").reverse().join("-") + " " + b.time);
        return dateB - dateA;
    });

    reportContainer.innerHTML = "<h2>Relatório de Registros</h2>";

    // Agrupar registros por data
    const registrosPorData = registros.reduce((acc, registro) => {
        if (!acc[registro.date]) {
            acc[registro.date] = [];
        }
        acc[registro.date].push(registro);
        return acc;
    }, {});

    // Exibir registros agrupados por data
    for (const [data, registrosData] of Object.entries(registrosPorData)) {
        const dataEl = document.createElement("h3");
        dataEl.textContent = data;
        reportContainer.appendChild(dataEl);

        registrosData.forEach((registro, originalIndex) => {
            const registroEl = document.createElement("div");

            // Inclui a localização no relatório, se disponível
            const locationText = registro.location
                ? ` <p>Localização: Latitude ${registro.location.latitude}, Longitude ${registro.location.longitude}</p>`
                : " <p>Localização: Não disponível</p>";

            registroEl.innerHTML = `<p><strong>TIPO: ${registro.type}</strong></p> <p>${registro.date} | ${registro.time}</p>${locationText}`;

            // Marca visualmente registros com observação, edição ou data passada
            if (registro.observacao) {
                registroEl.innerHTML += ` Observação: ${registro.observacao}`;
                registroEl.classList.add("observacao");
            }
            if (registro.editado) {
                registroEl.innerHTML += ` *Editado`;
                registroEl.classList.add("editado");
            }
            if (registro.isPast) {
                registroEl.innerHTML += ` -> Past-date`;
                registroEl.classList.add("past-date");
            }

            registroEl.innerHTML += `
                <button onclick="openEditDialog(${originalIndex})">Editar</button> 
                <button onclick="deleteRegister()">Excluir</button>`;
            reportContainer.appendChild(registroEl);
        });
    }

    reportContainer.innerHTML += "<h2>Registros de Ausências</h2>";
    ausencias.forEach((ausencia) => {
        const ausenciaEl = document.createElement("div");
        ausenciaEl.innerHTML = `<p><strong>DATA: ${ausencia.dataAusencia.split("-").reverse().join("/")}</strong></p><strong>Justificativa: </strong>${ausencia.justificativaTexto} <p>Arquivo: ${ausencia.arquivoNome || 'Nenhum'}</p>`;
        reportContainer.appendChild(ausenciaEl);
    });
}

function filterByPeriod(period) {
    const registros = JSON.parse(localStorage.getItem("register")) || [];
    const ausencias = JSON.parse(localStorage.getItem("absences")) || [];
    const reportContainer = document.getElementById("report-container");

    let filteredRegistros, filteredAusencias;
    const today = new Date();

    if (period === "week") {
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);

        filteredRegistros = registros.map((registro, index) => ({
            ...registro,
            originalIndex: index
        })).filter(registro => {
            const registroDate = new Date(registro.date.split("/").reverse().join("-"));
            return registroDate >= lastWeek;
        });

        filteredAusencias = ausencias.filter(ausencia => {
            const ausenciaDate = new Date(ausencia.dataAusencia.split("/").reverse().join("-"));
            return ausenciaDate >= lastWeek;
        });
    } else if (period === "month") {
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);

        filteredRegistros = registros.map((registro, index) => ({
            ...registro,
            originalIndex: index
        })).filter(registro => {
            const registroDate = new Date(registro.date.split("/").reverse().join("-"));
            return registroDate >= lastMonth;
        });

        filteredAusencias = ausencias.filter(ausencia => {
            const ausenciaDate = new Date(ausencia.dataAusencia.split("/").reverse().join("-"));
            return ausenciaDate >= lastMonth;
        });
    }

    filteredRegistros.sort((a, b) => {
        const dateA = new Date(a.date.split("/").reverse().join("-") + " " + a.time);
        const dateB = new Date(b.date.split("/").reverse().join("-") + " " + b.time);
        return dateB - dateA;
    });

    reportContainer.innerHTML = `<h2>Relatório de Registros (${period === "week" ? "Última Semana" : "Último Mês"})</h2>`;

    // Agrupar registros filtrados por data
    const registrosPorData = filteredRegistros.reduce((acc, registro) => {
        if (!acc[registro.date]) {
            acc[registro.date] = [];
        }
        acc[registro.date].push(registro);
        return acc;
    }, {});

    for (const [data, registrosData] of Object.entries(registrosPorData)) {
        const dataEl = document.createElement("h3");
        dataEl.textContent = data;
        reportContainer.appendChild(dataEl);

        registrosData.forEach((registro) => {
            const registroEl = document.createElement("div");

            const locationText = registro.location
                ? ` <p>Localização: Latitude ${registro.location.latitude}, Longitude ${registro.location.longitude}</p>`
                : " <p>Localização: Não disponível</p>";

            registroEl.innerHTML = `<p><strong>TIPO: ${registro.type}</strong></p> <p>${registro.date} | ${registro.time}</p>${locationText}`;

            if (registro.observacao) {
                registroEl.innerHTML += ` Observação: ${registro.observacao}`;
                registroEl.classList.add("observacao");
            }

            if (registro.editado) {
                registroEl.innerHTML += ` *Editado`;
                registroEl.classList.add("editado");
            }
            if (registro.isPast) {
                registroEl.innerHTML += ` -> Past-date`;
                registroEl.classList.add("past-date");
            }

            registroEl.innerHTML += ` 
                <button onclick="openEditDialog(${registro.originalIndex})">Editar</button> 
                <button onclick="deleteRegister()">Excluir</button>`;

            reportContainer.appendChild(registroEl);
        });
    }

    reportContainer.innerHTML += "<h2>Registros de Ausências</h2>";
    filteredAusencias.forEach((ausencia) => {
        const ausenciaEl = document.createElement("div");
        ausenciaEl.innerHTML = `<p><strong>DATA: ${ausencia.dataAusencia.split("-").reverse().join("/")}</strong></p><strong>Justificativa: </strong>${ausencia.justificativaTexto} <p>Arquivo: ${ausencia.arquivoNome || 'Nenhum'}</p>`;
        reportContainer.appendChild(ausenciaEl);
    });
}

function deleteRegister() {
    alert("O ponto não pode ser excluído.");
}

function openEditDialog(index) {
    const registros = JSON.parse(localStorage.getItem("register")) || [];
    const registro = registros[index];

    document.getElementById("edit-register-type").value = registro.type;
    document.getElementById("edit-observacao").value = registro.observacao || "";
    document.getElementById("edit-index").value = index;

    document.getElementById("edit-dialog").showModal();
}

function saveEdit() {
    const registros = JSON.parse(localStorage.getItem("register")) || [];
    const index = document.getElementById("edit-index").value;

    const novoTipo = document.getElementById("edit-register-type").value;
    const novaObservacao = document.getElementById("edit-observacao").value;

    registros[index].type = novoTipo;
    registros[index].observacao = novaObservacao;
    registros[index].editado = true; 

    localStorage.setItem("register", JSON.stringify(registros));
    alert("Registro atualizado com sucesso!");

    document.getElementById("edit-dialog").close();
    generateReport();
}
