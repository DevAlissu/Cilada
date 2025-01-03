import React from "react";
import "./Introducao.css"; // Arquivo de estilos
import logoteste from "../../assets/security-image1.png";


const Introducao = () => {
  return (
    <div className="introducao-container">
      <div className="introducao-content">
        <div className="introducao-texto">
          <h1>Sua Jornada para a Segurança Cibernética Começa Aqui</h1>
          <p>
            Aprenda a identificar ameaças digitais, proteger seus dados e agir
            de forma segura. Explore dicas práticas, testes interativos e
            simuladores para dominar a segurança online.
          </p>
          <button className="btn-cta">Explorar Ameaças</button>
        </div>
        <div className="introducao-imagem">
        <img src={logoteste} alt="Ilustração de Segurança Cibernética" />
        </div>
      </div>
    </div>
  );
};

export default Introducao;