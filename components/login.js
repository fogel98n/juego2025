import { juegos } from "./juegos.js";
import { crearImagenLogin } from "./logo.js"; 
import { Header } from "./header.js";
import { BASE_URL } from "../config.js";

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
      console.log("📤 Enviando datos de login:", { correo, contrasena });

      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, contrasena }),
      });

      console.log("✅ Respuesta del servidor:", response);

      let data;

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        console.log("📦 Datos recibidos:", data);
      } else {
        const texto = await response.text();
        console.warn("⚠️ Respuesta no JSON:", texto);
        alert("Error inesperado. El servidor no devolvió JSON.");
        return;
      }

      if (response.ok) {
        localStorage.setItem("token", data.token);
        console.log("🔑 Token guardado. Redirigiendo a juegos...");

        const panelJuegos = juegos();
        document.body.innerHTML = "";
        document.body.appendChild(panelJuegos);
      } else {
        alert(data.message || "Credenciales inválidas");
      }
    } catch (error) {
      console.error("❌ Error en el login:", error);
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
