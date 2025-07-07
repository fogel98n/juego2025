import { inicio } from "./inicio.js";
import { tarjeta } from "./tarjeta.js";

export function botones() {
  const contenedor = document.createElement("div");
  contenedor.className = "contenedor-botones";

  const texto = ["ver tarjeta", "nueva partida"];

  texto.forEach((textoBtn, i) => {
    const boton = document.createElement("button");
    boton.textContent = textoBtn;
    boton.className = `boton-${i + 1}`;

    boton.addEventListener("click", async () => {
      // Limpia todo el body
      document.body.innerHTML = "";

      if (i === 0) {
        // Ver tarjeta
        const panelTarjeta = tarjeta();
        document.body.appendChild(panelTarjeta);
      } else if (i === 1) {
        // Nueva partida
        const panelInicio = await inicio();
        document.body.appendChild(panelInicio);
      }
    });

    contenedor.appendChild(boton);
  });

  return contenedor;
}


