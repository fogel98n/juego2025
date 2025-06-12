export function crearImagenLogin() {
  const contenedor_imagen = document.createElement("div");
  contenedor_imagen.className = "contenedor-imagen";

  const contenedor_morado = document.createElement("div");
  contenedor_morado.className = "contenedor-morado";

  const contenedor_blanco = document.createElement("div");
  contenedor_blanco.className = "contenedor-blanco";

  const imagen = document.createElement("img");
  imagen.src = "./media/logo_login.png";
  imagen.alt = "";
  imagen.className = "imagen-login";

  contenedor_blanco.appendChild(imagen);
  contenedor_morado.appendChild(contenedor_blanco);
  contenedor_imagen.appendChild(contenedor_morado);

  return contenedor_imagen;
}