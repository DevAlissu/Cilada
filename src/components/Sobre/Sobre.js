import React from "react";
import "./Sobre.css";
import alison from "../../assets/image.png";
import cairo from "../../assets/cairo.png";
import erick from "../../assets/erick.png";
import mario from "../../assets/mario.png";
import rafael from "../../assets/rafael.png";
import iso27001 from "../../assets/iso27001.png";
import iso9126 from "../../assets/iso9126.png";
import iso25010 from "../../assets/iso25010.png";
import iso9001 from "../../assets/iso9001.jpg";

const Sobre = () => {
  return (
    <div className="sobre-container">
      {/* Seção sobre o grupo */}
      <section className="sobre-intro">
        <h1 className="sobre-titulo">Sobre o grupo</h1>
        <p className="sobre-descricao">
          Somos um grupo da turma de Engenharia de Software do IFAM/CMZL,
          empenhados em construir soluções criativas e impactantes.
          <br />
          Este projeto busca alinhar-se com padrões de qualidade reconhecidos
          como as normas ISO/IEC, visando segurança, usabilidade e inovação para
          a disciplina de Gestão e Qualidade De Software.
        </p>
      </section>

      {/* Seção Integrantes */}
      <section className="integrantes">
        <h2 className="sobre-subtitulo">Nosso Grupo</h2>
        <div className="integrantes-grid">
          <div className="integrante-card">
            <img src={alison} alt="Alison Silva" className="integrante-foto" />
            <h3>Alison Silva</h3>
            <p>Desenvolvedor</p>
          </div>
          <div className="integrante-card">
            <img src={cairo} alt="Cairo José" className="integrante-icone" />
            <h3>Cairo José</h3>
            <p>Produtor do Slide</p>
          </div>
          <div className="integrante-card">
            <img src={erick} alt="Erick Albert" className="integrante-icone" />
            <h3>Erick Albert</h3>
            <p>Produtor do Slide</p>
          </div>
          <div className="integrante-card">
            <img src={mario} alt="Mario Jorge" className="integrante-icone" />
            <h3>Mario Jorge</h3>
            <p>Apresentador do Trabalho</p>
          </div>
          <div className="integrante-card">
            <img src={rafael} alt="Rafael Freire" className="integrante-foto" />
            <h3>Rafael Freire</h3>
            <p>Produtor do Slide e Apresentador</p>
          </div>
        </div>
      </section>

      {/* Seção Normas ISO */}
      <section className="normas-iso">
        <h2 className="sobre-subtitulo">Normas ISO que seguimos</h2>
        <div className="normas-grid">
          <div className="norma-card">
            <img src={iso27001} alt="ISO/IEC 27001" className="norma-icone" />
            <h3>ISO/IEC 27001</h3>
            <p>
              Focada na segurança da informação, assegura que os dados e
              sistemas estão protegidos contra ameaças.
            </p>
          </div>
          <div className="norma-card">
            <img src={iso9126} alt="ISO 9126" className="norma-icone" />
            <h3>ISO 9126</h3>
            <p>
              Define um modelo de qualidade para software, abordando
              características como funcionalidade, confiabilidade e usabilidade.
            </p>
          </div>
          <div className="norma-card">
            <img src={iso25010} alt="ISO 25010" className="norma-icone" />
            <h3>ISO 25010</h3>
            <p>
              Modelo que substituiu o ISO 9126, focando na avaliação da qualidade
              de produtos de software e sistemas.
            </p>
          </div>
          <div className="norma-card">
            <img src={iso9001} alt="ISO 9001" className="norma-icone" />
            <h3>ISO 9001</h3>
            <p>
              Padrão internacional que especifica os requisitos para um sistema
              de gestão da qualidade, aplicável em diversas áreas.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sobre;