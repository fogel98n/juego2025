import { Header } from "./header.js";
import { espera } from "./espera.js";
import { BASE_URL } from "../config.js";

export async function Lobby(tiempoSeleccionado, idPartida, tipoJuego) {
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

  // Mostrar código de la partida
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

  // Función para cargar jugadores y actualizar el contenedor
  async function cargarJugadores() {
    console.log("Buscando jugadores para partida", idPartida, "tipo:", tipoJuego);
    try {
      const resJugadores = await fetch(`${BASE_URL}/usuarios/partida/${tipoJuego}/${idPartida}`);
      if (!resJugadores.ok) throw new Error("No se pudo obtener los jugadores");
      const jugadores = await resJugadores.json();

      console.log("Jugadores recibidos:", jugadores);

      jugadoresContenedor.innerHTML = ""; // Limpiar antes de actualizar

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
      jugadoresContenedor.innerHTML = "";
      const errorMsg = document.createElement("p");
      errorMsg.textContent = "Error al cargar jugadores";
      jugadoresContenedor.appendChild(errorMsg);
    }
  }

  // Cargar jugadores inicialmente
  cargarJugadores();

  // Actualizar lista cada 3 segundos
  const intervalo = setInterval(cargarJugadores, 3000);

  const tiempoSeleccionadoTexto = document.createElement("h2");
  tiempoSeleccionadoTexto.className = "tiempo-seleccionado";
  tiempoSeleccionadoTexto.textContent = `Duración: ${tiempoSeleccionado} minutos`;

  const btn_inicio = document.createElement("button");
  btn_inicio.className = "btn_inicio";
  btn_inicio.textContent = "Iniciar";

  btn_inicio.addEventListener("click", () => {
    clearInterval(intervalo); // Detener actualización al iniciar partida
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
