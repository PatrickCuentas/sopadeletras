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
    modal2.classList.add("hidden");
  });
}

function init() {
  // Manejo de modales
  manejarModales();
}

window.addEventListener("load", init);
