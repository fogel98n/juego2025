// espera.js
import { Header } from "./header.js";
import { juegos } from "./juegos.js";
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

  const contenedorPuestos = document.createElement("div");
  contenedorPuestos.className = "contenedor-puestos";

  // Sección "En curso"
  const seccionCurso = document.createElement("div");
  seccionCurso.className = "seccion-jugadores";

  const tituloCurso = document.createElement("h2");
  tituloCurso.className = "en-curso";
  tituloCurso.textContent = "En curso";

  const listaJugadoresEnCurso = document.createElement("div");
  listaJugadoresEnCurso.className = "lista-jugadores";

  seccionCurso.appendChild(tituloCurso);
  seccionCurso.appendChild(listaJugadoresEnCurso);

  // Sección "Finalizado"
  const seccionFinalizado = document.createElement("div");
  seccionFinalizado.className = "seccion-jugadores";

  const tituloFinalizado = document.createElement("h2");
  tituloFinalizado.className = "finalizado";
  tituloFinalizado.textContent = "Finalizado";

  const listaJugadoresFinalizados = document.createElement("div");
  listaJugadoresFinalizados.className = "lista-jugadores";

  seccionFinalizado.appendChild(tituloFinalizado);
  seccionFinalizado.appendChild(listaJugadoresFinalizados);

  // Agregar las dos secciones al contenedor principal (dos columnas)
  contenedorPuestos.appendChild(seccionCurso);
  contenedorPuestos.appendChild(seccionFinalizado);

  contenedor.appendChild(Header());
  contenedor.appendChild(tituloTiempo);
  contenedor.appendChild(tiempoRestante);
  contenedor.appendChild(contenedorPuestos);

  let tiempo = tiempoInicial * 60;

  // Función para cargar jugadores en curso y finalizados
  async function cargarJugadores() {
    if (!tipoJuego || !idPartida) {
      listaJugadoresEnCurso.innerHTML = "<p style='color:red;'>Datos inválidos de la partida.</p>";
      listaJugadoresFinalizados.innerHTML = "";
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/usuarios/${tipoJuego}/${idPartida}`);
      if (!res.ok) throw new Error("No se pudieron obtener los jugadores");
      const jugadores = await res.json();

      console.log("Jugadores recibidos:", jugadores); // <-- Para depurar

      // Limpio ambas listas
      listaJugadoresEnCurso.innerHTML = "";
      listaJugadoresFinalizados.innerHTML = "";

      if (!Array.isArray(jugadores) || jugadores.length === 0) {
        listaJugadoresEnCurso.textContent = "Aún no hay jugadores unidos.";
        listaJugadoresFinalizados.textContent = "No hay jugadores finalizados.";
        return;
      }

      // Filtrar por estado
      const enCurso = jugadores.filter(j => j.estado === "en_juego");
      const finalizados = jugadores.filter(j => j.estado === "finalizada");

      // Evitar que jugadores en finalizados aparezcan también en enCurso
      const finalizadosIds = new Set(finalizados.map(j => j.id_usuario || j.nombre));
      const enCursoFiltrado = enCurso.filter(j => !finalizadosIds.has(j.id_usuario || j.nombre));

      // Mostrar en curso
      if (enCursoFiltrado.length === 0) {
        listaJugadoresEnCurso.textContent = "No hay jugadores en curso.";
      } else {
        enCursoFiltrado.forEach((jugador, index) => {
          const jugadorDiv = document.createElement("p");
          jugadorDiv.textContent = `${index + 1}. ${jugador.nombre || "Sin nombre"}`;
          listaJugadoresEnCurso.appendChild(jugadorDiv);
        });
      }

      // Mostrar finalizados
      if (finalizados.length === 0) {
        listaJugadoresFinalizados.textContent = "No hay jugadores finalizados.";
      } else {
        finalizados.forEach((jugador, index) => {
          const jugadorDiv = document.createElement("p");
          jugadorDiv.textContent = `${index + 1}. ${jugador.nombre || "Sin nombre"}`;
          listaJugadoresFinalizados.appendChild(jugadorDiv);
        });
      }

    } catch (error) {
      console.error("Error cargando jugadores:", error);
      listaJugadoresEnCurso.innerHTML = "<p style='color:red;'>Error al cargar jugadores.</p>";
      listaJugadoresFinalizados.innerHTML = "<p style='color:red;'>Error al cargar jugadores.</p>";
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
