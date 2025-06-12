import { Header } from "./header.js";
import { Niveles } from "./niveles.js"; // Importa la función Niveles

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

  const juegosData = [
    { src: "./media/juego1.jpg", texto: "memoria" },
    { src: "./media/juego2.jpg", texto: "advina la figura" },
    { src: "./media/juego3.jpg", texto: "Emoji game" },
    { src: "./media/juego4.jpg", texto: "adivina la fruta" },
    { src: "./media/juego5.jpg", texto: "simon dice" },
  ];

  juegosData.forEach((juego) => {
    const contenedorJuego = document.createElement("div");
    contenedorJuego.className = "contenedor-juego";

    const cuadro = document.createElement("div");
    cuadro.className = "cuadro-juego";

    const contenedorImagenExterno = document.createElement("div");
    contenedorImagenExterno.className = "contenedor-imagen-externo";

    const contenedorImagenInterno = document.createElement("div");
    contenedorImagenInterno.className = "contenedor-imagen-interno";

    const imagen = document.createElement("img");
    imagen.src = juego.src;
    imagen.className = "imagen-juego";

    contenedorImagenInterno.appendChild(imagen);
    contenedorImagenExterno.appendChild(contenedorImagenInterno);
    cuadro.appendChild(contenedorImagenExterno);

    const texto = document.createElement("p");
    texto.className = "texto-juego";
    texto.textContent = juego.texto;

    cuadro.addEventListener("click", () => {
      const panelNiveles = Niveles(juego); // Pasa el objeto completo del juego
      document.body.innerHTML = ""; // Limpia el contenido actual
      document.body.appendChild(panelNiveles); // Muestra el panel de niveles
    });

    contenedorJuego.appendChild(cuadro);
    contenedorJuego.appendChild(texto);
    contenedorCuadros.appendChild(contenedorJuego);
  });

  contenedor.appendChild(contenedorCuadros);

  return contenedor;
}