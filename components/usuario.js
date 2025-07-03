import { Header } from "./header.js";
import { memoria } from "../juegos/memoria.js";
import { adivinaLafigura } from "../juegos/adivinaLafigura.js";

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

  // Botón siguiente
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
      const resUsuario = await fetch("http://localhost:5000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          codigo_partida: partida.codigo_partida,
        }),
      });

      if (!resUsuario.ok) throw new Error("Error al registrar usuario");

      const usuarioRegistrado = await resUsuario.json();
      console.log("✅ Usuario registrado:", usuarioRegistrado);

      const datosCompletos = {
        ...partida,
        id_usuario: usuarioRegistrado.id,
        id_partida: partida.id_partida || partida.id,
        nombre_usuario: usuarioRegistrado.nombre,
      };

      // 🔍 Verificamos el tipo de juego asignado a la partida
      let panelJuego;

      switch (partida.juego) {
        case "memoria":
          panelJuego = memoria(datosCompletos);
          break;
        case "adivinaLaFigura":
          panelJuego = adivinaLafigura(datosCompletos);
          break;
        default:
          alert("No se ha asignado un juego válido a esta partida");
          return;
      }

      document.body.innerHTML = "";
      document.body.appendChild(panelJuego);

    } catch (error) {
      alert("No se pudo registrar el usuario");
      console.error(error);
    }
  });

  contenedor_btn.appendChild(btn_siguiente);

  contenedor.appendChild(Header());
  contenedor.appendChild(panel_usuario);
  contenedor.appendChild(contenedor_btn);

  return contenedor;
}

