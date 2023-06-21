$(document).ready(function () {
  const palabraContainer = $("#words");
  const baseButtonStyles =
    "p-[6px] h-[30px] m-[3px] sm:p-3 sm:m-2 bg-[#fff] text-black rounded-md text-sm text-black text-center sm:text-2xl sm:h-auto";
  const palabras = [
    "INNOVACION",
    "WIFISON",
    "NAVEGACION",
    "TECNOLOGIAS",
    "AUTOMATIZAR",
    "EFICIENCIA",
    "INVESTIGACION Y DESARROLLO",
  ];
  let palabra_secreta,
    letras_probadas,
    intervalCrono,
    numeroColaborador,
    cantidad_pistas = 2,
    aciertos = 0,
    fallos = 0,
    time = 0;

  function makeRequest(body) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      redirect: "follow",
    };

    fetch("/new", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }

  const startTimer = () => {
    intervalCrono = setInterval(() => {
      time++;
      $("#timer").text(`Tiempo: ${formatTime(time)}`);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(intervalCrono);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const parseSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${parseSeconds} min`;
  };

  function inicializar() {
    palabra_secreta = palabras[Math.floor(Math.random() * palabras.length)];

    $("#imagen_ahorcado").removeClass("hidden");
    $("#imagen_ahorcado").attr("src", `img/fallo0.png`);
    insertarPalabra();
    generarTeclado();
    asignarEventosTeclado();
    insertarPistaPalabraSecreta();
  }

  function handleInit() {
    const modal1 = $("#modal1");
    const modal2 = $("#modal2");
    const modal4 = $("#modal4");
    const tituloModal4 = $("#titulo-modal4");
    const closeModal1 = $("#closeModal1");
    const closeModal2 = $("#closeModal2");
    const closeModal4 = $("#closeModal4");

    closeModal1.on("click", function () {
      modal1.addClass("hidden");
      modal2.toggleClass("hidden");
    });

    closeModal2.on("click", function () {
      const numeroColaboradorInput = $("#numeroColaborador");

      if (
        !numeroColaboradorInput.val() ||
        isNaN(numeroColaboradorInput.val())
      ) {
        modal4.toggleClass("hidden");
        tituloModal4.text("Ingrese un número de colaborador");
        numeroColaboradorInput.focus();
        return;
      }

      fetch(`/colaborador/${numeroColaboradorInput.val()}`).then((response) => {
        if (response.status === 303) {
          modal4.toggleClass("hidden");
          tituloModal4.text(
            `El colaborador #${numeroColaboradorInput.val()} ya resolvió el juego`
          );
          numeroColaboradorInput.val("");
          numeroColaboradorInput.focus();
          return;
        } else {
          numeroColaborador = numeroColaboradorInput.val();
          startTimer();
          modal2.addClass("hidden");
        }
      });
    });

    closeModal4.on("click", function () {
      modal4.toggleClass("hidden");
    });
  }

  function verificarLetra(letra) {
    if (palabra_secreta.indexOf(letra) != -1) {
      return true;
    } else {
      return false;
    }
  }

  function insertarPalabra() {
    let palabraRandon = palabra_secreta.split("");
    palabraContainer.html("");
    $.each(palabraRandon, function (index, letra) {
      let spanLetra = $("<div>").addClass(
        "p-[6px] h-[30px] m-[3px] sm:p-3 sm:m-2 bg-[#fff] text-black rounded-md text-sm text-center sm:text-2xl sm:h-auto"
      );
      if (letra === " ") {
        spanLetra = $("<br>");
        palabraContainer.addClass(
          "grid grid-cols-[repeat(13,minmax(0,1fr))] md:gap-2"
        );
      }
      palabraContainer.append(spanLetra);
    });
  }

  function insertarPistaPalabraSecreta() {
    // 1. Obtener las "letras" de la "palabra_secreta" en base a la cantidad
    const posiciones = new Set();
    while (posiciones.size < cantidad_pistas) {
      const randomIndex = Math.floor(Math.random() * palabra_secreta.length);
      posiciones.add(randomIndex);
    }

    // 2. Insertar las letras en el contenedor de la palabra oculta
    for (let i = 0; i < palabra_secreta.length; i++) {
      if (posiciones.has(i)) {
        escribirSpan(i, palabra_secreta.charAt(i));
      }
    }

    //TODO: 3. Validar si la letra descubierta es la unica para deshabilitar el boton de la letra
  }

  function escribirSpan(indice, letra) {
    let palabraRelevada = $("<div>").addClass(baseButtonStyles);
    palabraRelevada.text(`${letra}`);
    const palabraOcultaHijos = palabraContainer.children();

    for (let i = 0; i < palabraOcultaHijos.length; i++) {
      if (i == indice) {
        palabraOcultaHijos.eq(i).html(palabraRelevada.html());
      }
    }
  }

  function mostrarPalabra() {
    // let html = "";
    let nuevoDiv = $("<div>").addClass(baseButtonStyles);

    for (let i = 0; i < palabra_secreta.length; i++) {
      if (palabra_secreta.charAt(i) == " ") {
        nuevoDiv.text(`${palabra_secreta.charAt(i)}`);
        // html += `
        //           <span class='espacio'>${palabra_secreta.charAt(i)}</span>
        //       `;
      } else {
        nuevoDiv.text(`${palabra_secreta.charAt(i)}`);
        // html += `
        //           <span class='letra letra-${opcion}'>${palabra_secreta.charAt(i)}</span>
        //       `;
      }
    }

    $("#palabra").html(html);
  }

  function incluirLetra(letra) {
    for (let i = 0; i < palabra_secreta.length; i++) {
      if (palabra_secreta.charAt(i) == letra) {
        aciertos++;
        escribirSpan(i, letra);
        letras_probadas += letra;
      }
    }

    // palabra_secreta.replace(new RegExp(" ", "g"), "").length - cantidad_pistas
    if (aciertos == palabra_secreta.length - cantidad_pistas) {
      gane();
    }
  }

  function incluirFallo(letra) {
    fallos++;

    letras_probadas += letra;

    $("#imagen_ahorcado").attr("src", `/img/fallo${fallos}.png`);

    if (fallos == 7) {
      perdida();
    }
  }

  function gane() {
    const Juego = "Ahorcado";
    const Colaborador = numeroColaborador;
    const Tiempo = formatTime(time);
    const body = { Juego, Colaborador, time };

    $("#imagen_ahorcado").attr(
      "src",
      "http://drive.google.com/uc?export=view&id=1H1nrBllxQbpBf5SAGXlUJjagsYFYW-VS"
    );
    makeRequest(body);
    stopTimer();
    $("#modal3").toggleClass("hidden");
    $("#tiempo-juego").text(Tiempo);
    // mostrarPalabra("gane");
  }

  function perdida() {
    $("#imagen_ahorcado").attr(
      "src",
      "http://drive.google.com/uc?export=view&id=18uD0wry0bfxGaq8Qiqg3BiordCNYuGV7"
    );
    mostrarPalabra("perdida");
  }

  function desabilitarLetra(ref) {
    $(ref).attr("disabled", true);
  }

  function probarLetra(ref, letra) {
    if (verificarLetra(letra)) {
      incluirLetra(letra);
    } else {
      incluirFallo(letra);
    }

    desabilitarLetra(ref);
  }

  function generarTeclado() {
    const keyboard = [
      ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
      ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
      ["z", "x", "c", "v", "b", "n", "m"],
    ];

    // Loop through each row of the keyboard
    for (let row of keyboard) {
      // Create a new row element
      let $row = $("<section>").addClass("flex gap-4 justify-center flex-wrap");

      // Loop through each key in the row
      for (let key of row) {
        // Create a new button element
        let $button = $("<button>")
          .addClass(
            "boton-probar p-4 bg-[#fff] text-center font-bold rounded-md text-gray-600 cursor-pointer disabled:bg-gray-500 disabled:text-white disabled:cursor-not-allowed"
          )
          .text(key);

        // Add the button to the row
        $row.append($button);
      }

      // Add the row to the keyboard
      $("#keyboard").append($row);
    }
  }

  function asignarEventosTeclado() {
    $(".boton-probar").each(function () {
      let letra = $(this).text().trim().toUpperCase();
      $(document).keydown(function (event) {
        if (event.key.toUpperCase() === letra) {
          probarLetra($(this), letra);
        }
      });
      $(this).click(function () {
        probarLetra($(this), letra);
      });
    });
  }

  function main() {
    inicializar();
    handleInit();
  }

  main();
});
