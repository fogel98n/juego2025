import { Header } from "./header.js";
import { Niveles } from "./niveles.js"; // Importa la función Niveles
import { BASE_URL } from "../config.js";

export function juegos() {
  const contenedor = document.createElement("div");
  contenedor.className = "contenedor-juegos";

  contenedor.appendChild(Header());

  const titulo = document.createElement("h1");
  titulo.className = "titulo-juegos";
  titulo.textContent = "¿Qué Jugaremos Hoy?";
  contenedor.appendChild(titulo);

  const contenedorCuadros = document.createElement("div");
  contenedorCuadros.className = "contenedor-cuadros";
  contenedor.appendChild(contenedorCuadros);

  // 🔁 Obtener los juegos desde la API
  fetch(`${BASE_URL}/juegos`)
    .then(res => res.json())
    .then(juegos => {
      juegos.forEach((juego, index) => {
        const contenedorJuego = document.createElement("div");
        contenedorJuego.className = "contenedor-juego";

        const cuadro = document.createElement("div");
        cuadro.className = "cuadro-juego";

        const contenedorImagenExterno = document.createElement("div");
        contenedorImagenExterno.className = "contenedor-imagen-externo";

        const contenedorImagenInterno = document.createElement("div");
        contenedorImagenInterno.className = "contenedor-imagen-interno";

        const imagen = document.createElement("img");
        imagen.src = `./media/juego${index + 1}.jpg`; // 🖼 Usa imagen en orden
        imagen.className = "imagen-juego";

        contenedorImagenInterno.appendChild(imagen);
        contenedorImagenExterno.appendChild(contenedorImagenInterno);
        cuadro.appendChild(contenedorImagenExterno);

        const texto = document.createElement("p");
        texto.className = "texto-juego";
        texto.textContent = juego.nombre;

        cuadro.addEventListener("click", () => {
          const panelNiveles = Niveles({ texto: juego.nombre }); // Pasar nombre como texto
          document.body.innerHTML = "";
          document.body.appendChild(panelNiveles);
        });

        contenedorJuego.appendChild(cuadro);
        contenedorJuego.appendChild(texto);
        contenedorCuadros.appendChild(contenedorJuego);
      });
    })
    .catch(err => {
      console.error("Error al cargar los juegos:", err);
      const errorMsg = document.createElement("p");
      errorMsg.textContent = "No se pudieron cargar los juegos.";
      contenedor.appendChild(errorMsg);
    });

  return contenedor;
}
