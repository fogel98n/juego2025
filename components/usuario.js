import { Header } from "./header.js";
import { memoria } from "../juegos/memoria.js";
import { adivinaLafigura } from "../juegos/adivinaLafigura.js";
import { emojiGame } from "../juegos/emoji_game.js";
import { adivinaLafruta } from "../juegos/adivinaLafruta.js";
import { simondice } from "../juegos/simondice.js";
import { BASE_URL } from "../config.js";
import { esperaUsuario } from "./esperaUsuario.js";
import { avatares } from "./avatar.js";

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

  let avatarSeleccionado = null;

  const selectorAvatares = avatares((avatarId) => {
    avatarSeleccionado = avatarId;
  });

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

    if (!avatarSeleccionado) {
      alert("Por favor selecciona un avatar");
      return;
    }

    if (!partida || (!partida.codigo_partida && !partida.id)) {
      alert("No se encontró el código o ID de la partida. Por favor vuelve al inicio.");
      return;
    }

    try {
      const resUsuario = await fetch(`${BASE_URL}/usuarios/registrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          codigo_partida: partida.codigo_partida,
          avatar: avatarSeleccionado,
        }),
      });

      if (!resUsuario.ok) {
        const errorText = await resUsuario.text();
        throw new Error("Error al registrar usuario: " + errorText);
      }

      const usuarioRegistrado = await resUsuario.json();

      const datosCompletos = {
        ...partida,
        id_usuario: usuarioRegistrado.id,
        id_partida: usuarioRegistrado.id_partida,
        nombre_usuario: usuarioRegistrado.nombre,
        avatar: usuarioRegistrado.avatar || avatarSeleccionado,
      };

      const tipo_partida = (() => {
        switch (partida.id_juego) {
          case 1: return "memoria";
          case 2: return "adivina";
          case 3: return "emoji";
          case 4: return "fruta";
          case 5: return "simondice";
          default: return null;
        }
      })();

      if (!tipo_partida) {
        alert("Tipo de partida no reconocido.");
        return;
      }

      await fetch(`${BASE_URL}/usuarios/asociar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: usuarioRegistrado.id,
          id_partida: usuarioRegistrado.id_partida,
          tipo_partida: tipo_partida,
        }),
      });

      async function mostrarUsuariosConAvatar(id_partida, tipo) {
        try {
          const res = await fetch(`${BASE_URL}/usuarios/en_partida/${tipo}/${id_partida}`);
          if (!res.ok) throw new Error("No se pudo obtener la lista de usuarios");

          const usuarios = await res.json();

          const lista = document.createElement("div");
          lista.className = "lista-usuarios";

          usuarios.forEach(user => {
            const item = document.createElement("div");
            item.className = "usuario-item";

            const avatar = document.createElement("img");
            avatar.className = "avatar-pequeno";
            avatar.alt = `Avatar de ${user.nombre}`;
            avatar.src = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${user.id_avatar || user.avatar || "default"}&size=40`;

            const nombreSpan = document.createElement("span");
            nombreSpan.textContent = user.nombre;

            item.appendChild(avatar);
            item.appendChild(nombreSpan);

            lista.appendChild(item);
          });

          return lista;

        } catch (error) {
          console.error("Error al mostrar usuarios con avatar:", error);
        }
      }

      const panelEspera = await esperaUsuario(datosCompletos);
      document.body.innerHTML = "";
      document.body.appendChild(panelEspera);

      const listaUsuarios = await mostrarUsuariosConAvatar(datosCompletos.id_partida, tipo_partida);
      if (listaUsuarios) panelEspera.appendChild(listaUsuarios);

      const verificarInicio = setInterval(async () => {
        try {
          const res = await fetch(`${BASE_URL}/partidas/${datosCompletos.id_partida}/estado`);
          if (!res.ok) throw new Error("Error al obtener el estado de la partida");
          const data = await res.json();

          if (data.estado === "iniciada") {
            clearInterval(verificarInicio);

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
                return;
            }

            document.body.innerHTML = "";
            document.body.appendChild(panelJuego);
          }
        } catch (error) {
          console.error("Error consultando estado de la partida:", error);
        }
      }, 2000);

    } catch (error) {
      alert("No se pudo registrar el usuario: " + error.message);
      console.error(error);
    }
  });

  contenedor_btn.appendChild(btn_siguiente);

  contenedor.appendChild(Header());
  contenedor.appendChild(panel_usuario);
  contenedor.appendChild(selectorAvatares); // asegúrate que sea un elemento válido
  contenedor.appendChild(contenedor_btn);

  return contenedor;
}
