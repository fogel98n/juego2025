import { BASE_URL } from "../config.js";

export function avatares(onSeleccionar) {
  const contenedor = document.createElement("div");
  contenedor.className = "contenedor-avatar";

  // Mostrar mensaje de carga
  const cargando = document.createElement("p");
  cargando.textContent = "Cargando avatares...";
  contenedor.appendChild(cargando);

  fetch(`${BASE_URL}/avatares`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error al cargar avatares");
      }
      return res.json();
    })
    .then((avatares) => {
      console.log("Avatares recibidos:", avatares); // <- log para debug
      contenedor.innerHTML = ""; // Limpia el mensaje de carga

      avatares.forEach((avatar) => {
        const img = document.createElement("img");
        img.src = avatar.url_imagen;
        img.alt = `Avatar ${avatar.nombre}`;
        img.className = "avatar-imagen";
        img.style.cursor = "pointer";

        img.addEventListener("click", () => {
          const seleccionados = contenedor.querySelectorAll(".avatar-imagen.seleccionado");
          seleccionados.forEach((el) => el.classList.remove("seleccionado"));
          img.classList.add("seleccionado");
          if (typeof onSeleccionar === "function") {
            onSeleccionar(avatar.id);
          }
        });

        contenedor.appendChild(img);
      });

      if (avatares.length === 0) {
        contenedor.textContent = "No hay avatares disponibles.";
      }
    })
    .catch((error) => {
      contenedor.innerHTML = `<p>Error al cargar avatares: ${error.message}</p>`;
      console.error(error);
    });

  return contenedor;
}

