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
  const modal3 = document.getElementById("modal3");
  const tiempoJuegoModal3 = document.getElementById("tiempo-juego");
  const Juego = "Sopa de letras";
  const Colaborador = numeroColaborador;
  const Tiempo = formatTime(tiempo);
  const body = { Juego, Colaborador, Tiempo };
  makeRequest(body);
  detenerCronometro();
  modal3.classList.toggle("hidden");
  tiempoJuegoModal3.textContent = Tiempo;
}

function manejarModales() {
  const modal1 = document.getElementById("modal1");
  const modal2 = document.getElementById("modal2");
  const modal4 = document.getElementById("modal4");
  const tituloModal4 = document.getElementById("titulo-modal4");
  const closeModal1 = document.getElementById("closeModal1");
  const closeModal2 = document.getElementById("closeModal2");
  const closeModal4 = document.getElementById("closeModal4");

  closeModal1.addEventListener("click", function () {
    modal1.classList.add("hidden");
    modal2.classList.toggle("hidden");
  });

  closeModal2.addEventListener("click", function () {
    const numeroColaboradorInput = document.getElementById("numeroColaborador");

    if (!numeroColaboradorInput.value || isNaN(numeroColaboradorInput.value)) {
      modal4.classList.toggle("hidden");
      tituloModal4.textContent = "Ingrese un número de colaborador";
      numeroColaboradorInput.focus();
      return;
    }

    fetch(`/colaborador/${numeroColaboradorInput.value}`).then((response) => {
      if (response.status === 303) {
        modal4.classList.toggle("hidden");
        tituloModal4.textContent = `El colaborador #${numeroColaboradorInput.value} ya resolvió el juego`;
        numeroColaboradorInput.value = "";
        numeroColaboradorInput.focus();
        return;
      } else {
        numeroColaborador = numeroColaboradorInput.value;
        modal2.classList.add("hidden");
        iniciarCronometro();
      }
    });
  });

  closeModal4.addEventListener("click", function () {
    modal4.classList.toggle("hidden");
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
