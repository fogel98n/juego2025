import { Header } from "./header.js";
import { memoria } from "../juegos/memoria.js";
import { adivinaLafigura } from "../juegos/adivinaLafigura.js";
import { emojiGame } from "../juegos/emoji_game.js";
import { adivinaLafruta } from "../juegos/adivinaLafruta.js";
import { simondice } from "../juegos/simondice.js";
import { BASE_URL } from "../config.js";

export function usuario(partida) {
  const contenedor = document.createElement("section");
  contenedor.className = "contenedor-usuario";

  const panel_usuario = document.createElement("div");
  panel_usuario.className = "contenedor_codigo";

  const label = document.createElement("div");
  label.className = "btn-div";
  label.textContent = "Usuario";

  const inputUsuario = document.createElement("input");
  inputUsuario.type = "text";
  inputUsuario.className = "input-codigo";

  panel_usuario.appendChild(label);
  panel_usuario.appendChild(inputUsuario);

  const contenedor_btn = document.createElement("div");
  contenedor_btn.className = "contenedor-btn";

  const btn_siguiente = document.createElement("button");
  btn_siguiente.className = "btn-siguiente";
  btn_siguiente.textContent = "Siguiente";

  btn_siguiente.addEventListener("click", async () => {
    const nombre = inputUsuario.value.trim();

    if (!nombre) {
      alert("Por favor ingresa tu nombre de usuario");
      return;
    }

    if (!partida || (!partida.codigo_partida && !partida.id)) {
      alert("No se encontró el código o ID de la partida. Por favor vuelve al inicio.");
      return;
    }

    try {
      // Registrar usuario
      const resUsuario = await fetch(`${BASE_URL}/usuarios/registrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          codigo_partida: partida.codigo_partida,
        }),
      });

      if (!resUsuario.ok) {
        const errorText = await resUsuario.text();
        throw new Error("Error al registrar usuario: " + errorText);
      }

      const usuarioRegistrado = await resUsuario.json();

      // Mapear id_juego al tipo_partida para el backend
      const tipoPorIdJuego = {
        1: "memoria",
        2: "adivinaLafigura",
        3: "emojiGame",
        4: "adivinaLafruta",
        5: "simondice"
      };


      const datosCompletos = {
        ...partida,
        id_usuario: usuarioRegistrado.id,
        id_partida: usuarioRegistrado.id_partida,
        nombre_usuario: usuarioRegistrado.nombre,
      };

      // Entrar al juego según id_juego
      let panelJuego;

      switch (partida.id_juego) {
        case 1:
          panelJuego = memoria(datosCompletos);
          break;
        case 2:
          panelJuego = adivinaLafigura(datosCompletos);
          break;
        case 3:
          panelJuego = emojiGame(datosCompletos);
          break;
        case 4:
          panelJuego = adivinaLafruta(datosCompletos);
          break;
        case 5:
          panelJuego = simondice(datosCompletos);
          break;
        default:
          alert("Juego no reconocido. Verifica el id_juego.");
          return;
      }

      document.body.innerHTML = "";
      document.body.appendChild(panelJuego);

    } catch (error) {
      alert("No se pudo registrar el usuario: " + error.message);
      console.error(error);
    }
  });

  contenedor_btn.appendChild(btn_siguiente);

  contenedor.appendChild(Header());
  contenedor.appendChild(panel_usuario);
  contenedor.appendChild(contenedor_btn);

  return contenedor;
}
