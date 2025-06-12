import { juegos } from "./juegos.js";
import { crearImagenLogin } from "./logo.js"; 
import { Header } from "./header.js";
export function Login() {
  const contenedor = document.createElement("div");
  contenedor.className = "contenedor-login";

 

  const encabezadoLogin = document.createElement("h2");
  encabezadoLogin.className = "encabezado-login";
  encabezadoLogin.textContent = "Login";

  const labelCorreo = document.createElement("label");
  labelCorreo.className = "label-correo";
  labelCorreo.textContent = "Correo";

  const inputCorreo = document.createElement("input");
  inputCorreo.type = "email";
  inputCorreo.className = "input-correo";

  const labelContrasena = document.createElement("label");
  labelContrasena.className = "label-contrasena";
  labelContrasena.textContent = "Contraseña";

  const inputContrasena = document.createElement("input");
  inputContrasena.type = "password";
  inputContrasena.className = "input-contrasena";

  const botonLogin = document.createElement("button");
  botonLogin.className = "boton-login";
  botonLogin.textContent = "Ingresar";

  botonLogin.addEventListener("click", async () => {
    const correo = inputCorreo.value.trim();
    const contrasena = inputContrasena.value.trim();

    if (!correo || !contrasena) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, contrasena }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        const panelJuegos = juegos(); 
        document.body.innerHTML = ""; 
        document.body.appendChild(panelJuegos); 
      } else {
        alert(data.message || "Credenciales inválidas");
      }
    } catch (error) {
      alert("Error en la conexión al servidor");
    }
  });

  const formulario = document.createElement("div");
  formulario.className = "formulario-login";
  formulario.appendChild(encabezadoLogin);
  formulario.appendChild(labelCorreo);
  formulario.appendChild(inputCorreo);
  formulario.appendChild(labelContrasena);
  formulario.appendChild(inputContrasena);
  formulario.appendChild(botonLogin);

  const contenedorImagen = crearImagenLogin(); 

  contenedor.appendChild(Header());
  contenedor.appendChild(formulario);
  contenedor.appendChild(contenedorImagen);

  return contenedor;
}