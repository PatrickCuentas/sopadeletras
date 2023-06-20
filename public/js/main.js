$(document).ready(function () {
    let fallos, aciertos, palabra_secreta, letras_probadas, letras_fallidas, intervalCrono, time = 0;

    const startTimer = () => {
        intervalCrono = setInterval(() => {
            time++;
            document.getElementById('timer').textContent = `Tiempo: ${formatTime(time)}`;
        }, 1000);
    }

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        const parseSeconds = seconds < 10 ? `0${seconds}` : seconds;
        return `${minutes}:${parseSeconds} min`;
    }

    startTimer();

  function inicializar() {
      fallos = 0;
      aciertos = 0;
      palabra_secreta = '';
      letras_probadas = '';
      letras_fallidas = '';

      $('#imagen_ahorcado').attr('src', 'http://drive.google.com/uc?export=view&id=123XEU0tV-JavXxVmk3wV42ygeW3tku1D');
      $('#palabra').html('');
      $('#letras_fallidas').html('');

      $('#palabra_secreta').val('');
      $('#probar_letra').val('');
      $('#adivinar').val('');

      $('#palabra_secreta').attr("disabled", false);
      $('#palabra_secreta').attr("type", "text");
      $('#boton_iniciar').attr("disabled", false);

      $('#probar_letra').attr("disabled", true);
      $('#boton_probar').attr("disabled", true);

      $('#adivinar').attr("disabled", true);
      $('#boton_adivinar').attr("disabled", true);

      $('#palabra_secreta').focus();
  }

  function cadenaPermitida(cadena) {
      let expresion = '';

      cadena = cadena.toLowerCase();
      expresion = /^[a-zñ ]+$/;

      if (expresion.test(cadena)) {
          return true;
      } else {
          return false;
      }
  }

  function verificarLetraProbada(letra) {
      letra = letra.toLowerCase();

      if (letras_probadas.indexOf(letra) != -1) {
          return true;
      } else {
          return false;
      }
  }

  function verificarLetra(letra) {
      letra = letra.toLowerCase();

      if (palabra_secreta.indexOf(letra) != -1) {
          return true;
      } else {
          return false;
      }
  }

  function establecerEspacios() {
      let html = '';

      for (let i = 0; i < palabra_secreta.length; i++) {
          if (palabra_secreta.charAt(i) == ' ') {
              html += `
              <span class='espacio'></span>
              `;
          } else {
              html += `
              <span class='letra'></span>
              `;
          }
      }

      $('#palabra').html(html);
  }

  function escribirSpan(indice, letra) {
      let lista_span = $('span');

      for (let i = 0; i < lista_span.length; i++) {
          if (i == indice) {
              lista_span[i].innerHTML = letra;
          }
      }
  }
  
  function mostrarPalabra(opcion) {
      let html = '';

      for (let i = 0; i < palabra_secreta.length; i++) {

          if (palabra_secreta.charAt(i) == ' ') {
              html += `
                  <span class='espacio'>${palabra_secreta.charAt(i)}</span>
              `;
          } else {
              html += `
                  <span class='letra letra-${opcion}'>${palabra_secreta.charAt(i)}</span>
              `;
          }
      }

      $('#palabra').html(html);
  }

  function incluirLetra(letra) {
      let numero_span = 0;

      letra = letra.toLowerCase();

      for (let i = 0; i < palabra_secreta.length; i++) {
          if (palabra_secreta.charAt(i) == letra) {
              aciertos++;
              escribirSpan(i, letra);
              letras_probadas += letra;
          }
      }

      if (aciertos == palabra_secreta.replace(new RegExp(' ', 'g'), '').length) {
          gane();
      }
  }

  function incluirFallo(letra) {
      let div_letras_fallidas = $('#letras_fallidas'),
          html = div_letras_fallidas.html();

      letra = letra.toLowerCase();

      fallos++;

      letras_fallidas += letra;
      letras_probadas += letra;

      if(fallos == 0){
          $('#imagen_ahorcado').attr('src', 'http://drive.google.com/uc?export=view&id=123XEU0tV-JavXxVmk3wV42ygeW3tku1D');
      }else if(fallos == 1){
          $('#imagen_ahorcado').attr('src', 'http://drive.google.com/uc?export=view&id=1vFdlLQjzaq5_qHzPu88rZfolqFXR1zRb');            
      }else if(fallos == 2){
          $('#imagen_ahorcado').attr('src', 'http://drive.google.com/uc?export=view&id=1aexncQCP2hBh-7xaJvvL6YDKycmwaqWm');
      }else if(fallos == 3){
          $('#imagen_ahorcado').attr('src', 'http://drive.google.com/uc?export=view&id=1hcwei7UOJLP1pzi38kA6LS1OOmkz5Nhw');
      }else if(fallos == 4){
          $('#imagen_ahorcado').attr('src', 'http://drive.google.com/uc?export=view&id=18uD0wry0bfxGaq8Qiqg3BiordCNYuGV7');
      }        

      if (html == '') {
          html = letra;
      } else {
          html += '-' + letra;
      }

      div_letras_fallidas.html(html);

      if (fallos == 4) {
          perdida();
      }
  }

  function gane() {
      $('#probar_letra').attr('disabled', true);
      $('#boton_probar').attr('disabled', true);

      $('#adivinar').attr('disabled', true);
      $('#boton_adivinar').attr('disabled', true);

      $('#imagen_ahorcado').attr('src', 'http://drive.google.com/uc?export=view&id=1H1nrBllxQbpBf5SAGXlUJjagsYFYW-VS');

      mostrarPalabra('gane');
  }

  function perdida() {
      $('#probar_letra').attr('disabled', true);
      $('#boton_probar').attr('disabled', true);

      $('#adivinar').attr('disabled', true);
      $('#boton_adivinar').attr('disabled', true);

      $('#imagen_ahorcado').attr('src', 'http://drive.google.com/uc?export=view&id=18uD0wry0bfxGaq8Qiqg3BiordCNYuGV7');
      mostrarPalabra('perdida');
  }

  function iniciar() {
      let input_palabra_secreta = $('#palabra_secreta');

      if (input_palabra_secreta.val().length > 0) {
          if (cadenaPermitida(input_palabra_secreta.val())) {
              palabra_secreta = input_palabra_secreta.val().toLowerCase();

              input_palabra_secreta.attr("disabled", true);
              input_palabra_secreta.attr("type", "password");
              $('#boton_iniciar').attr("disabled", true);

              $('#probar_letra').attr("disabled", false);
              $('#boton_probar').attr("disabled", false);

              $('#adivinar').attr("disabled", false);
              $('#boton_adivinar').attr("disabled", false);

              establecerEspacios();

              $('#probar_letra').focus();
          } else {
              $('#etiqueta_mensaje').html('Datos Incorrectos');
              $('#cuerpo_mensaje').html('La palabra debe contener caracteres de la A a la Z únicamente.');
              $('#mensaje').modal('show')

              $('#mensaje').on('hidden.bs.modal', function () {
                  input_palabra_secreta.val('');
                  input_palabra_secreta.focus();
              })
          }
      } else {
          $('#etiqueta_mensaje').html('Datos Incorrectos');
          $('#cuerpo_mensaje').html('Debe escribir la palabra secreta.');
          $('#mensaje').modal('show')

          $('#mensaje').on('hidden.bs.modal', function () {
              input_palabra_secreta.focus();
          })
      }
  }

  function probarLetra() {
      let input_probar_letra = $('#probar_letra');

      if (input_probar_letra.val() != ' ') {
          if (input_probar_letra.val().length > 0) {
              if (cadenaPermitida(input_probar_letra.val())) {
                  if (!verificarLetraProbada(input_probar_letra.val())) {
                      if (verificarLetra(input_probar_letra.val())) {
                          incluirLetra(input_probar_letra.val());
                      } else {
                          incluirFallo(input_probar_letra.val())
                      }

                      input_probar_letra.val('');
                      input_probar_letra.focus();
                  } else {
                      $('#etiqueta_mensaje').html('Datos Incorrectos');
                      $('#cuerpo_mensaje').html('La letra ya ha sido probada.');
                      $('#mensaje').modal('show')

                      $('#mensaje').on('hidden.bs.modal', function () {
                          input_probar_letra.val('');
                          input_probar_letra.focus();
                      })
                  }
              } else {
                  $('#etiqueta_mensaje').html('Datos Incorrectos');
                  $('#cuerpo_mensaje').html('Sólo se permiten caracteres de la A a la Z únicamente.');
                  $('#mensaje').modal('show')

                  $('#mensaje').on('hidden.bs.modal', function () {
                      input_probar_letra.val('');
                      input_probar_letra.focus();
                  })
              }
          } else {
              $('#etiqueta_mensaje').html('Datos Incorrectos');
              $('#cuerpo_mensaje').html('Debe escribir la letra a probar.');
              $('#mensaje').modal('show')

              $('#mensaje').on('hidden.bs.modal', function () {
                  input_palabra_secreta.focus();
              })
          }
      } else {
          input_probar_letra.val('');
          input_probar_letra.focus();
      }
  }

  function adivinar() {
      let input_adivinar = $('#adivinar');

      if (input_adivinar.val().length > 0) {
          if (cadenaPermitida(input_adivinar.val())) {
              if (input_adivinar.val().toLowerCase() == palabra_secreta) {
                  gane();
              } else {
                  perdida();
              }
          } else {
              $('#etiqueta_mensaje').html('Datos Incorrectos');
              $('#cuerpo_mensaje').html('Sólo se permiten caracteres de la A a la Z únicamente.');
              $('#mensaje').modal('show')

              $('#mensaje').on('hidden.bs.modal', function () {
                  input_adivinar.val('');
                  input_adivinar.focus();
              })
          }
      } else {
          $('#etiqueta_mensaje').html('Datos Incorrectos');
          $('#cuerpo_mensaje').html('Debe escribir la palabra a adivinar.');
          $('#mensaje').modal('show')

          $('#mensaje').on('hidden.bs.modal', function () {
              input_adivinar.focus();
          })
      }
  }

  function finalizar() {
      inicializar();
  }

  function main() {
      inicializar();
      $('#boton_iniciar').click(iniciar);
      $('#boton_probar').click(probarLetra);
      $('#boton_finalizar').click(finalizar);
      $('#boton_adivinar').click(adivinar);

      $('#palabra_secreta').on("keydown", function (event) {
          if (event.which == 13) {
              iniciar();
          }
      });

      $('#probar_letra').on("keydown", function (event) {
          if (event.which == 13) {
              probarLetra();
          }
      });

      $('#adivinar').on("keydown", function (event) {
          if (event.which == 13) {
              adivinar();
          }
      });
  }

  main();
});