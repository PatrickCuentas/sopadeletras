function iniciarCronometro() {
  cronometroInterval = setInterval(function () {
    tiempo++;
    document.getElementById("cronometro").textContent =
      "Tiempo: " + tiempo + " segundos";
  }, 1000);
  cronometroActivo = false;
}

function detenerCronometro() {
  clearInterval(cronometroInterval);
  cronometroActivo = true;
}

function complete() {
  // ...
  // Resto del código para resolver el juego
  // ...

  detenerCronometro();
  alert("¡Felicidades! Has resuelto el juego en " + tiempo + " segundos.");
}

function manejarModales() {
  const modal1 = document.getElementById("modal1");
  const modal2 = document.getElementById("modal2");
  const closeModal1 = document.getElementById("closeModal1");
  const closeModal2 = document.getElementById("closeModal2");
  const btnEnd = document.getElementById("end");

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

  btnEnd.addEventListener("click", complete);
}

function init() {
  // Manejo de modales
  manejarModales();
}

window.addEventListener("load", init);
