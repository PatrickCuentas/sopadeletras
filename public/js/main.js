var cronometroInterval;
var tiempo = 0;
var cronometroActivo = false;
var numeroColaborador = "";

function iniciarCronometro() {
  cronometroInterval = setInterval(function () {
    tiempo++;
    document.getElementById("cronometro").textContent =
      "Tiempo: " + formatTime(tiempo);
  }, 1000);
  cronometroActivo = false;
}

function detenerCronometro() {
  clearInterval(cronometroInterval);
  cronometroActivo = true;
}

function makeRequest(body) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(body);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("/new", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  return `${minutes}:${formattedSeconds} min`;
}

function complete() {
  // ...
  // Resto del código para resolver el juego
  // ...
  const Juego = "Sopa de letras";
  const Colaborador = numeroColaborador;
  const Tiempo = formatTime(tiempo);
  const body = { Juego, Colaborador, Tiempo };
  makeRequest(body);
  detenerCronometro();
  alert("¡Felicidades! Has resuelto el juego en " + tiempo + " segundos.");
}

function manejarModales() {
  const modal1 = document.getElementById("modal1");
  const modal2 = document.getElementById("modal2");
  const closeModal1 = document.getElementById("closeModal1");
  const closeModal2 = document.getElementById("closeModal2");

  closeModal1.addEventListener("click", function () {
    modal1.classList.add("hidden");
    modal2.classList.toggle("hidden");
  });

  closeModal2.addEventListener("click", function () {
    const numeroColaboradorInput = document.getElementById("numeroColaborador");
    if (!numeroColaboradorInput.value) {
      alert("Debes ingresar un número de colaborador");
      numeroColaboradorInput.focus();
      return;
    }
    numeroColaborador = numeroColaboradorInput.value;
    modal2.classList.add("hidden");
    iniciarCronometro();
  });
}

function init() {
  var items = document
    .getElementById("palabras-sopadeletras")
    .getElementsByTagName("ul")[0]
    .getElementsByTagName("li");

  var timer = setInterval(() => {
    var checkedItems = [...items].filter((item) =>
      item.classList.contains("palabraEncontrada")
    );
    if (checkedItems.length === items.length) {
      complete();
      clearInterval(timer);
    }
  }, 1000);

  // Manejo de modales
  manejarModales();
}

window.addEventListener("load", init);
