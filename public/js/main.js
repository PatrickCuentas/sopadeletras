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
    numeroIntentos = 0,
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

  function reiniciarVariablesGlobales() {
    palabra_secreta = "";
    letras_probadas = [];
    aciertos = 0;
    fallos = 0;
    time = 0;
  }

  function inicializar() {
    $("button").prop("disabled", false);
    reiniciarVariablesGlobales();
    palabra_secreta = palabras[Math.floor(Math.random() * palabras.length)];

    $("#imagen_ahorcado")
      .attr("src", `img/stick_game/fallo0.png`)
      .addClass("sm:w-[70%]");

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
        // "p-[6px] h-[30px] m-[3px] sm:p-3 sm:m-2 bg-[#fff] text-black rounded-md text-sm text-center sm:text-2xl sm:h-auto"
        "w-[25px] h-[25px] md:w-[35px] md:h-[35px] text-sm md:text-md bg-[#fff] flex justify-center items-center text-black rounded-md"
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

  function countLetter(word, letter) {
    let count = 0;
    for (let i in word) {
      if (word[i] === letter) {
        count++;
      }
    }
    return count;
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
        if (countLetter(palabra_secreta, palabra_secreta.charAt(i)) === 1) {
          $(".boton-probar").each(function () {
            let letra = $(this).text().trim().toUpperCase();
            if (letra === palabra_secreta.charAt(i)) {
              aciertos++;
              $(this).attr("disabled", true);
            }
          });
        }
        escribirSpan(i, palabra_secreta.charAt(i));
      }
    }
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

  function incluirLetra(letra) {
    for (let i = 0; i < palabra_secreta.length; i++) {
      if (palabra_secreta.charAt(i) == letra) {
        aciertos++;
        escribirSpan(i, letra);
        letras_probadas += letra;
      }
    }

    let sinEspacios = palabra_secreta.replace(new RegExp(" ", "g"), "");

    if (aciertos == sinEspacios.length) {
      gane();
    }
  }

  function incluirFallo(letra) {
    fallos++;

    letras_probadas += letra;

    if (fallos == 7) {
      perdida();
    } else {
      $("#imagen_ahorcado").attr("src", `/img/stick_game/fallo${fallos}.png`);
    }
  }

  function gane() {
    const Juego = "Ahorcado";
    const Colaborador = numeroColaborador;
    const Tiempo = formatTime(time);
    const body = { Juego, Colaborador, Tiempo };

    // $("#imagen_ahorcado").attr(
    //   "src",
    //   "http://drive.google.com/uc?export=view&id=1H1nrBllxQbpBf5SAGXlUJjagsYFYW-VS"
    // );
    makeRequest(body);
    stopTimer();
    $("#modal3").toggleClass("hidden");
    $("#title").text("¡Felicidades!");
    $("#content").html(
      '<p>Has resuelto el juego en <span id="tiempo-juego"></span>.</p>'
    );
    $("#tiempo-juego").text(Tiempo);
  }

  function perdida() {
    stopTimer();
    numeroIntentos++;
    $("#modal3").toggleClass("hidden");
    $("#title").text("¡Fallaste!");

    if (numeroIntentos === 1) {
      $("#content").html(
        `<p>Tienes una oportunidad más para encontrar la frase.</p>
     <div class="flex justify-center mt-2">
      <button id="btn-reintentar" class="bg-[#d41073] text-white text-sm md:text-md lg:text-lg p-2 md:p-3 rounded-[12px] min-w-[70px]">
        OK
      </button>
     </div>
    `
      );
      $("#btn-reintentar").on("click", function () {
        inicializar();
        startTimer();
        $("#modal3").toggleClass("hidden");
      });
    } else {
      $("#content").html(`
        <p>Suerte para la proxima.</p>
      `);
    }
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

    $("#keyboard").empty();

    // Loop through each row of the keyboard
    for (let row of keyboard) {
      // Create a new row element
      let $row = $("<section>").addClass(
        "flex gap-2 justify-start sm:justify-center flex-wrap my-1 sm:my-2 w-full sm:gap-4 "
      );

      // Loop through each key in the row
      for (let key of row) {
        // Create a new button element
        let $button = $("<button>")
          .addClass(
            `boton-probar p-2 sm:px-[1rem] sm:py-[.5rem] bg-[#fff] text-center font-bold rounded-md text-gray-600
            cursor-pointer disabled:bg-neutral-300 disabled:text-gray-700 
            disabled:cursor-not-allowed text-[14px] sm:text-[16px] font-bold flex-1 sm:flex-none`
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
      // $(document).keydown(function (event) {
      //   if (event.key.toUpperCase() === letra) {
      //     probarLetra($(this), letra);
      //   }
      // });
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

/* 
  !!cambios realizados

 *- cambio de la ruta de imagen nueva
 *- cambio en la condicion de ganar (por considerar)
 *- la imagen de fallo es la imagen del muñeco completo
 *- se mejoró los estilos del keyword*- ahora cuando se pierde se deshabilitan los botones


 ?? TODO
  *- imagen de ganar o perder
*/
