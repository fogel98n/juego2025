import { crearImagenLogin } from "./logo.js";
import { Header } from "./header.js";
import { juegos } from "./juegos.js";
import { Lobby } from "./lobby.js";
import { BASE_URL } from "../config.js";

export function Niveles(juego) {
  const contenedor = document.createElement("div");
  contenedor.className = "contenedor-niveles";

  contenedor.appendChild(Header());

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
  let nivelSeleccionado = null;

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
        tiempoSeleccionado = parseInt(textosBotones[i].slice(0, -1));
        console.log(`Tiempo seleccionado: ${tiempoSeleccionado} minutos`);
      });
    }

    if (["nivel1", "nivel2", "nivel3"].includes(textosBotones[i])) {
      boton.addEventListener("click", () => {
        nivelSeleccionado = textosBotones[i];
        console.log(`Nivel seleccionado: ${nivelSeleccionado}`);
      });
    }

    if (textosBotones[i] === "iniciar") {
      boton.addEventListener("click", async () => {
        if (!tiempoSeleccionado || !nivelSeleccionado) {
          alert("Por favor selecciona un nivel y un tiempo antes de iniciar.");
          return;
        }

        try {
          // Obtener juegos desde backend
          const resJuegos = await fetch(`${BASE_URL}/juegos`);
          if (!resJuegos.ok) throw new Error("Error al obtener juegos");
          const juegosData = await resJuegos.json();

          // Buscar el juego seleccionado (ignora mayúsculas)
          const juegoEncontrado = juegosData.find(
            (j) => j.nombre.toLowerCase() === juego.texto.toLowerCase()
          );

          if (!juegoEncontrado) {
            alert("Juego no encontrado en la base de datos.");
            return;
          }

          const id_juego = juegoEncontrado.id;

          // Obtener niveles desde backend filtrando por id_juego
          const resNiveles = await fetch(`${BASE_URL}/niveles?id_juego=${id_juego}`);
          if (!resNiveles.ok) throw new Error("Error al obtener niveles");
          const nivelesData = await resNiveles.json();

          // Buscar el nivel seleccionado por nombre exacto (ignora mayúsculas)
          const nivelEncontrado = nivelesData.find(
            (n) => n.nombre.toLowerCase() === nivelSeleccionado.toLowerCase()
          );

          if (!nivelEncontrado) {
            alert("Nivel no encontrado para este juego.");
            return;
          }

          const id_nivel = nivelEncontrado.id;

          // Crear partida enviando POST al backend
          const resPartida = await fetch(`${BASE_URL}/partidas`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id_juego,
              id_nivel,
              duracion_minutos: tiempoSeleccionado,
            }),
          });

          if (!resPartida.ok) {
            alert("Error al crear la partida.");
            return;
          }

          const nuevaPartida = await resPartida.json();
          console.log("Partida creada:", nuevaPartida);

          // Mostrar pantalla Lobby, PASANDO id de la partida y tiempo seleccionado
          const panelLobby = await Lobby(tiempoSeleccionado, nuevaPartida.id);
          document.body.innerHTML = "";
          document.body.appendChild(panelLobby);

        } catch (error) {
          console.error("Error al iniciar partida:", error);
          alert("Hubo un error al crear la partida.");
        }
      });
    }

    contenedor.appendChild(boton);
  }

  return contenedor;
}
