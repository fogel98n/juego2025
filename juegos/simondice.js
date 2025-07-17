import { headerjuego } from "../components/headerJuego.js";
import { posicionesSimonDice } from "../components/posicionesimondice.js";
import { BASE_URL } from "../config.js";

export function simondice(partida) {
  console.log("🐵 Objeto recibido en simondice:", partida);

  const preguntasPorNivel = [
    [
      { nombre: "Gato", imagen: "../media/gato.jpeg", instruccion: "Simón dice: toca el gato" },
      { nombre: "Perro", imagen: "../media/perro.jpeg", instruccion: "Simón dice: toca el perro" },
      { nombre: "Pájaro", imagen: "../media/pajaro.jpeg", instruccion: "Simón dice: toca el pájaro" },
    ],
    [
      { nombre: "Elefante", imagen: "../media/elefante.jpeg", instruccion: "Simón dice: toca el elefante" },
      { nombre: "León", imagen: "../media/leon.jpeg", instruccion: "Simón dice: toca el león" },
      { nombre: "Mono", imagen: "../media/mono.jpeg", instruccion: "Simón dice: toca el mono" },
    ],
    [
      { nombre: "Tigre", imagen: "../media/tigre.jpeg", instruccion: "Simón dice: toca el tigre" },
      { nombre: "Cebra", imagen: "../media/cebra.jpeg", instruccion: "Simón dice: toca la cebra" },
      { nombre: "Jirafa", imagen: "../media/jirafa.jpeg", instruccion: "Simón dice: toca la jirafa" },
    ],
  ];

  const nivelString = partida.nombre_nivel || "nivel1";
  const nivelIndex = Math.max(0, Math.min(2, parseInt(nivelString.replace(/\D/g, ""), 10) - 1));
  const preguntas = preguntasPorNivel[nivelIndex];

  const contenedor = document.createElement("section");
  contenedor.className = "contenedor-simondice";

  const header = headerjuego(partida.nombre_nivel || "Nivel");
  contenedor.appendChild(header);

  const contenedorInfo = document.createElement("div");
  contenedorInfo.className = "contenedor-info-juego";

  const tiempoDiv = document.createElement("div");
  tiempoDiv.className = "tiempo-partida";

  const intentosDiv = document.createElement("div");
  intentosDiv.className = "intentos-restantes";

  contenedorInfo.appendChild(tiempoDiv);
  contenedorInfo.appendChild(intentosDiv);
  contenedor.appendChild(contenedorInfo);

  const instruccion = document.createElement("h2");
  instruccion.className = "instruccion-simondice";
  contenedor.appendChild(instruccion);

  const contenedorOpciones = document.createElement("div");
  contenedorOpciones.className = "opciones-simondice";
  contenedor.appendChild(contenedorOpciones);

  let rondaActual = 1;
  const rondasTotales = 3;
  let aciertos = 0;
  let intentos = 0;
  let intentosRestantes = 3;
  let preguntaActual = null;

  const tiempoMax = (partida.duracion_minutos || 1) * 60;
  let tiempoRestante = tiempoMax;
  let tiempoUsado = 0;
  let timerId = null;

  function actualizarTiempo() {
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;
    tiempoDiv.textContent = `⏱ Tiempo: ${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;

    if (tiempoRestante > 0) {
      tiempoRestante--;
      tiempoUsado++;
      timerId = setTimeout(actualizarTiempo, 1000);
    } else {
      tiempoDiv.textContent = "⏰ Tiempo agotado";
      mostrarPosiciones("abandonada");
    }
  }

  // Función para mostrar panel emergente con ronda superada
  function mostrarPanelRondaSuperada(ronda) {
    const panel = document.createElement("div");
    panel.className = "panel-ronda-superada";
    panel.textContent = `¡Ronda ${ronda - 1} superada!`;
    panel.style.position = "fixed";
    panel.style.top = "20%";
    panel.style.left = "50%";
    panel.style.transform = "translateX(-50%)";
    panel.style.backgroundColor = "rgba(0, 128, 0, 0.85)";
    panel.style.color = "white";
    panel.style.padding = "1rem 2rem";
    panel.style.borderRadius = "10px";
    panel.style.fontSize = "1.5rem";
    panel.style.zIndex = "9999";
    panel.style.boxShadow = "0 0 10px #004400";

    document.body.appendChild(panel);

    setTimeout(() => {
      panel.remove();
    }, 1500);
  }

  function siguienteRonda() {
    contenedorOpciones.innerHTML = "";
    const opciones = [...preguntas].sort(() => 0.5 - Math.random()).slice(0, 3);
    preguntaActual = opciones[Math.floor(Math.random() * opciones.length)];

    instruccion.textContent = `Ronda ${rondaActual}: ${preguntaActual.instruccion}`;
    intentosDiv.textContent = `Intentos: ${intentosRestantes}`;

    opciones.forEach((item) => {
      const wrapper = document.createElement("div");
      wrapper.className = "fondo-morado";

      const img = document.createElement("img");
      img.src = item.imagen;
      img.alt = item.nombre;
      img.className = "img-simondice";

      img.addEventListener("click", () => {
        intentos++;
        if (item.nombre === preguntaActual.nombre) {
          aciertos++;
          img.style.border = "3px solid green";
        } else {
          intentosRestantes--;
          img.style.border = "3px solid red";
        }

        intentosDiv.textContent = `Intentos: ${intentosRestantes}`;

        setTimeout(() => {
          if (intentosRestantes <= 0) {
            clearTimeout(timerId);
            mostrarPosiciones("abandonada");
          } else if (rondaActual < rondasTotales) {
            // Muestra panel antes de avanzar a la siguiente ronda
            mostrarPanelRondaSuperada(rondaActual + 1);

            rondaActual++;
            siguienteRonda();
          } else {
            clearTimeout(timerId);
            mostrarPosiciones("finalizada");
          }
        }, 800);
      });

      wrapper.appendChild(img);
      contenedorOpciones.appendChild(wrapper);
    });
  }

  function guardarResultado(estado = "finalizada") {
    const datos = {
      id_usuario: partida.id_usuario,
      id_partida: partida.id_partida,
      aciertos,
      intentos_fallidos: intentos - aciertos,
      tiempo: tiempoUsado,
      estado // Solo estado del usuario
    };

    console.log("📤 Enviando resultado simondice:", datos);

    return fetch(`${BASE_URL}/simondice/guardarresultado`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    })
      .then(res => res.json())
      .catch(err => {
        console.error("❌ Error al guardar resultado:", err);
      });
  }

  async function mostrarPosiciones(estadoFinal) {
    await guardarResultado(estadoFinal);
    contenedor.innerHTML = "";
    const tabla = posicionesSimonDice(partida);
    contenedor.appendChild(tabla);
  }

  actualizarTiempo();
  siguienteRonda();

  return contenedor;
}
