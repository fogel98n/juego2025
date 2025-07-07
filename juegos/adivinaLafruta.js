import { headerjuego } from "../components/headerJuego.js";
import { posicionesAdivinaLafruta } from "../components/posicionesadivinaLafruta.js";
import { BASE_URL } from "../config.js";

export function adivinaLafruta(partida) {
  console.log("objeto recibido", partida);

  const frutasPorNivel = [
    [
      {
        nombre: "Manzana",
        imagen: "/media/manzana.png",
        pregunta: "¿Cuál de estas frutas es roja y muy común?"
      },
      {
        nombre: "Banano",
        imagen: "/media/banano.jpg",
        pregunta: "¿Cuál de estas frutas es amarilla y curva?"
      },
      {
        nombre: "Naranja",
        imagen: "/media/naranja.jpeg",
        pregunta: "¿Cuál fruta es redonda, jugosa y rica en vitamina C?"
      }
    ],
    [
      {
        nombre: "Sandía",
        imagen: "/media/sandia.png",
        pregunta: "¿Cuál fruta es grande, verde por fuera y roja por dentro?"
      },
      {
        nombre: "Uvas",
        imagen: "/media/uvas.jpeg",
        pregunta: "¿Cuál fruta crece en racimos y puede ser morada o verde?"
      },
      {
        nombre: "Fresa",
        imagen: "/media/fresa.jpeg",
        pregunta: "¿Cuál fruta es pequeña, roja y tiene semillas por fuera?"
      }
    ],
    [
      {
        nombre: "Granada",
        imagen: "/media/granada.jpeg",
        pregunta: "¿Cuál fruta tiene granos rojos jugosos en su interior?"
      },
      {
        nombre: "Kiwi",
        imagen: "/media/kiwi.jpeg",
        pregunta: "¿Cuál fruta es marrón por fuera y verde por dentro con semillas negras?"
      },
      {
        nombre: "Higo",
        imagen: "/media/higo.jpeg",
        pregunta: "¿Cuál fruta es pequeña, morada y muy dulce por dentro?"
      }
    ]
  ];

  // Determinar nivel
  const nivelString = partida.nombre_nivel || "nivel1";
  const nivelIndex = Math.max(0, Math.min(2, parseInt(nivelString.replace(/\D/g, ""), 10) - 1));
  const frutas = frutasPorNivel[nivelIndex];

  // Crear contenedor principal
  const contenedor = document.createElement("section");
  contenedor.className = "contenedor-adivina-lafruta";

  const header = headerjuego(partida.nombre_nivel || "Nivel");
  contenedor.appendChild(header);

  const contenedorInfo = document.createElement("div");
  contenedorInfo.className = "contenedor-info-juego";

  const tiempoDiv = document.createElement("div");
  tiempoDiv.className = "tiempo-partida";

  const intentosDiv = document.createElement("div");
  intentosDiv.className = "intentos-restantes";

  contenedorInfo.appendChild(tiempoDiv);
  contenedorInfo.appendChild(intentosDiv);
  contenedor.appendChild(contenedorInfo);

  const pregunta = document.createElement("h2");
  pregunta.className = "pregunta-fruta";
  contenedor.appendChild(pregunta);

  const contenedorOpciones = document.createElement("div");
  contenedorOpciones.className = "opciones-frutas";
  contenedor.appendChild(contenedorOpciones);

  // Variables de control
  let rondaActual = 1;
  const rondasTotales = 3;
  let aciertos = 0;
  let intentos = 0;
  let intentosRestantes = 3;
  let frutaCorrecta = null;

  const tiempoMax = partida.duracion_minutos ? partida.duracion_minutos * 60 : 60;
  let tiempoRestante = tiempoMax;
  let tiempoUsado = 0;
  let timerId = null;

  function actualizarTiempo() {
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;
    tiempoDiv.textContent = `⏱ Tiempo: ${minutos.toString().padStart(2, "0")}:${segundos
      .toString()
      .padStart(2, "0")}`;

    if (tiempoRestante > 0) {
      tiempoRestante--;
      tiempoUsado++;
      timerId = setTimeout(actualizarTiempo, 1000);
    } else {
      tiempoDiv.textContent = "⏰ Tiempo agotado";
      guardarResultado("abandonada");
    }
  }

  actualizarTiempo();
  intentosDiv.textContent = `Intentos: ${intentosRestantes}`;

  function siguienteRonda() {
    contenedorOpciones.innerHTML = "";

    const opciones = [...frutas].sort(() => 0.5 - Math.random()).slice(0, 3);
    frutaCorrecta = opciones[Math.floor(Math.random() * opciones.length)];

    pregunta.textContent = `Ronda ${rondaActual}: ${frutaCorrecta.pregunta}`;

    opciones.forEach((fruta) => {
      const wrapper = document.createElement("div");
      wrapper.className = "fruta-contenedor";

      const img = document.createElement("img");
      img.src = fruta.imagen;
      img.alt = fruta.nombre;
      img.className = "img-fruta";

      img.addEventListener("click", () => {
        intentos++;
        if (fruta.nombre === frutaCorrecta.nombre) {
          aciertos++;
          img.style.border = "3px solid green";
        } else {
          intentosRestantes--;
          img.style.border = "3px solid red";
        }

        intentosDiv.textContent = `Intentos: ${intentosRestantes}`;

        setTimeout(() => {
          if (intentosRestantes <= 0) {
            clearTimeout(timerId);
            guardarResultado("abandonada");
          } else if (rondaActual < rondasTotales) {
            rondaActual++;
            siguienteRonda();
          } else {
            clearTimeout(timerId);
            guardarResultado("finalizada");
          }
        }, 800);
      });

      wrapper.appendChild(img);
      contenedorOpciones.appendChild(wrapper);
    });
  }

  function guardarResultado(estado = "finalizada") {
    const datos = {
      id_usuario: partida.id_usuario,
      id_partida: partida.id_partida,
      aciertos,
      intentos_fallidos: intentos - aciertos,
      tiempo: tiempoUsado,
      estado
    };

    console.log("📤 Enviando resultado fruta:", datos);

    fetch(`${BASE_URL}/frutas/guardarresultado`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    })
      .then((res) => res.json())
      .then(() => {
        contenedor.innerHTML = "";
        const panelPosiciones = posicionesAdivinaLafruta(partida);
        contenedor.appendChild(panelPosiciones);
      })
      .catch((err) => {
        console.error("❌ Error al guardar resultado:", err);
      });
  }

  siguienteRonda();
  return contenedor;
}
