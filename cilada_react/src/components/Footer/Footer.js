import React, { useEffect, useRef } from "react";
import "./Footer.css";

function Footer() {
  const footerRef = useRef(null);
  const binaryElements = useRef([]);

  useEffect(() => {
    const footer = footerRef.current;

    // Cria elementos "0" e "1" no footer
    const localBinaryElements = [];
    for (let i = 0; i < 200; i++) {
      const binary2 = document.createElement("div");
      binary2.className = "binary2";
      binary2.textContent = Math.random() > 0.5 ? "0" : "1";
      binary2.style.top = `${Math.random() * 100}%`;
      binary2.style.left = `${Math.random() * 100}%`;
      binary2.style.animationDelay = `${Math.random() * 5}s`;
      footer.appendChild(binary2);
      localBinaryElements.push(binary2);
    }

    binaryElements.current = localBinaryElements;

    return () => {
      // Remove os elementos "0" e "1" ao desmontar o componente
      localBinaryElements.forEach((binary2) => footer.removeChild(binary2));
    };
  }, []);

  return (
    <footer ref={footerRef} className="footer">
      <div className="animated-logo-container">
        <div className="logo-content">
          <img
            src={require("../../assets/logoteste.png")}
            alt="Logo Cilada"
            className="logo-img"
          />
          <span className="logo-text2">C I L A D A</span>
        </div>
      </div>
      <div className="footer-links">
        <ul>
          <li><a href="#quem-somos">Quem Somos</a></li>
          <li><a href="#principais-golpes">Principais Golpes</a></li>
          <li><a href="#protecao">Como Se Proteger</a></li>
          <li><a href="#o-que-fazer">O Que Fazer?</a></li>
        </ul>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Cilada - Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;