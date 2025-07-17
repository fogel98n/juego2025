import { Header } from "./header.js";
import { BASE_URL } from "../config.js";
import { espera } from "./espera.js";

export async function Lobby(tiempoSeleccionado, idPartida) {
  const contenedor = document.createElement("div");
  contenedor.className = "contenedor-lobby";

  if (!idPartida) {
    const errorMensaje = document.createElement("p");
    errorMensaje.style.color = "red";
    errorMensaje.textContent = "❌ Error: falta idPartida.";
    contenedor.appendChild(errorMensaje);
    return contenedor;
  }

  const tipoJuegoMap = {
    1: "memoria",
    2: "adivina",
    3: "emoji",
    4: "fruta",
    5: "simondice"
  };

  let tipoJuego = ""; 
  let codigo_partida = "";
  let intervaloJugadores;

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

  const btn_inicio = document.createElement("button");
  btn_inicio.className = "btn_inicio";
  btn_inicio.textContent = "Iniciar";
  btn_inicio.disabled = true;

  let hayJugadores = false;

  async function cargarDatosPartida() {
    try {
      const res = await fetch(`${BASE_URL}/partidas/${idPartida}`);
      if (!res.ok) throw new Error("No se pudo obtener la partida");
      const partidaData = await res.json();

      codigo_partida = partidaData.codigo_partida;
      codigoLobby.textContent = codigo_partida;

      tipoJuego = tipoJuegoMap[partidaData.id_juego];
      console.log("Tipo de juego asignado:", tipoJuego);

      const resInfo = await fetch(`${BASE_URL}/partidas/codigo/${codigo_partida}`);
      if (!resInfo.ok) throw new Error("No se pudo obtener la info del juego");
      const info = await resInfo.json();

      nombreJuegoTexto.textContent = `Juego: ${info.nombre_juego || "Desconocido"}`;
      nombreNivelTexto.textContent = `Nivel: ${info.nombre_nivel || "Desconocido"}`;

      await cargarJugadores();
      intervaloJugadores = setInterval(cargarJugadores, 3000);

    } catch (error) {
      console.error("Error obteniendo datos de la partida:", error.message);
     
    }
  }

  async function cargarJugadores() {
    if (!tipoJuego) {
      console.warn("Tipo de juego no definido. No se cargan jugadores.");
      return;
    }

    try {
      const url = `${BASE_URL}/usuarios/${tipoJuego}/${idPartida}`;
      console.log("Fetch jugadores URL:", url);

      const res = await fetch(url);
      if (!res.ok) throw new Error(`No se pudieron obtener los jugadores, status: ${res.status}`);
      const jugadores = await res.json();
      console.log("Jugadores recibidos:", jugadores);

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

        const avatarImg = document.createElement("img");
        avatarImg.alt = `Avatar de ${jugador.nombre}`;
        avatarImg.src = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${jugador.id_avatar || jugador.avatar || "default"}&size=40`;
        avatarImg.style.width = "40px";
        avatarImg.style.height = "40px";
        avatarImg.style.marginRight = "10px";
        avatarImg.style.verticalAlign = "middle";

        const nombreSpan = document.createElement("span");
        nombreSpan.textContent = `${i + 1}. ${jugador.nombre || "Sin nombre"}`;

        divJugador.appendChild(avatarImg);
        divJugador.appendChild(nombreSpan);
        jugadoresContenedor.appendChild(divJugador);
      });

      btn_inicio.disabled = false;
      hayJugadores = true;

    } catch (error) {
      console.error("Error cargando jugadores:", error.message);
      jugadoresContenedor.innerHTML = "<p style='color:red;'>Error al cargar jugadores.</p>";
      btn_inicio.disabled = true;
      hayJugadores = false;
    }
  }

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

    // ✅ Mostrar pantalla de espera correctamente
    const contenedorEspera = espera(tiempoSeleccionado, tipoJuego, idPartida);
    document.body.innerHTML = "";
    document.body.appendChild(contenedorEspera);

  } catch (error) {
    console.error("Error al iniciar la partida:", error.message);
    alert("Ocurrió un error al iniciar la partida. Intenta nuevamente.");
  }
  });

  const tiempoSeleccionadoTexto = document.createElement("h2");
  tiempoSeleccionadoTexto.className = "tiempo-seleccionado";
  tiempoSeleccionadoTexto.textContent = `Duración: ${tiempoSeleccionado} minutos`;

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

  await cargarDatosPartida();

  return contenedor;
}

