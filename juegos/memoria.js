import { headerjuego } from "../components/headerJuego.js";
import { posiciones } from "../components/tablaposiciones.js";
import { BASE_URL } from "../config.js";

export function memoria(partida) {
  console.log("🧠 Objeto partida recibido:", partida);

  const contenedor = document.createElement("section");
  contenedor.className = "contenedor-memoria";

  const contenedorInfo = document.createElement("div");
  contenedorInfo.className = "contenedor-info";

  const aciertosDiv = document.createElement("div");
  aciertosDiv.className = "aciertos";
  aciertosDiv.textContent = "Aciertos: 0";

  const tiempoDiv = document.createElement("div");
  tiempoDiv.className = "tiempo-partida";

  const movimientosDiv = document.createElement("div");
  movimientosDiv.className = "movimientos";
  movimientosDiv.textContent = "Movimientos: 0";

  contenedorInfo.appendChild(aciertosDiv);
  contenedorInfo.appendChild(tiempoDiv);
  contenedorInfo.appendChild(movimientosDiv);

  const contenido = document.createElement("div");
  contenido.className = "contenido-juego";
  contenido.appendChild(contenedorInfo);

  const tiempoTotal = (partida.duracion_minutos || 1) * 60;
  let tiempoRestante = tiempoTotal;
  let timerId = null;

  function actualizarTiempo() {
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;
    tiempoDiv.textContent = `⏱ Tiempo: ${minutos.toString().padStart(2, "0")}:${segundos
      .toString()
      .padStart(2, "0")}`;

    if (tiempoRestante > 0) {
      tiempoRestante--;
      timerId = setTimeout(actualizarTiempo, 1000);
    } else {
      tiempoDiv.textContent = "⏰ Tiempo agotado";
    }
  }

  actualizarTiempo();

  const panelJuego = crearJuegoMemoria(
    partida,
    aciertosDiv,
    movimientosDiv,
    () => tiempoRestante,
    () => clearTimeout(timerId)
  );

  contenido.appendChild(panelJuego);

  contenedor.appendChild(headerjuego(partida.nombre_nivel || "Nivel"));
  contenedor.appendChild(contenido);

  return contenedor;
}

function crearJuegoMemoria(partida, aciertosRef, movimientosRef, getTiempoRestante, limpiarTimer) {
  const contenedor = document.createElement("section");
  contenedor.className = "juego-memoria";

  const imagenes = [
    "mounstro1.jpg",
    "mounstro2.jpg",
    "mounstro3.jpeg",
    "mounstro4.jpeg",
    "mounstro5.jpeg",
    "mounstro6.jpeg",
  ];

  const nombreNivel = partida.nombre_nivel;
  const pares = nombreNivel === "nivel3" ? 6 : nombreNivel === "nivel2" ? 4 : 3;

  const seleccionadas = imagenes.slice(0, pares);
  const cartas = [...seleccionadas, ...seleccionadas].map((img, i) => ({
    id: i,
    img: `./media/${img}`,
    descubierta: false,
  }));

  cartas.sort(() => Math.random() - 0.5);

  const tablero = document.createElement("div");
  tablero.className = `tablero nivel-${pares}`;

  let primeraCarta = null;
  let bloqueado = false;
  let aciertos = 0;
  let movimientos = 0;

  cartas.forEach((cartaData) => {
    const carta = document.createElement("div");
    carta.className = "carta";

    const imgFrente = document.createElement("img");
    imgFrente.className = "img-frente";
    imgFrente.src = cartaData.img;

    const reverso = document.createElement("div");
    reverso.className = "img-reverso";

    carta.appendChild(imgFrente);
    carta.appendChild(reverso);

    carta.addEventListener("click", () => {
      if (bloqueado || carta.classList.contains("descubierta")) return;

      carta.classList.add("descubierta");

      if (!primeraCarta) {
        primeraCarta = { elemento: carta, img: cartaData.img };
      } else {
        bloqueado = true;
        movimientos++;
        movimientosRef.textContent = `Movimientos: ${movimientos}`;

        if (primeraCarta.img === cartaData.img) {
          aciertos++;
          aciertosRef.textContent = `Aciertos: ${aciertos}`;
          primeraCarta = null;
          bloqueado = false;

          if (aciertos === pares) {
            limpiarTimer();

            setTimeout(() => {
              const tiempoUsado = partida.duracion_minutos * 60 - getTiempoRestante();
              const puntuacion = calcularPuntuacion(tiempoUsado, movimientos);

              const data = {
                id_usuario: partida.id_usuario,
                id_partida: partida.id_partida,
                movimientos,
                tiempo_usado: tiempoUsado,
                puntuacion,
                estado: "finalizada",
              };

              console.log("📤 Enviando resultado:", data);

              fetch(`${BASE_URL}/guardaresultado`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              })
                .then((res) => res.json())
                .then(() => {
                  document.body.innerHTML = "";
                  const panel = posiciones(partida);
                  document.body.appendChild(panel);
                })
                .catch((err) => {
                  console.error("❌ Error al guardar resultado:", err);
                });
            }, 400);
          }
        } else {
          setTimeout(() => {
            carta.classList.remove("descubierta");
            primeraCarta.elemento.classList.remove("descubierta");
            primeraCarta = null;
            bloqueado = false;
          }, 800);
        }
      }
    });

    tablero.appendChild(carta);
  });

  contenedor.appendChild(tablero);
  return contenedor;
}

function calcularPuntuacion(tiempo, movimientos) {
  const base = 1000;
  const penalidadTiempo = tiempo * 2;
  const penalidadMov = movimientos * 5;
  return Math.max(0, base - penalidadTiempo - penalidadMov);
}
