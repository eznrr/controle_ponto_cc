const diaSemana = document.getElementById("dia-semana");
diaSemana.textContent = getWeekDay();

const dataAtual = document.getElementById("data-atual");
dataAtual.textContent = getCurrentDate();

const horaAtual = document.getElementById("hora-atual");

const openDialog = document.getElementById("btn-registrar-ponto");
openDialog.addEventListener("click", register);

const closeDialog = document.getElementById("btn-dialog-close");
closeDialog.addEventListener("click", closeRegister);

const pontoDialog = document.getElementById("dialog-ponto");

const dateDialog = document.getElementById("dialog-data");
dateDialog.textContent = getCurrentDate();

const hourDialog = document.getElementById("dialog-hora");
hourDialog.textContent = getCurrentTime();

const selectRegisterType = document.getElementById("register-type");

function setRegisterType() {
    let lastType = localStorage.getItem("lastRegisterType");

    switch (lastType) {
        case "entrada":
            selectRegisterType.value = "intervalo";
            break;
        case "intervalo":
            selectRegisterType.value = "volta-intervalo";
            break;
        case "volta-intervalo":
            selectRegisterType.value = "saida";
            break;
        case "saida":
            selectRegisterType.value = "entrada";
            break;
        default:
            selectRegisterType.value = "entrada";
            break;
    }
}

const btnDialogRegister = document.getElementById("btn-selecionar-ponto");
btnDialogRegister.addEventListener("click", async () => {
    // Evitar registros duplicados em curto intervalo
    const lastRegister = JSON.parse(localStorage.getItem("lastRegister"));
    const currentTime = new Date();
    const lastTime = lastRegister ? new Date(`1970-01-01T${lastRegister.time}:00`) : null;

    if (lastRegister && lastRegister.type === selectRegisterType.value && lastTime) {
        const diffMinutes = Math.abs((currentTime - lastTime) / 60000);
        
        if (diffMinutes < 10) { // Bloqueia registro duplicado dentro de 10 minutos
            alert("Você já registrou um ponto deste tipo recentemente. Tente novamente mais tarde.");
            return;
        }
    }

    let register = await getObjectRegister(selectRegisterType.value);
    saveRegisterLocalStorage(register);

    localStorage.setItem("lastRegister", JSON.stringify(register));
    localStorage.setItem("lastRegisterType", selectRegisterType.value);

    const alertaSucesso = document.getElementById("alerta-ponto-registrado");
    alertaSucesso.classList.remove("hidden");
    alertaSucesso.classList.add("show");

    setTimeout(() => {
        alertaSucesso.classList.remove("show");
        alertaSucesso.classList.add("hidden");
    }, 5000);

    pontoDialog.close();
});


async function getObjectRegister(registerType) {
    const selectedDate = getSelectedDate();
    const isPastDate = selectedDate !== getCurrentDate();
    const observacao = document.getElementById("observacao") ? document.getElementById("observacao").value : "";
    const location = await getUserLocation();

    return {
        "date": selectedDate,
        "time": getCurrentTime(),
        "location": location || "Localizacao nao diponivel",
        "id": 1,
        "type": registerType,
        "isPast": isPastDate,
        "observacao": observacao || null,
        "editado": false
    };
}

let registersLocalStorage = getRegisterLocalStorage("register");
function saveRegisterLocalStorage(register) {
    registersLocalStorage.push(register);
    localStorage.setItem("register", JSON.stringify(registersLocalStorage));
}

function getRegisterLocalStorage(key) {
    let registers = localStorage.getItem(key);

    if(!registers) {
        return [];
    }

    return JSON.parse(registers);
}

function getUserLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            let userLocation = {
                "latitude": position.coords.latitude,
                "longitude": position.coords.longitude
            }
            resolve(userLocation);
        }, 
        (error) => {
            reject("Erro " + error);
        });
    });
}

