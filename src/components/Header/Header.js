import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

function Header() {
  const location = useLocation(); // Obtém a rota atual
  const headerRef = useRef(null);
  const binaryElements = useRef([]);
  const [menuActive, setMenuActive] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const [activeSection, setActiveSection] = useState("");

  const isSobrePage = location.pathname === "/sobre"; // Verifica se está na página "Sobre"

  useEffect(() => {
    if (isSobrePage) return; // Não aplica o efeito binary na página "Sobre a Gente"

    const header = headerRef.current;

    const localBinaryElements = [];
    for (let i = 0; i < 90; i++) {
      const binary = document.createElement("div");
      binary.className = "binary";
      binary.textContent = Math.random() > 0.5 ? "0" : "1";
      binary.style.top = `${Math.random() * 100}%`;
      binary.style.left = `${Math.random() * 100}%`;
      binary.style.animationDelay = `${Math.random() * 5}s`;
      header.appendChild(binary);
      localBinaryElements.push(binary);
    }

    binaryElements.current = localBinaryElements;

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
          binary.style.opacity = "0.5";
        } else {
          binary.style.transform = `translate(0, 0)`;
          binary.style.opacity = "1";
        }
      });
    };

    header.addEventListener("mousemove", handleMouseMove);

    return () => {
      header.removeEventListener("mousemove", handleMouseMove);
      localBinaryElements.forEach((binary) => header.removeChild(binary));
    };
  }, [isSobrePage]);

  useEffect(() => {
    if (isSobrePage) return; // Não aplica a lógica de scroll na página "Sobre a Gente"

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      lastScrollY.current = currentScrollY;

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
  }, [isSobrePage]);

  const toggleMenu = () => {
    setMenuActive((prev) => !prev);
  };

  return (
    <header
      ref={headerRef}
      className={`header ${isSobrePage ? "header-sobre" : ""} ${
        showHeader ? "visible" : "hidden"
      } ${activeSection && !isSobrePage ? activeSection : "default"}`}
    >
      <div className="animated-logo-container">
        <div className="logo-content">
          <img
            src={
              isSobrePage
                ? require("../../assets/logo_ifam.png") // Logo IFAM para "Sobre a Gente"
                : require("../../assets/logoteste.png") // Logo padrão
            }
            alt={isSobrePage ? "Logo IFAM" : "Logo Cilada"}
            className="logo-img"
          />
          
        </div>
      </div>

      {isSobrePage ? (
        <nav className="navigation">
          <ul className="nav-list">
            <li>
              <Link to="/">Início</Link>
            </li>
          </ul>
        </nav>
      ) : (
        <>
          <button className="menu-button" onClick={toggleMenu}>
            ☰
          </button>
          <nav className={`navigation ${menuActive ? "active" : ""}`}>
            <ul className="nav-list">
              <li>
                <a href="#introducao">Início</a>
              </li>
              <li>
                <a href="#principais-golpes">Principais Golpes</a>
              </li>
              <li>
                <a href="#o-que-fazer">O Que Fazer?</a>
              </li>
              <li>
                <a href="#protecao">Como Se Proteger</a>
              </li>
              <li>
                <a href="#noticias">Notícias</a>
              </li>
              <li>
                <Link to="/sobre">Sobre o Grupo</Link>
              </li>
            </ul>
          </nav>
        </>
      )}
    </header>
  );
}

export default Header;