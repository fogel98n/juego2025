import { inicio } from "./inicio.js";

export function tarjeta() {
  const contenedor = document.createElement("section");
  contenedor.className = "contenedor-tarjeta";

  const titulo = document.createElement("h1");
  titulo.className = "titulo-tarjeta";
  titulo.textContent = "¡Gracias por Jugar!";
  contenedor.appendChild(titulo);

  const recuadroimg = document.createElement("div");
  recuadroimg.className = "contenedor-img";

  const img = document.createElement("img");
  img.src = "./media/targeta.jpg";
  img.alt = "Gracias por jugar";
  img.className = "imagen-tarjeta";

  recuadroimg.appendChild(img);
  contenedor.appendChild(recuadroimg);

  const botonNuevaPartida = document.createElement("button");
  botonNuevaPartida.className = "btn-nueva-partida";
  botonNuevaPartida.textContent = "Nueva partida";

  botonNuevaPartida.addEventListener("click", async () => {
    document.body.innerHTML = "";
    const panel = await inicio();
    document.body.appendChild(panel);
  });

  contenedor.appendChild(botonNuevaPartida);

  return contenedor;
}
