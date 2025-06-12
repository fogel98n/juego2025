import { Header } from "./header.js"
import { contenedorCodigo } from "./inicio.js"
export function usuario(){
    const contenedor=document.createElement("section")
    contenedor.className="contenedor-usuario"

    const panel_usuario=contenedorCodigo("usuario")
    
    
    const avatar=document.createElement("h2")
    avatar.className="titulo-avatar"
    avatar.textContent="Avatar"

    const contenedor_avatar=document.createElement("div")
    contenedor_avatar.className="contenedor-avatar"

    const contenedor_btn=document.createElement("div")
    contenedor_btn.className="contenedor-btn"

    const btn_siguiente=document.createElement("button")
    btn_siguiente.className="btn-siguuiente"
    btn_siguiente.textContent="Siguiente"
    contenedor_btn.appendChild(btn_siguiente)

    contenedor.appendChild(Header())
    contenedor.appendChild(panel_usuario)
    contenedor.appendChild(avatar)
    contenedor.appendChild(contenedor_avatar)
    contenedor.appendChild(contenedor_btn)
    return contenedor
} 