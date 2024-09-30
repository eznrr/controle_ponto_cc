const diaSemana = document.getElementById("dia-semana");
const dataAtual = document.getElementById("data-atual");
const horaAtual = document.getElementById("hora-atual");
const openDialog = document.getElementById("btn-registrar-ponto");

openDialog.addEventListener("click", register);

diaSemana.textContent = getWeekDay();
dataAtual.textContent = getCurrentDate();

const pontoDialog = document.getElementById("dialog-ponto");

const dateDialog = document.getElementById("dialog-data");
dateDialog.textContent = getCurrentDate();

const hourDialog = document.getElementById("dialog-hora");
hourDialog.textContent = getCurrentTime();

const selectRegisterType = document.getElementById("register-type");

function setRegisterType() {
    let lastType = localStorage.getItem("lastRegisterType");
    if(lastType == "entrada") {
        selectRegisterType.value = "intervalo";
        return;
    }
    if(lastType == "intervalo") {

    }
    if(lastType == "volta-intervalo") {
        
    }
    if(lastType == "saida") {
    
    }
}

const btnDialogRegister = document.getElementById("btn-selecionar-ponto");
btnDialogRegister.addEventListener("click", () => {

    let register = getObjectRegister(selectRegisterType.value);
    saveRegisterLocalStorage(register);
    
    localStorage.setItem("lastRegister", JSON.stringify(register));

    const alertaSucesso = document.getElementById("alerta-ponto-registrado");
    alertaSucesso.classList.remove("hidden");
    alertaSucesso.classList.add("show");

    setTimeout(() => {
        alertaSucesso.classList.remove("show");
        alertaSucesso.classList.add("hidden");
    }, 5000);

    pontoDialog.close();
});

function getObjectRegister(registerType) {
    
    ponto = {
        "date": getCurrentDate(),
        "time": getCurrentTime(),
        "location": getUserLocation(),
        "id": 1,
        "type": registerType
    }
    return ponto;
}

const closeDialog = document.getElementById("btn-dialog-close");
closeDialog.addEventListener("click", () => {
    pontoDialog.close();
})

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
    navigator.geolocation.getCurrentPosition((position) => {   
        let userLocation = {
            "lat": position.coords.latitude,
            "long": position.coords.longitude
        }
        return userLocation;
    });
}

function register() {
    const dialogUltimoRegistro = document.getElementById("dialog-ultimo-registro");
    let lastRegister = JSON.parse(localStorage.getItem("lastRegister"));

    if(lastRegister) {
        let lastDateRegister = lastRegister.date;
        let lastTimeRegister = lastRegister.time;
        let lastRegisterType = lastRegister.type;

        dialogUltimoRegistro.textContent = "Último Registro: " + lastDateRegister + " | " + lastTimeRegister + " | " + lastRegisterType;
    }

    pontoDialog.showModal();
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
    const date = new Date()
    const day = date.getDay()
    const daynames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    return daynames[day]
}

updateContentHour();
setInterval(updateContentHour, 1000);

console.log(getCurrentTime());
console.log(getCurrentDate());
console.log(getWeekDay());