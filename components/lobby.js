import { Header } from "./header.js";
import { espera } from "./espera.js";
import { BASE_URL } from "../config.js";

export async function Lobby(tiempoSeleccionado, idPartida /* , tipoJuego */) {
  // Fijar tipoJuego a "emoji"
  const tipoJuego = "emoji";

  console.log("⏱️ tiempoSeleccionado:", tiempoSeleccionado);
  console.log("🆔 idPartida:", idPartida);
  console.log("🎮 tipoJuego fijado a:", tipoJuego);

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

  let codigo_partida = "";

  // Obtener datos de la partida
  try {
    const res = await fetch(`${BASE_URL}/partidas/${idPartida}`);
    if (!res.ok) throw new Error("No se pudo obtener la partida");
    const partidaData = await res.json();

    codigo_partida = partidaData.codigo_partida;
    codigoLobby.textContent = codigo_partida;

    // Obtener nombre del juego y nivel
    const resInfo = await fetch(`${BASE_URL}/partidas/codigo/${codigo_partida}`);
    if (!resInfo.ok) throw new Error("No se pudo obtener la información del juego");

    const data = await resInfo.json();
    nombreJuegoTexto.textContent = `Juego: ${data.nombre_juego || "Desconocido"}`;
    nombreNivelTexto.textContent = `Nivel: ${data.nombre_nivel || "Desconocido"}`;
  } catch (error) {
    console.error("Error obteniendo datos de la partida:", error);
    codigoLobby.textContent = "⚠️ Error al cargar el código";
    nombreJuegoTexto.textContent = "Juego: no disponible";
    nombreNivelTexto.textContent = "Nivel: no disponible";
  }

  // Crear botón iniciar y estado
  const btn_inicio = document.createElement("button");
  btn_inicio.className = "btn_inicio";
  btn_inicio.textContent = "Iniciar";
  btn_inicio.disabled = true; // deshabilitado inicialmente

  // Variable para saber si hay jugadores
  let hayJugadores = false;


  btn_inicio.addEventListener("click", async () => {
    if (!hayJugadores) return;
    try {
      const res = await fetch(`${BASE_URL}/partidas/iniciar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_partida: idPartida })
      });
      if (!res.ok) throw new Error("No se pudo iniciar la partida");
      clearInterval(intervaloJugadores);
      alert("Partida iniciada correctamente");
    } catch (error) {
      console.error("Error al iniciar la partida:", error);
      alert("Error al iniciar la partida");
    }
  });  
  // Función para cargar jugadores
  async function cargarJugadores() {
    if (!idPartida) {
      console.error("❌ Falta idPartida.");
      jugadoresContenedor.innerHTML = "<p style='color:red;'>Datos inválidos de la partida.</p>";
      btn_inicio.disabled = true;
      hayJugadores = false;
      return;
    }

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

      jugadores.forEach((jugador, index) => {
        const jugadorDiv = document.createElement("div");
        jugadorDiv.className = "jugador-div";

        const nombre = document.createElement("p");
        nombre.textContent = `${index + 1}. ${jugador.nombre || "Sin nombre"}`;

        jugadorDiv.appendChild(nombre);
        jugadoresContenedor.appendChild(jugadorDiv);
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

  // Mostrar duración
  const tiempoSeleccionadoTexto = document.createElement("h2");
  tiempoSeleccionadoTexto.className = "tiempo-seleccionado";
  tiempoSeleccionadoTexto.textContent = `Duración: ${tiempoSeleccionado} minutos`;

  // Ensamblar DOM
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

  // Cargar jugadores inicialmente y luego cada 3s
  cargarJugadores();
  const intervaloJugadores = setInterval(cargarJugadores, 3000);

  return contenedor;
}
