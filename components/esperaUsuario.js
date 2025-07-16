import { Header } from "./header.js";
import { memoria } from "../juegos/memoria.js";
import { adivinaLafigura } from "../juegos/adivinaLafigura.js";
import { emojiGame } from "../juegos/emoji_game.js";
import { adivinaLafruta } from "../juegos/adivinaLafruta.js";
import { simondice } from "../juegos/simondice.js";
import { BASE_URL } from "../config.js";

export function esperaUsuario(datos) {
  const contenedor = document.createElement("section");
  contenedor.className = "contenedor-espera-usuario";

  const header = Header();
  const mensaje = document.createElement("div");
  mensaje.className = "mensaje-espera";
  mensaje.textContent = "Esperando que el anfitrión inicie la partida...";

  contenedor.appendChild(header);
  contenedor.appendChild(mensaje);

  const idPartida = datos.id_partida || datos.idPartida;

  // Polling para verificar estado de la partida cada 2 segundos
  const intervaloEstado = setInterval(async () => {
    try {
      const res = await fetch(`${BASE_URL}/partidas/${idPartida}/estado`);
      if (!res.ok) throw new Error("Error al obtener el estado de la partida");

      const data = await res.json();

      if (data.estado === "iniciada") {
        clearInterval(intervaloEstado);

        // Lanzar el juego correspondiente según tipo de partida
        let panelJuego;

        switch (datos.tipo_juego) {
          case "memoria":
            panelJuego = memoria(datos);
            break;
          case "adivinaLafigura":
            panelJuego = adivinaLafigura(datos);
            break;
          case "emojiGame":
            panelJuego = emojiGame(datos);
            break;
          case "adivinaLafruta":
            panelJuego = adivinaLafruta(datos);
            break;
          case "simondice":
            panelJuego = simondice(datos);
            break;
          default:
            return;
        }

        document.body.innerHTML = "";
        document.body.appendChild(panelJuego);
      }
    } catch (err) {
      console.error("Error consultando estado de la partida:", err);
    }
  }, 2000);

  return contenedor;
}
