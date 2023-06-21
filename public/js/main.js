$(document).ready(function () {
    const palabraContainer = $("#words");
//   const palabraContainer = $("#words");
  const palabras = ["INNOVACION","WIFISON","NAVEGACION","TECNOLOGIAS","AUTOMATIZAR","EFICIENCIA","INVESTIGACION Y DESARROLLO"];
  let fallos,
    aciertos,
    palabra_secreta,
    letras_probadas,
    letras_fallidas,
    intervalCrono,
    numeroColaborador,
    time = 0;

  function makeRequest(body) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      redirect: "follow"
    };

    fetch("/new", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
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
          modal2.addClass("hidden");
          main();
          insertarPalabra();
        }
      });
    });

    closeModal4.on("click", function () {
      modal4.toggleClass("hidden");
    });
  }

  const startTimer = () => {
    intervalCrono = setInterval(() => {
      time++;
      document.getElementById("timer").textContent = `Tiempo: ${formatTime(
        time
      )}`;
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
    fallos = 0;
    aciertos = 0;
    palabra_secreta = "";
    letras_probadas = "";
    letras_fallidas = "";

    $("#imagen_ahorcado").removeClass("hidden")
    $("#imagen_ahorcado").attr(
      "src",
      "img/fallo0.png"
    );
    $("#palabra").html("");
    $("#letras_fallidas").html("");

    $("#palabra_secreta").val("");
    $("#probar_letra").val("");
    $("#adivinar").val("");

    $("#palabra_secreta").attr("disabled", false);
    $("#palabra_secreta").attr("type", "text");
    $("#boton_iniciar").attr("disabled", false);

    $("#probar_letra").attr("disabled", true);
    $("#boton_probar").attr("disabled", true);

    $("#adivinar").attr("disabled", true);
    $("#boton_adivinar").attr("disabled", true);

    $("#palabra_secreta").focus();
  }

  function cadenaPermitida(cadena) {
    let expresion = "";

    expresion = /^[a-zñ ]+$/;

    if (expresion.test(cadena)) {
      return true;
    } else {
      return false;
    }
  }

  function verificarLetraProbada(letra) {

    if (letras_probadas.indexOf(letra) != -1) {
      return true;
    } else {
      return false;
    }
  }

  function verificarLetra(letra) {
    if (palabra_secreta.indexOf(letra) != -1) {
      return true;
    } else {
      return false;
    }
  }

  function establecerEspacios() {
    let html = "";

    for (let i = 0; i < palabra_secreta.length; i++) {
      if (palabra_secreta.charAt(i) == " ") {
        html += `
              <span class='espacio'></span>
              `;
      } else {
        html += `
              <span class='letra'></span>
              `;
      }
    }

    $("#palabra").html(html);
  }

  function escribirSpan(indice, letra) {
    let nuevoDiv = $("<div>").addClass("p-[6px] h-[30px] m-[3px] sm:p-3 sm:m-2 bg-[#fff] text-black rounded-md text-sm text-black text-center sm:text-2xl sm:h-auto");
    nuevoDiv.text(`${letra}`);
    const hijos = palabraContainer.children();

    for (let i = 0; i < hijos.length; i++) {
        console.log(i)
      if (i == indice) {
        hijos.eq(i).html(nuevoDiv.html());
      }
    }
  }

  function mostrarPalabra() {
    let html = "";

    let nuevoDiv = $("<div>").addClass("p-[6px] h-[30px] m-[3px] sm:p-3 sm:m-2 bg-[#fff] text-black rounded-md text-sm text-center sm:text-2xl sm:h-auto");

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

    if (aciertos == palabra_secreta.replace(new RegExp(" ", "g"), "").length) {
      gane();
    }
  }

  function incluirFallo(letra) {
    fallos++;

    letras_probadas += letra;

    $("#imagen_ahorcado").attr(
    "src",
    `/img/fallo${fallos}.png`
    )

    if (fallos == 7) {
      perdida();
    }
  }

  function gane() {
    const Juego = "Ahorcado";
    const Colaborador = numeroColaborador;
    const Tiempo = formatTime(tiempo);
    const body = { Juego, Colaborador, Tiempo };

    $("#imagen_ahorcado").attr(
      "src",
      "http://drive.google.com/uc?export=view&id=1H1nrBllxQbpBf5SAGXlUJjagsYFYW-VS"
    );
    makeRequest(body);
    stopTimer();
    $("#modal3").toggleClass("hidden");
    $("#tiempo-juego").text(Tiempo);
    mostrarPalabra("gane");
  }

  function perdida() {
    $("#imagen_ahorcado").attr(
      "src",
      "http://drive.google.com/uc?export=view&id=18uD0wry0bfxGaq8Qiqg3BiordCNYuGV7"
    );
    mostrarPalabra("perdida");
  }

  function desabilitarLetra(ref)  {
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

  function finalizar() {
    location.reload();
  }

  function main() {
    inicializar();
    // startTimer();
    palabra_secreta = palabras[Math.floor(Math.random() * palabras.length)];
    // Eventos para probar letra
    $(".boton-probar").each(function() {
      let letra = $(this).text().trim().toUpperCase();
      $(document).keydown(function(event) {
        if (event.key.toUpperCase() === letra) {
          probarLetra($(this),letra);
        }
      });
      $(this).click(function() {
        probarLetra($(this),letra);
      });
    });

  }

  handleInit();

  /* FUNCION PALABRA RANDOM */
    // function insertarPalabra(){
    //     let palabraRandon = palabra_secreta.split("");
    //     palabraContainer.innerHTML = "";
    //     palabraRandon.forEach((letra) => {
    //         let spanLetra = document.createElement("div");
    //         spanLetra.className = "p-[6px] h-[30px] m-[3px] sm:p-3 sm:m-2 bg-[#fff] text-white rounded-md text-sm text-center sm:text-2xl sm:h-auto"; 
    //         if(letra === " "){
    //             spanLetra = document.createElement("br");
    //             palabraContainer.className = "grid grid-cols-[repeat(13,minmax(0,1fr))] md:gap-2 ";
    //         }   
    //         spanLetra.innerHTML = letra;
    //         palabraContainer.appendChild(spanLetra);
    //     })
    // }

    function insertarPalabra(){
      let palabraRandon = palabra_secreta.split("");
      palabraContainer.html("");
      $.each(palabraRandon, function(index, letra) {
          let spanLetra = $("<div>").addClass("p-[6px] h-[30px] m-[3px] sm:p-3 sm:m-2 bg-[#fff] text-black rounded-md text-sm text-center sm:text-2xl sm:h-auto");
          if(letra === " "){
              spanLetra = $("<br>");
              palabraContainer.addClass("grid grid-cols-[repeat(13,minmax(0,1fr))] md:gap-2");
          }   
          // spanLetra.html(letra);
          palabraContainer.append(spanLetra);
      });
  }
});
