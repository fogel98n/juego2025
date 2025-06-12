import { crearImagenLogin } from "./logo.js";
import { Header } from "./header.js";
import { juegos } from "./juegos.js";
import { Lobby } from "./lobby.js";

export function Niveles(juego) {
  const contenedor = document.createElement("div");
  contenedor.className = "contenedor-niveles";

  const header = Header();
  contenedor.appendChild(header);

  const tituloJuego = document.createElement("h1");
  tituloJuego.className = "titulo-niveles";
  tituloJuego.textContent = juego.texto;
  contenedor.appendChild(tituloJuego);

  const contenedorImagen = crearImagenLogin();
  contenedorImagen.classList.add("imagen-niveles");
  contenedor.appendChild(contenedorImagen);

  const descripcionJuego = document.createElement("p");
  descripcionJuego.className = "descripcion-juego";
  descripcionJuego.textContent = "Selecciona una opción para continuar.";
  contenedor.appendChild(descripcionJuego);

  const textosBotones = [
    "nivel2",
    "nivel3",
    "nivel1",
    "4m",
    "regresar",
    "2m",
    "iniciar",
    "6m"
  ];

  let tiempoSeleccionado = null;

  for (let i = 0; i < textosBotones.length; i++) {
    const boton = document.createElement("button");
    boton.className = `boton-nivel boton-nivel-${i + 1}`;
    boton.textContent = textosBotones[i];

    if (textosBotones[i] === "regresar") {
      boton.addEventListener("click", () => {
        const panelJuegos = juegos();
        document.body.innerHTML = "";
        document.body.appendChild(panelJuegos);
      });
    }

    if (["2m", "4m", "6m"].includes(textosBotones[i])) {
      boton.addEventListener("click", () => {
        tiempoSeleccionado = parseInt(textosBotones[i].slice(0, -1)); // Almacena el tiempo en minutos
        console.log(`Tiempo seleccionado: ${tiempoSeleccionado} minutos`);
      });
    }

    if (textosBotones[i] === "iniciar") {
      boton.addEventListener("click", () => {
        if (tiempoSeleccionado) {
          const panelLobby = Lobby(tiempoSeleccionado); // Pasa el tiempo en minutos al lobby
          document.body.innerHTML = "";
          document.body.appendChild(panelLobby);
        } else {
          alert("Por favor selecciona un tiempo antes de iniciar.");
        }
      });
    }

    contenedor.appendChild(boton);
  }

  return contenedor;
}