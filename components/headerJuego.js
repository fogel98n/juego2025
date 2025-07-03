export function headerjuego(nivelSeleccionado = "Nivel 1") {
    const header = document.createElement("header");
    header.className = "headerjuego";
  
    // Título a la izquierda
    const titulo = document.createElement("h2");
    titulo.className = "titulo";
    titulo.textContent = "MARTINI’S GAME";
  
    // Nivel centrado
    const nivel = document.createElement("div");
    nivel.className = "nivel-juego";
    nivel.textContent = nivelSeleccionado;
  
    // Estrellas a la derecha
    const contenedorEstrellas = document.createElement("div");
    contenedorEstrellas.className = "contenedor-estrellas";
  
    for (let i = 0; i < 3; i++) {
      const estrella = document.createElement("div");
      estrella.className = "estrella";
      contenedorEstrellas.appendChild(estrella);
    }
  
    header.appendChild(titulo);
    header.appendChild(nivel);
    header.appendChild(contenedorEstrellas);
  
    return header;
  }
  