let intervalId = null;
function register() {
    const dialogUltimoRegistro = document.getElementById("dialog-ultimo-registro");
    let lastRegister = JSON.parse(localStorage.getItem("lastRegister"));

    if (lastRegister) {
        let lastDateRegister = lastRegister.date;
        let lastTimeRegister = lastRegister.time;
        let lastRegisterType = lastRegister.type;

        dialogUltimoRegistro.textContent = "Último Registro: " + lastDateRegister + " | " + lastTimeRegister + " | " + lastRegisterType;
    }

    hourDialog.textContent = getCurrentTime();

    if (!intervalId) {
        intervalId = setInterval(() => {
            hourDialog.textContent = getCurrentTime();
        }, 1000);
    }

    console.log(intervalId);

    setRegisterType();
    pontoDialog.showModal();
}

function closeRegister() {
    if (intervalId) {
        clearInterval(intervalId); 
        intervalId = null; 
    }
    pontoDialog.close();
}

function updateContentHour() {
    horaAtual.textContent = getCurrentTime();
}

function getCurrentTime() {
    const date = new Date();
    return String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0') + ":" + String(date.getSeconds()).padStart(2, '0');
}

function getCurrentDate() {
    const date = new Date(); 
    let mes = date.getMonth() + 1;
    return String(date.getDate()).padStart(2, '0') + "/" + String(mes).padStart(2, '0') + "/" +  String(date.getFullYear()).padStart(2, '0');
}

function getWeekDay() {
    const date = new Date();
    const day = date.getDay();
    const daynames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    return daynames[day];
}

function setMaxDate() {
    const dateInput = document.getElementById("select-date");
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("max", today);
}
setMaxDate();

function getSelectedDate() {
    const dateInput = document.getElementById("select-date").value;
    if (dateInput) {
        const [year, month, day] = dateInput.split("-");
        return day + "/" + month + "/" + year;
    }
    return getCurrentDate();
}

const observacaoInput = document.createElement("textarea");
observacaoInput.id = "observacao";
observacaoInput.placeholder = "Adicione uma observação (opcional)";
observacaoInput.rows = 2;
document.querySelector(".dialog-infos").appendChild(observacaoInput);

observacaoInput.addEventListener("input", () => {
    observacaoInput.value = observacaoInput.value.replace(/<[^>]*>/g, ""); // Remove tags HTML
});

updateContentHour();
setInterval(updateContentHour, 1000);

console.log(getCurrentTime());
console.log(getCurrentDate());
console.log(getWeekDay());

const btnJustificarFalta = document.getElementById("btn-justificar-falta");
const dialogJustificarFalta = document.getElementById("dialog-justificar-falta");
const btnEnviarJustificativa = document.getElementById("btn-enviar-justificativa");
const btnCloseJustificar = document.getElementById("btn-close-justificar");

btnJustificarFalta.addEventListener("click", () => {
    dialogJustificarFalta.showModal();
});

btnCloseJustificar.addEventListener("click", () => {
    dialogJustificarFalta.close();
});

function saveAbsence(dataAusencia, justificativaTexto, arquivoNome) {
    const ausencias = JSON.parse(localStorage.getItem("absences")) || [];
    ausencias.push({ dataAusencia, justificativaTexto, arquivoNome });
    localStorage.setItem("absences", JSON.stringify(ausencias));
}

btnEnviarJustificativa.addEventListener("click", () => {
    const dataAusencia = document.getElementById("data-ausencia").value;
    const justificativaTexto = document.getElementById("justificativa-texto").value;
    const uploadArquivo = document.getElementById("upload-arquivo").files[0];

    if (dataAusencia && justificativaTexto) {
        const arquivoNome = uploadArquivo ? uploadArquivo.name : null;
        saveAbsence(dataAusencia, justificativaTexto, arquivoNome);
        alert("Justificativa enviada com sucesso!");
        dialogJustificarFalta.close();
    } else {
        alert("Por favor, preencha todos os campos obrigatórios.");
    }
});
