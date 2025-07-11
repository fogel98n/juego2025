import { Header } from "./header.js";
import { juegos } from "./juegos.js"; // Importar la función para redirigir
import { BASE_URL } from "../config.js";

export function espera(tiempoInicial, tipoJuego, idPartida) {
  const contenedor = document.createElement("div");
  contenedor.className = "contenedor-espera";

  const tituloTiempo = document.createElement("h2");
  tituloTiempo.className = "titulo-tiempo";
  tituloTiempo.textContent = "Tiempo ";

  const tiempoRestante = document.createElement("h1");
  tiempoRestante.className = "tiempo-restante";
  tiempoRestante.textContent = formatTime(tiempoInicial * 60);

  const contendor_puestos = document.createElement("div");
  contendor_puestos.className = "contenedor-puestos";

  // Título "En curso"
  const curso = document.createElement("h2");
  curso.className = "en-curso";
  curso.textContent = "En curso";
  contendor_puestos.appendChild(curso);

  // Contenedor lista jugadores "En curso"
  const listaJugadores = document.createElement("div");
  listaJugadores.className = "lista-jugadores";
  listaJugadores.style.marginBottom = "20px"; // espacio para separar de "Finalizado"
  contendor_puestos.appendChild(listaJugadores);

  // Título "Finalizado"
  const finalizado = document.createElement("h2");
  finalizado.className = "finalizado";
  finalizado.textContent = "Finalizado";
  contendor_puestos.appendChild(finalizado);

  contenedor.appendChild(Header());
  contenedor.appendChild(tituloTiempo);
  contenedor.appendChild(tiempoRestante);
  contenedor.appendChild(contendor_puestos);

  let tiempo = tiempoInicial * 60;

  // Función para cargar jugadores en proceso
  async function cargarJugadores() {
    if (!tipoJuego || !idPartida) {
      listaJugadores.innerHTML = "<p style='color:red;'>Datos inválidos de la partida.</p>";
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/usuarios/${tipoJuego}/${idPartida}`);
      if (!res.ok) throw new Error("No se pudieron obtener los jugadores");
      const jugadores = await res.json();

      listaJugadores.innerHTML = "";

      if (!Array.isArray(jugadores) || jugadores.length === 0) {
        listaJugadores.textContent = "Aún no hay jugadores unidos.";
        return;
      }

      jugadores.forEach((jugador, index) => {
        const jugadorDiv = document.createElement("p");
        jugadorDiv.textContent = `${index + 1}. ${jugador.nombre || "Sin nombre"}`;
        listaJugadores.appendChild(jugadorDiv);
      });
    } catch (error) {
      console.error("Error cargando jugadores:", error);
      listaJugadores.innerHTML = "<p style='color:red;'>Error al cargar jugadores.</p>";
    }
  }

  cargarJugadores();
  const intervaloJugadores = setInterval(cargarJugadores, 3000);

  const intervalo = setInterval(() => {
    tiempo--;
    tiempoRestante.textContent = formatTime(tiempo);

    if (tiempo <= 0) {
      clearInterval(intervalo);
      clearInterval(intervaloJugadores);
      tiempoRestante.textContent = "00:00";
    }
  }, 1000);

  // --- Botón nueva partida ---
  const btnNuevaPartida = document.createElement("button");
  btnNuevaPartida.textContent = "Nueva partida";
  btnNuevaPartida.className = "btn-nueva-partida";
  btnNuevaPartida.style.marginTop = "20px";
  btnNuevaPartida.addEventListener("click", () => {
    const panelJuegos = juegos(); // Crear panel de juegos
    document.body.innerHTML = "";  // Limpiar pantalla
    document.body.appendChild(panelJuegos);
  });

  contenedor.appendChild(btnNuevaPartida);

  return contenedor;
}

function formatTime(segundos) {
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;
  const minutosFormateados = minutos.toString().padStart(2, "0");
  const segundosFormateados = segundosRestantes.toString().padStart(2, "0");
  return `${minutosFormateados}:${segundosFormateados}`;
}
