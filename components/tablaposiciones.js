import { usuario } from "./usuario.js";

export function posiciones() {
  document.body.innerHTML = ""; 

  const contenedor = document.createElement("div");
  contenedor.className = "posiciones-contenedor";

  const titulo = document.createElement("h1");
  titulo.textContent = "🏆 Resultados Finales";
  titulo.className = "titulo-resultados";

  const tabla = document.createElement("div");
  tabla.className = "posiciones-tabla";

  fetch("http://localhost:5000/obteneresultados")
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        const sinResultados = document.createElement("p");
        sinResultados.textContent = "No hay resultados aún.";
        tabla.appendChild(sinResultados);
        return;
      }

      data.forEach((jugador, index) => {
        const fila = document.createElement("div");
        fila.className = "posiciones-fila";

        const posicion = document.createElement("span");
        posicion.className = "posicion-numero";
        posicion.textContent = `#${index + 1}`;

        const nombre = document.createElement("span");
        nombre.className = "posicion-nombre";
        nombre.textContent = jugador.nombre || "Jugador";

        const puntos = document.createElement("span");
        puntos.className = "posicion-puntos";
        puntos.textContent = `${jugador.puntuacion} pts`;

        fila.appendChild(posicion);
        fila.appendChild(nombre);
        fila.appendChild(puntos);

        tabla.appendChild(fila);
      });
    })
    .catch(err => {
      console.error("Error al obtener resultados:", err);
      const error = document.createElement("p");
      error.textContent = "Hubo un error al cargar los resultados.";
      tabla.appendChild(error);
    });

  contenedor.appendChild(titulo);
  contenedor.appendChild(tabla);
  contenedor.appendChild(btnsposiciones());

  document.body.appendChild(contenedor);
}

function btnsposiciones() {
  const contenedor = document.createElement("div");
  contenedor.className = "contenedor-btns";

  const nombresBotones = [
    "Descargar Resultados",
    "Descargar Tarjeta",
    "Nueva Partida"
  ];

  nombresBotones.forEach(nombre => {
    const btn = document.createElement("button");
    btn.textContent = nombre;
    btn.className = `btn-${nombre.toLowerCase().replace(/\s+/g, "-")}`;

    if (nombre === "Nueva Partida") {
      btn.addEventListener("click", () => {
        const partida = {
          codigo_partida: "ABC123" 
        };

        document.body.innerHTML = "";
        document.body.appendChild(usuario(partida));
      });
    }

    contenedor.appendChild(btn);
  });

  return contenedor;
}
