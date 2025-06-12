import { Header } from "./header.js";

export function espera(tiempoInicial) {
  const contenedor = document.createElement("div");
  contenedor.className = "contenedor-espera";

  const tituloTiempo = document.createElement("h2");
  tituloTiempo.className = "titulo-tiempo";
  tituloTiempo.textContent = "Tiempo ";

  const tiempoRestante = document.createElement("h1");
  tiempoRestante.className = "tiempo-restante";
  tiempoRestante.textContent = formatTime(tiempoInicial * 60);

  const contendor_puestos=document.createElement("div")
  contendor_puestos.className="contenedor-puestos"

  const curso=document.createElement("h2")
  curso.className="en-curso"
  curso.textContent="En curso"
  contendor_puestos.appendChild(curso)

  const finalizado=document.createElement("h2")
  finalizado.className="finalizado"
  finalizado.textContent="Finalizado"
  contendor_puestos.appendChild(finalizado)


  contenedor.appendChild(Header());
  contenedor.appendChild(tituloTiempo);
  contenedor.appendChild(tiempoRestante);
  contenedor.appendChild(contendor_puestos)
  let tiempo = tiempoInicial * 60;

  const intervalo = setInterval(() => {
    tiempo--;
    tiempoRestante.textContent = formatTime(tiempo);

    if (tiempo <= 0) {
      clearInterval(intervalo);
      tiempoRestante.textContent = "00:00";
    }
  }, 1000);

  return contenedor;
}

function formatTime(segundos) {
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;
  const minutosFormateados = minutos.toString().padStart(2, "0");
  const segundosFormateados = segundosRestantes.toString().padStart(2, "0");
  return `${minutosFormateados}:${segundosFormateados}`;
}
