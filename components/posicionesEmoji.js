import { botones } from "./botones.js";
import { BASE_URL } from "../config.js";

export function posicionesEmoji(partida) {
  const contenedor = document.createElement("section");
  contenedor.className = "posiciones-emoji";

  const titulo = document.createElement("h1");
  titulo.textContent = `🏆 Tabla de posiciones - Partida ${partida.id_partida}`;
  titulo.className = "titulo-posiciones";

  const tabla = document.createElement("div");
  tabla.className = "tabla-posiciones";

  const loading = document.createElement("p");
  loading.textContent = "Cargando resultados...";
  tabla.appendChild(loading);

  contenedor.appendChild(titulo);
  contenedor.appendChild(tabla);
  contenedor.appendChild(botones());

  fetch(`${BASE_URL}/emoji/partidas?id_partida=${partida.id_partida}`)
    .then((res) => res.json())
    .then((data) => {
      tabla.innerHTML = "";

      if (!Array.isArray(data) || data.length === 0) {
        tabla.textContent = "No hay resultados para esta partida.";
        return;
      }

      // Filtrar duplicados por id_usuario (quedarse con el de menor tiempo)
      const jugadoresUnicos = new Map();
      data.forEach((jugador) => {
        const clave = jugador.id_usuario;
        if (!jugadoresUnicos.has(clave)) {
          jugadoresUnicos.set(clave, jugador);
        } else {
          const existente = jugadoresUnicos.get(clave);
          const tiempoActual = jugador.tiempo || jugador.tiempo_total || 0;
          const tiempoExistente = existente.tiempo || existente.tiempo_total || 0;

          if (tiempoActual < tiempoExistente) {
            jugadoresUnicos.set(clave, jugador);
          }
        }
      });

      const jugadores = Array.from(jugadoresUnicos.values());
      jugadores.sort((a, b) => (a.tiempo || a.tiempo_total || 0) - (b.tiempo || b.tiempo_total || 0));

      const encabezado = document.createElement("div");
      encabezado.className = "fila encabezado";
      encabezado.innerHTML = `
        <span class="col posicion">#</span>
        <span class="col nombre">Jugador</span>
        <span class="col intentos">Intentos</span>
        <span class="col tiempo">Tiempo (s)</span>
      `;
      tabla.appendChild(encabezado);

      jugadores.forEach((jugador, index) => {
        const fila = document.createElement("div");
        fila.className = "fila";

        fila.innerHTML = `
          <span class="col posicion">${index + 1}</span>
          <span class="col nombre">${jugador.nombre || "Jugador"}</span>
          <span class="col aciertos">${jugador.aciertos || jugador.puntuacion || 0}</span>
          <span class="col intentos">${jugador.intentos_fallidos || jugador.intentos || 0}</span>
          <span class="col tiempo">${jugador.tiempo || jugador.tiempo_total || 0}</span>
        `;

        tabla.appendChild(fila);
      });
    })
    .catch((err) => {
      tabla.innerHTML = `<p>Error al cargar resultados.</p>`;
      console.error("Error al obtener resultados de posiciones emoji:", err);
    });

  return contenedor;
}
