import { botones } from "./botones.js";
import { BASE_URL } from "../config.js";  // importa la base URL

export function posicionesAdivinaLafruta(partida) {
  const contenedor = document.createElement("section");
  contenedor.className = "posiciones-adivina-contenedor";

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

  fetch(`${BASE_URL}/frutas/partidas?id_partida=${partida.id_partida}`)
    .then(res => res.json())
    .then(data => {
      tabla.innerHTML = "";

      if (!Array.isArray(data) || data.length === 0) {
        tabla.textContent = "No hay resultados para esta partida.";
        return;
      }

      data.sort((a, b) => a.tiempo - b.tiempo);

      const encabezado = document.createElement("div");
      encabezado.className = "fila encabezado";
      encabezado.innerHTML = `
        <span class="col posicion">#</span>
        <span class="col nombre">Jugador</span>
        <span class="col aciertos">Aciertos</span>
        <span class="col intentos">Intentos</span>
        <span class="col tiempo">Tiempo (s)</span>
      `;
      tabla.appendChild(encabezado);

      data.forEach((jugador, index) => {
        const fila = document.createElement("div");
        fila.className = "fila";

        fila.innerHTML = `
          <span class="col posicion">${index + 1}</span>
          <span class="col nombre">${jugador.nombre || "Jugador"}</span>
          <span class="col aciertos">${jugador.aciertos || jugador.puntuacion || 0}</span>
          <span class="col intentos">${jugador.intentos_fallidos || jugador.intentos || 0}</span>
          <span class="col tiempo">${jugador.tiempo || 0}</span>
        `;

        tabla.appendChild(fila);
      });
    })
    .catch(err => {
      tabla.innerHTML = `<p>Error al cargar resultados.</p>`;
      console.error("Error al obtener posiciones fruta:", err);
    });

  return contenedor;
}
