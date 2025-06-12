export function Header() {

    const Header = document.createElement("header");
    Header.className = "header";

    const titulo = document.createElement("h1");
    titulo.className = "titulo-header";
    titulo.textContent = "Martini's Game";

 Header.appendChild(titulo);

return Header;
}