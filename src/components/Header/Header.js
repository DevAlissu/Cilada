import React, { useEffect, useRef, useState } from "react";
import "./Header.css";

function Header() {
  const headerRef = useRef(null);
  const binaryElements = useRef([]);
  const [menuActive, setMenuActive] = useState(false); // Estado do menu toggle
  const [showHeader, setShowHeader] = useState(true); // Controla a visibilidade do header
  const lastScrollY = useRef(0); // Armazena a posição anterior do scroll
  const [activeSection, setActiveSection] = useState(""); // Controla a seção ativa

  useEffect(() => {
    const header = headerRef.current;

    // Cria elementos "0" e "1" no header
    const localBinaryElements = [];
    for (let i = 0; i < 300; i++) {
      const binary = document.createElement("div");
      binary.className = "binary";
      binary.textContent = Math.random() > 0.5 ? "0" : "1"; // Alterna entre "0" e "1"
      binary.style.top = `${Math.random() * 100}%`;
      binary.style.left = `${Math.random() * 100}%`;
      binary.style.animationDelay = `${Math.random() * 5}s`; // Delay para criar variação no tempo
      header.appendChild(binary);
      localBinaryElements.push(binary);
    }

    binaryElements.current = localBinaryElements;

    // Animação ao mover o mouse no header
    const handleMouseMove = (e) => {
      const rect = header.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      localBinaryElements.forEach((binary) => {
        const binaryX = binary.offsetLeft + binary.offsetWidth / 2;
        const binaryY = binary.offsetTop + binary.offsetHeight / 2;

        const distance = Math.sqrt(
          (mouseX - binaryX) ** 2 + (mouseY - binaryY) ** 2
        );

        if (distance < 50) {
          const angle = Math.atan2(binaryY - mouseY, binaryX - mouseX);
          const offsetX = Math.cos(angle) * 50;
          const offsetY = Math.sin(angle) * 50;

          binary.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
          binary.style.opacity = "0.5"; // Reduz a opacidade ao espalhar
        } else {
          binary.style.transform = `translate(0, 0)`;
          binary.style.opacity = "1"; // Retorna à opacidade normal
        }
      });
    };

    header.addEventListener("mousemove", handleMouseMove);

    return () => {
      header.removeEventListener("mousemove", handleMouseMove);
      localBinaryElements.forEach((binary) => header.removeChild(binary));
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Esconde ou mostra o header ao rolar para baixo ou para cima
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShowHeader(false); // Esconde o header ao rolar para baixo
      } else {
        setShowHeader(true); // Mostra o header ao rolar para cima
      }

      lastScrollY.current = currentScrollY; // Atualiza o último scroll

      // Identifica a seção ativa
      const sections = document.querySelectorAll("section");
      let currentSection = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (currentScrollY >= sectionTop - sectionHeight / 3) {
          currentSection = section.getAttribute("id");
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMenuActive((prev) => !prev);
  };

  return (
    <header
      ref={headerRef}
      className={`header ${showHeader ? "visible" : "hidden"} ${
        activeSection ? activeSection : "default"
      }`}
    >
      <div className="animated-logo-container">
        <div className="logo-content">
          <img
            src={require("../../assets/logoteste.png")}
            alt="Logo Cilada"
            className="logo-img"
          />
          <span className="logo-text">C I L A D A</span>
        </div>
      </div>
      <button className="menu-button" onClick={toggleMenu}>
        ☰
      </button>
      <nav className={`navigation ${menuActive ? "active" : ""}`}>
        <ul className="nav-list">
          <li>
            <a href="#quem-somos">Quem Somos</a>
          </li>
          <li>
            <a href="#principais-golpes">Principais Golpes</a>
          </li>
          <li>
            <a href="#protecao">Como Se Proteger</a>
          </li>
          <li>
            <a href="#o-que-fazer">O Que Fazer?</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;