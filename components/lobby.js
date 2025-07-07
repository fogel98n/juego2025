import { Header } from "./header.js";
import { espera } from "./espera.js";
import { BASE_URL } from "../config.js";

export async function Lobby(tiempoSeleccionado, idPartida) {
  const contenedor = document.createElement("div");
  contenedor.className = "contenedor-lobby";

  const tituloLobby = document.createElement("h1");
  tituloLobby.className = "titulo-lobby";
  tituloLobby.textContent = "¡Partida Creada!";

  const descripcionlobby = document.createElement("p");
  descripcionlobby.className = "descripcion";
  descripcionlobby.textContent = "Comparte este código con los participantes para que se unan al juego";

  const codigoLobby = document.createElement("h1");
  codigoLobby.className = "codigo-lobby";
  codigoLobby.textContent = "Cargando código...";

  // Mostrar código partida
  try {
    const res = await fetch(`${BASE_URL}/partidas/${idPartida}`);
    if (!res.ok) throw new Error("No se pudo obtener el código de la partida");
    const partidaData = await res.json();
    codigoLobby.textContent = partidaData.codigo_partida;
  } catch (error) {
    console.error("Error obteniendo el código de la partida:", error);
    codigoLobby.textContent = "Error al cargar el código";
  }

  const jugadoresTitulo = document.createElement("h2");
  jugadoresTitulo.className = "jugadores";
  jugadoresTitulo.textContent = "Jugadores";

  const jugadoresContenedor = document.createElement("div");
  jugadoresContenedor.className = "jugadores-contenedor";
  jugadoresContenedor.style.maxHeight = "200px";
  jugadoresContenedor.style.overflowY = "auto";

  // Obtener jugadores reales de backend
  try {
    const resJugadores = await fetch(`${BASE_URL}/usuarios/partida/${idPartida}`);
    if (!resJugadores.ok) throw new Error("No se pudo obtener los jugadores");
    const jugadores = await resJugadores.json();

    if (jugadores.length === 0) {
      const noJugadores = document.createElement("p");
      noJugadores.textContent = "No hay jugadores registrados aún.";
      jugadoresContenedor.appendChild(noJugadores);
    } else {
      jugadores.forEach((usuario, index) => {
        const jugadorDiv = document.createElement("div");
        jugadorDiv.className = "jugador-div";

        const jugadorNombre = document.createElement("p");
        jugadorNombre.className = "jugador-nombre";
        jugadorNombre.textContent = `${index + 1}. ${usuario.nombre}`;

        jugadorDiv.appendChild(jugadorNombre);
        jugadoresContenedor.appendChild(jugadorDiv);
      });
    }
  } catch (error) {
    console.error("Error obteniendo los jugadores:", error);
    const errorMsg = document.createElement("p");
    errorMsg.textContent = "Error al cargar jugadores";
    jugadoresContenedor.appendChild(errorMsg);
  }

  const tiempoSeleccionadoTexto = document.createElement("h2");
  tiempoSeleccionadoTexto.className = "tiempo-seleccionado";
  tiempoSeleccionadoTexto.textContent = `Duración: ${tiempoSeleccionado} minutos`;

  const btn_inicio = document.createElement("button");
  btn_inicio.className = "btn_inicio";
  btn_inicio.textContent = "Iniciar";

  btn_inicio.addEventListener("click", () => {
    const panelEspera = espera(tiempoSeleccionado);
    document.body.innerHTML = "";
    document.body.appendChild(panelEspera);
  });

  contenedor.appendChild(Header());
  contenedor.appendChild(tituloLobby);
  contenedor.appendChild(descripcionlobby);
  contenedor.appendChild(codigoLobby);
  contenedor.appendChild(jugadoresTitulo);
  contenedor.appendChild(jugadoresContenedor);
  contenedor.appendChild(tiempoSeleccionadoTexto);
  contenedor.appendChild(btn_inicio);

  return contenedor;
}
