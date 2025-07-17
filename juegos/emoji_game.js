import { headerjuego } from "../components/headerJuego.js";
import { posicionesEmoji } from "../components/posicionesEmoji.js";
import { BASE_URL } from "../config.js";

export function emojiGame(partida) {
  console.log("Objeto recibido en emojiGame:", partida);

  const contenedor = document.createElement("section");
  contenedor.className = "contenedor-emojigame";

  const header = headerjuego(partida.nombre_nivel || "Nivel");
  contenedor.appendChild(header);

  const contenedorInfo = document.createElement("div");
  contenedorInfo.className = "tiempo-info-juego";

  const tiempoDiv = document.createElement("div");
  tiempoDiv.className = "tiempo-partidas";

  const intentosDiv = document.createElement("div");
  intentosDiv.className = "intentos-restante";

  contenedorInfo.appendChild(tiempoDiv);
  contenedorInfo.appendChild(intentosDiv);
  contenedor.appendChild(contenedorInfo);

  const contenedorObjetivo = document.createElement("div");
  contenedorObjetivo.className = "emoji-objetivo";
  contenedor.appendChild(contenedorObjetivo);

  const contenedorEmojis = document.createElement("div");
  contenedorEmojis.className = "contenedor-emojis";
  contenedor.appendChild(contenedorEmojis);

  const emojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵"];

  const nivel = parseInt((partida.nombre_nivel || "nivel1").replace(/\D/g, ""), 10) || 1;
  const emojisPorRonda = 6 + nivel * 2;
  const rondasTotales = 3;

  let rondaActual = 1;
  let intentosFallidos = 0;
  let intentosRestantes = 3;
  let tiempoInicio = Date.now();

  // ⏱ Muestra el cronómetro
  const interval = setInterval(() => {
    const ahora = Date.now();
    const transcurrido = Math.floor((ahora - tiempoInicio) / 1000);
    const minutos = Math.floor(transcurrido / 60);
    const segundos = transcurrido % 60;
    tiempoDiv.textContent = `⏱ Tiempo: ${minutos.toString().padStart(2, "0")}:${segundos
      .toString()
      .padStart(2, "0")}`;
  }, 1000);

  // Panel emergente para ronda superada
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

  function guardarResultado(estado = "finalizada") {
    clearInterval(interval);

    const tiempoFinal = Math.floor((Date.now() - tiempoInicio) / 1000);

    const datos = {
      id_usuario: partida.id_usuario,
      id_partida: partida.id_partida,
      aciertos: rondaActual,
      intentos_fallidos: intentosFallidos,
      tiempo: tiempoFinal,
      estado, // 👈 Este campo actualiza también el estado del usuario en la BD
    };

    if (!datos.id_usuario || !datos.id_partida) {
      console.error("❌ ID de usuario o partida no definidos:", datos);
      return;
    }

    console.log("📤 Enviando resultado a /emoji/guardarresultado:", datos);

    fetch(`${BASE_URL}/emoji/guardarresultado`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
      .then((res) => res.json())
      .then(() => {
        contenedor.innerHTML = "";
        const tablaPosiciones = posicionesEmoji(partida);
        contenedor.appendChild(tablaPosiciones);
      })
      .catch((err) => {
        console.error("❌ Error al guardar resultado:", err);
      });
  }

  function cargarRonda() {
    contenedorEmojis.innerHTML = "";
    intentosFallidos = 0;
    intentosRestantes = 3;
    intentosDiv.textContent = `Intentos: ${intentosRestantes}`;

    const emojiComun = emojis[Math.floor(Math.random() * emojis.length)];
    let emojiUnico;
    do {
      emojiUnico = emojis[Math.floor(Math.random() * emojis.length)];
    } while (emojiUnico === emojiComun);

    contenedorObjetivo.innerHTML = `<h2>Encuentra el diferente: <span class="emoji-grande">${emojiUnico}</span></h2>`;

    const indiceCorrecto = Math.floor(Math.random() * emojisPorRonda);

    for (let i = 0; i < emojisPorRonda; i++) {
      const emoji = document.createElement("div");
      emoji.className = "emoji-item";
      emoji.textContent = i === indiceCorrecto ? emojiUnico : emojiComun;

      emoji.addEventListener("click", () => {
        if (i === indiceCorrecto) {
          emoji.style.backgroundColor = "#d4fcd6";

          if (rondaActual < rondasTotales) {
            // Mostrar panel antes de cargar siguiente ronda
            mostrarPanelRondaSuperada(rondaActual + 1);

            rondaActual++;
            setTimeout(cargarRonda, 1500);
          } else {
            alert("🎉 ¡Completaste las 3 rondas!");
            guardarResultado("finalizada"); // 👈 Estado finalizado
          }
        } else {
          emoji.style.backgroundColor = "#fcd4d4";
          intentosFallidos++;
          intentosRestantes--;
          intentosDiv.textContent = `Intentos: ${intentosRestantes}`;

          if (intentosFallidos >= 3) {
            contenedorEmojis.innerHTML = "";
            guardarResultado("fallida"); // 👈 Estado fallida
          }
        }
      });

      contenedorEmojis.appendChild(emoji);
    }
  }

  cargarRonda();
  return contenedor;
}
