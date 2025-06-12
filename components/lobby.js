import { Header } from "./header.js";
import { espera } from "./espera.js";

function generarCodigoAleatorio(longitud) {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let codigo = "";
  for (let i = 0; i < longitud; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    codigo += caracteres[indiceAleatorio];
  }
  return codigo;
}

export function Lobby(tiempoSeleccionado) {
  const contendor = document.createElement("div");
  contendor.className = "contenedor-lobby";

  const tituloLobby = document.createElement("h1");
  tituloLobby.className = "titulo-lobby";
  tituloLobby.textContent = "¡Partida Creada!";

  const descripcionlobby = document.createElement("p");
  descripcionlobby.className = "descripcion";
  descripcionlobby.textContent = "Comparte este código con los participantes para que se unan al juego";

  const codigoLobby = document.createElement("h1");
  codigoLobby.className = "codigo-lobby";
  codigoLobby.textContent = generarCodigoAleatorio(8);

  const jugadoresTitulo = document.createElement("h2");
  jugadoresTitulo.className = "jugadores";
  jugadoresTitulo.textContent = "Jugadores";

  const jugadoresContenedor = document.createElement("div");
  jugadoresContenedor.className = "jugadores-contenedor";
  jugadoresContenedor.style.maxHeight = "200px"; // Limita la altura del contenedor
  jugadoresContenedor.style.overflowY = "auto"; // Habilita el scroll vertical

  const listaJugadores = [1, 2, 3, 4, 5];

  listaJugadores.forEach((numero) => {
    const jugadorDiv = document.createElement("div");
    jugadorDiv.className = "jugador-div";

    const jugadorNumero = document.createElement("p");
    jugadorNumero.className = "jugador-numero";
    jugadorNumero.textContent = `Jugador ${numero}`;

    jugadorDiv.appendChild(jugadorNumero);
    jugadoresContenedor.appendChild(jugadorDiv);
  });

  const tiempoSeleccionadoTexto = document.createElement("h2");
  tiempoSeleccionadoTexto.className = "tiempo-seleccionado";


  const btn_inicio = document.createElement("button");
  btn_inicio.className = "btn_inicio";
  btn_inicio.textContent = "Iniciar";

  btn_inicio.addEventListener("click", () => {
    const panelEspera = espera(tiempoSeleccionado); // Pasa el tiempo seleccionado al cronómetro
    document.body.innerHTML = ""; // Limpia el contenido actual
    document.body.appendChild(panelEspera); // Muestra el panel de espera
  });

  contendor.appendChild(Header());
  contendor.appendChild(tituloLobby);
  contendor.appendChild(descripcionlobby);
  contendor.appendChild(codigoLobby);
  contendor.appendChild(jugadoresTitulo);
  contendor.appendChild(jugadoresContenedor);
  contendor.appendChild(tiempoSeleccionadoTexto);
  contendor.appendChild(btn_inicio);

  return contendor;
}