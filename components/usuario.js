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

    console.log("Datos partida para registro usuario:", partida);

    try {
      const resUsuario = await fetch(`${BASE_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          codigo_partida: partida.codigo_partida,
        }),
      });

      if (!resUsuario.ok) {
        const errorText = await resUsuario.text();
        console.error("Error backend:", resUsuario.status, errorText);
        throw new Error("Error al registrar usuario: " + errorText);
      }

      const usuarioRegistrado = await resUsuario.json();
      console.log("✅ Usuario registrado:", usuarioRegistrado);

      const datosCompletos = {
        ...partida,
        id_usuario: usuarioRegistrado.id,
        id_partida: partida.id_partida || partida.id,
        nombre_usuario: usuarioRegistrado.nombre,
      };

      let panelJuego;

      console.log("🔍 ID de juego:", partida.id_juego);

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
          console.error("❌ Juego no reconocido. id_juego =", partida.id_juego);
          alert("No se ha asignado un juego válido a esta partida");
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

