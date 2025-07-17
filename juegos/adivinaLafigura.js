import { headerjuego } from "../components/headerJuego.js";
import { posicionesAdivina } from "../components/posicionesAdivina.js"; 
import { BASE_URL } from "../config.js";

export function adivinaLafigura(partida) {
  console.log("objeto recibido", partida);

  const contenedor = document.createElement("section");
  contenedor.className = "contenedor-adivinaLafigura";

  const header = headerjuego(partida.nombre_nivel || "Nivel");
  contenedor.appendChild(header);

  const estrellas = header.querySelectorAll(".estrella");

  const contenedorInfo = document.createElement("div");
  contenedorInfo.className = "contenedor-info-juego";

  const tiempoDiv = document.createElement("div");
  tiempoDiv.className = "tiempo-partida";

  const intentosDiv = document.createElement("div");
  intentosDiv.className = "intentos-restantes";

  let intentosFallidos = 0;
  let intentosRestantes = 3;
  intentosDiv.textContent = `Intentos: ${intentosRestantes}`;

  contenedorInfo.appendChild(tiempoDiv);
  contenedorInfo.appendChild(intentosDiv);
  contenedor.appendChild(contenedorInfo);

  const pregunta = document.createElement("h3");
  pregunta.className = "pregunta-adivina";
  contenedor.appendChild(pregunta);

  const contenedorFiguras = document.createElement("div");
  contenedorFiguras.className = "contenedor-figuras";
  contenedor.appendChild(contenedorFiguras);

  let tiempoRestante = partida.duracion_minutos * 60;
  let timerId = null;

  let aciertos = 0;
  let tiempoUsado = 0;

  function actualizarTiempo() {
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;
    tiempoDiv.textContent = `Tiempo: ${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;

    if (tiempoRestante > 0) {
      tiempoRestante--;
      tiempoUsado++;
      timerId = setTimeout(actualizarTiempo, 1000);
    } else {
      tiempoDiv.textContent = "⏰Tiempo finalizado";
      mostrarEmergente("Fin del juego", "⏰ Tiempo agotado. 😢", false);
      contenedorFiguras.innerHTML = "";
      enviarResultado("abandonada");
    }
  }

  actualizarTiempo();

  const preguntas = [
    { texto: "Selecciona el cuadrado", respuesta: "cuadrado" },
    { texto: "Selecciona la figura que tiene dos lados rectos", respuesta: "trapecio" },
    { texto: "Selecciona el triángulo isósceles", respuesta: "trianguloisosceles" },
  ];

  let indice = 0;

  function cargarPregunta() {
    contenedorFiguras.innerHTML = "";

    if (indice >= preguntas.length) {
      pregunta.textContent = "🎉 ¡Felicidades! Completaste el juego.";
      clearTimeout(timerId);
      mostrarEmergente("¡Bien hecho!", "🎉 ¡Completaste todas las preguntas!", true);
      enviarResultado("finalizada");
      return;
    }

    const actual = preguntas[indice];
    pregunta.textContent = actual.texto;

    const opciones = mezclarFiguras(actual.respuesta);

    opciones.forEach((f) => {
      const wrapper = document.createElement("div");
      wrapper.className = "figura-contenedor";

      const figura = crearFigura(f.clase);
      figura.title = f.descripcion;

      figura.addEventListener("click", () => {
        if (f.clase === actual.respuesta) {
          aciertos++;
          mostrarRondaSuperada(indice + 1);
        } else {
          mostrarEmergente("❌ Incorrecto", "Intenta nuevamente", false);
          if (intentosFallidos < estrellas.length) {
            estrellas[intentosFallidos].style.backgroundColor = "yellow";
          }
          intentosFallidos++;
          intentosRestantes--;
          intentosDiv.textContent = `Intentos: ${intentosRestantes}`;

          if (intentosFallidos >= 3) {
            pregunta.textContent = "💀 Game Over. Has fallado 3 veces.";
            contenedorFiguras.innerHTML = "";
            clearTimeout(timerId);
            mostrarEmergente("Game Over", "Has fallado 3 veces. 😔", false);
            enviarResultado("abandonada");
          }
        }
      });

      wrapper.appendChild(figura);
      contenedorFiguras.appendChild(wrapper);
    });
  }

  function mostrarRondaSuperada(ronda) {
    mostrarEmergente(
      "¡Ronda superada!",
      `¡Has superado la ronda ${ronda}! 🎉`,
      true
    );

    const botonContinuar = document.querySelector(".emergente button");
    if (botonContinuar) {
      botonContinuar.onclick = () => {
        document.querySelector(".emergente-fondo").remove();
        indice++;
        intentosFallidos = 0;
        intentosRestantes = 3;
        intentosDiv.textContent = `Intentos: ${intentosRestantes}`;
        resetearEstrellas();
        cargarPregunta();
      };
    }
  }

  function resetearEstrellas() {
    estrellas.forEach((e) => (e.style.backgroundColor = ""));
  }

  async function enviarResultado(estado) {
    if (!partida.id_usuario || !partida.id_partida) return;

    try {
      const res = await fetch(`${BASE_URL}/adivina/guardarresultado`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: partida.id_usuario,
          id_partida: partida.id_partida,
          puntuacion: aciertos,
          intentos: intentosFallidos,
          tiempo: tiempoUsado,
          estado,
        }),
      });

      if (!res.ok) {
        console.error("❌ Error al enviar resultado:", await res.text());
      } else {
        console.log("✅ Resultado enviado correctamente");
        document.body.innerHTML = "";
        const posiciones = posicionesAdivina(partida);
        document.body.appendChild(posiciones);
      }
    } catch (error) {
      console.error("❌ Error en fetch al enviar resultado:", error);
    }
  }

  cargarPregunta();

  return contenedor;
}

export function crearFigura(tipo) {
  const figura = document.createElement("div");
  figura.classList.add("figura", tipo.toLowerCase());
  return figura;
}

const figuras = [
  { nombre: "Cuadrado", clase: "cuadrado", descripcion: "Tiene 4 lados iguales y 4 ángulos rectos" },
  { nombre: "Rectángulo", clase: "rectangulo", descripcion: "Tiene lados opuestos iguales" },
  { nombre: "Círculo", clase: "circulo", descripcion: "No tiene lados" },
  { nombre: "Triángulo Equilátero", clase: "trianguloequilatero", descripcion: "3 lados iguales" },
  { nombre: "Triángulo Isósceles", clase: "trianguloisosceles", descripcion: "2 lados iguales" },
  { nombre: "Triángulo Escaleno", clase: "trianguloescaleno", descripcion: "Lados diferentes" },
  { nombre: "Rombo", clase: "rombo", descripcion: "4 lados iguales, ángulos oblicuos" },
  { nombre: "Óvalo", clase: "ovalo", descripcion: "Curva cerrada alargada" },
  { nombre: "Trapecio", clase: "trapecio", descripcion: "Tiene un par de lados paralelos" },
  { nombre: "Pentágono", clase: "pentagono", descripcion: "5 lados" },
  { nombre: "Hexágono", clase: "hexagono", descripcion: "6 lados" },
];

function mezclarFiguras(respuestaCorrecta) {
  const otras = figuras.filter((f) => f.clase !== respuestaCorrecta);
  const aleatorias = otras.sort(() => 0.5 - Math.random()).slice(0, 2);
  const correcta = figuras.find((f) => f.clase === respuestaCorrecta);
  const opciones = [...aleatorias, correcta];
  return opciones.sort(() => 0.5 - Math.random());
}

function mostrarEmergente(titulo, mensaje, exito = true) {
  const fondo = document.createElement("div");
  fondo.className = "emergente-fondo";

  const caja = document.createElement("div");
  caja.className = "emergente";
  caja.style.backgroundColor = "#584796";
  caja.innerHTML = `
    <h3>${titulo}</h3>
    <p>${mensaje}</p>
    <button>Continuar</button>
  `;

  fondo.appendChild(caja);
  document.body.appendChild(fondo);

  caja.querySelector("button").addEventListener("click", () => {
    fondo.remove();
  });
}
