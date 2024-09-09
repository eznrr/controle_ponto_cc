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

const closeDialog = document.getElementById("btn-dialog-close");
closeDialog.addEventListener("click", () => {
    pontoDialog.close();
})

function register() {
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