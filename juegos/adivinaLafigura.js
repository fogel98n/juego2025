import { headerjuego } from "../components/headerJuego.js";
import { posiciones } from "../components/tablaposiciones.js";

export function adivinaLafigura(partida){
      console.log("objeto recibido",partida)

      const contenedor=document.createElement("section")
      contenedor.className="contenedor-adivinaLafigura"

      contenedor.appendChild(headerjuego())

      return contenedor

}