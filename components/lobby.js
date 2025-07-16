import { Header } from "./header.js";
import { BASE_URL } from "../config.js";

export async function Lobby(tiempoSeleccionado, idPartida) {
  const tipoJuego = "emoji"; // fijo para este ejemplo

  const contenedor = document.createElement("div");
  contenedor.className = "contenedor-lobby";

  if (!idPartida) {
    const errorMensaje = document.createElement("p");
    errorMensaje.style.color = "red";
    errorMensaje.textContent = "❌ Error: falta idPartida.";
    contenedor.appendChild(errorMensaje);
    return contenedor;
  }

  const tituloLobby = document.createElement("h1");
  tituloLobby.className = "titulo-lobby";
  tituloLobby.textContent = "¡Partida Creada!";

  const descripcionLobby = document.createElement("p");
  descripcionLobby.className = "descripcion";
  descripcionLobby.textContent = "Comparte este código con los participantes para que se unan al juego";

  const codigoLobby = document.createElement("h1");
  codigoLobby.className = "codigo-lobby";
  codigoLobby.textContent = "Cargando código...";

  const nombreJuegoTexto = document.createElement("p");
  nombreJuegoTexto.className = "nombre-juego";
  nombreJuegoTexto.textContent = "Juego: Cargando...";

  const nombreNivelTexto = document.createElement("p");
  nombreNivelTexto.className = "nombre-nivel";
  nombreNivelTexto.textContent = "Nivel: Cargando...";

  const tituloJugadores = document.createElement("h2");
  tituloJugadores.className = "jugadores-titulo";
  tituloJugadores.textContent = "Jugadores en la partida";

  const jugadoresContenedor = document.createElement("div");
  jugadoresContenedor.className = "jugadores-contenedor";
  jugadoresContenedor.style.maxHeight = "200px";
  jugadoresContenedor.style.overflowY = "auto";

  // Botón para iniciar partida
  const btn_inicio = document.createElement("button");
  btn_inicio.className = "btn_inicio";
  btn_inicio.textContent = "Iniciar";
  btn_inicio.disabled = true;

  // Variable para saber si hay jugadores
  let hayJugadores = false;

  // Obtener datos de la partida (codigo_partida, nombre juego y nivel)
  let codigo_partida = "";
  async function cargarDatosPartida() {
    try {
      const res = await fetch(`${BASE_URL}/partidas/${idPartida}`);
      if (!res.ok) throw new Error("No se pudo obtener la partida");
      const partidaData = await res.json();

      codigo_partida = partidaData.codigo_partida;
      codigoLobby.textContent = codigo_partida;

      const resInfo = await fetch(`${BASE_URL}/partidas/codigo/${codigo_partida}`);
      if (!resInfo.ok) throw new Error("No se pudo obtener la info del juego");
      const info = await resInfo.json();

      nombreJuegoTexto.textContent = `Juego: ${info.nombre_juego || "Desconocido"}`;
      nombreNivelTexto.textContent = `Nivel: ${info.nombre_nivel || "Desconocido"}`;
    } catch (error) {
      console.error("Error obteniendo datos de la partida:", error);
      codigoLobby.textContent = "⚠️ Error al cargar el código";
      nombreJuegoTexto.textContent = "Juego: no disponible";
      nombreNivelTexto.textContent = "Nivel: no disponible";
    }
  }

  // Función para cargar jugadores y mostrarlos
  async function cargarJugadores() {
    try {
      const res = await fetch(`${BASE_URL}/usuarios/${tipoJuego}/${idPartida}`);
      if (!res.ok) throw new Error("No se pudieron obtener los jugadores");
      const jugadores = await res.json();

      jugadoresContenedor.innerHTML = "";

      if (!Array.isArray(jugadores) || jugadores.length === 0) {
        const sinJugadores = document.createElement("p");
        sinJugadores.textContent = "Aún no hay jugadores unidos.";
        jugadoresContenedor.appendChild(sinJugadores);
        btn_inicio.disabled = true;
        hayJugadores = false;
        return;
      }

      jugadores.forEach((jugador, i) => {
        const divJugador = document.createElement("div");
        divJugador.className = "jugador-div";
        divJugador.textContent = `${i + 1}. ${jugador.nombre || "Sin nombre"}`;
        jugadoresContenedor.appendChild(divJugador);
      });

      btn_inicio.disabled = false;
      hayJugadores = true;

    } catch (error) {
      console.error("Error cargando jugadores:", error);
      jugadoresContenedor.innerHTML = "<p style='color:red;'>Error al cargar jugadores.</p>";
      btn_inicio.disabled = true;
      hayJugadores = false;
    }
  }

  // Evento para iniciar la partida
  btn_inicio.addEventListener("click", async () => {
    if (!hayJugadores) return;

    try {
      const res = await fetch(`${BASE_URL}/partidas/iniciar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_partida: idPartida }),
      });

      if (!res.ok) throw new Error("No se pudo iniciar la partida");

      clearInterval(intervaloJugadores);
      alert("Partida iniciada correctamente");

      // Aquí puedes redirigir o mostrar la pantalla del juego
      // Ejemplo: window.location.href = `/juego/${idPartida}`;

    } catch (error) {
      console.error("Error al iniciar la partida:", error);
      alert("Error al iniciar la partida");
    }
  });

  // Mostrar duración
  const tiempoSeleccionadoTexto = document.createElement("h2");
  tiempoSeleccionadoTexto.className = "tiempo-seleccionado";
  tiempoSeleccionadoTexto.textContent = `Duración: ${tiempoSeleccionado} minutos`;

  // Armar DOM
  contenedor.appendChild(Header());
  contenedor.appendChild(tituloLobby);
  contenedor.appendChild(descripcionLobby);
  contenedor.appendChild(codigoLobby);
  contenedor.appendChild(nombreJuegoTexto);
  contenedor.appendChild(nombreNivelTexto);
  contenedor.appendChild(tituloJugadores);
  contenedor.appendChild(jugadoresContenedor);
  contenedor.appendChild(tiempoSeleccionadoTexto);
  contenedor.appendChild(btn_inicio);

  // Carga inicial
  await cargarDatosPartida();
  await cargarJugadores();

  // Actualizar jugadores cada 3 segundos
  const intervaloJugadores = setInterval(cargarJugadores, 3000);

  return contenedor;
}
