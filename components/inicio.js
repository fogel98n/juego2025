import { Header } from "./header.js";
import { Login } from "./login.js";
import { usuario } from "./usuario.js";

export function inicio() {
  const contenedor = document.createElement("section");
  contenedor.className = "inicio";

  const btn_inicioLogin = document.createElement("button");
  btn_inicioLogin.className = "btn-login";
  btn_inicioLogin.textContent = "iniciar sesion";

  btn_inicioLogin.addEventListener("click", () => {
    const panel_login = Login();
    document.body.innerHTML = "";
    document.body.appendChild(panel_login);
  });

  const header = Header();
  header.className = "inicio-header";
  header.appendChild(btn_inicioLogin);

  const titulo_inicio = document.createElement("h1");
  titulo_inicio.className = "titulo-inicio";
  titulo_inicio.textContent = "MARTINI’S GAME";

  const titulo_codigo = document.createElement("h2");
  titulo_codigo.className = "titulo-codigo";
  titulo_codigo.textContent = "Ingrese el código de juego";

  const contenedor_codigo = contenedorCodigo("Código");

  const contenedorbtn = document.createElement("div");
  contenedorbtn.className = "btn-ingreso-container";

  const btn_ingreso = document.createElement("button");
  btn_ingreso.className = "btn-ingreso";
  btn_ingreso.textContent = "Ingresar";

  btn_ingreso.addEventListener("click",()=>{
     const panel_usuario=usuario()
     document.body.innerHTML=""
     document.body.appendChild(panel_usuario)
  })

  contenedorbtn.appendChild(btn_ingreso);

  contenedor.appendChild(header);
  contenedor.appendChild(titulo_inicio);
  contenedor.appendChild(titulo_codigo);
  contenedor.appendChild(contenedor_codigo);
  contenedor.appendChild(contenedorbtn);

  return contenedor;
}

export function contenedorCodigo(textoDiv = "codigo") {
  const contenedor = document.createElement("div");
  contenedor.className = "contenedor_codigo";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "input-codigo";

  const divBoton = document.createElement("div");
  divBoton.className = "btn-div";
  divBoton.textContent = textoDiv;

  contenedor.appendChild(divBoton);
  contenedor.appendChild(input);

  return contenedor;
}

