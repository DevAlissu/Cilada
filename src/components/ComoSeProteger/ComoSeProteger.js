import React from "react";
import { motion } from "framer-motion"; // Importação do Framer Motion
import "./ComoSeProteger.css";
import lockIcon from "../../assets/lock-icon.png";
import updateIcon from "../../assets/update-icon.png";
import phishingIcon from "../../assets/phishing-icon.png";

const dicas = [
  {
    id: 1,
    titulo: "Use Senhas Fortes",
    descricao: "Evite senhas óbvias e utilize combinações de letras, números e símbolos.",
    imagem: lockIcon,
    link: "https://haveibeenpwned.com/Passwords" // Link para verificar senhas
  },
  {
    id: 2,
    titulo: "Mantenha Softwares Atualizados",
    descricao: "Instale atualizações regulares para proteger-se contra vulnerabilidades.",
    imagem: updateIcon,
    link: "https://www.av-test.org/en/" // Link para verificar softwares de segurança
  },
  {
    id: 3,
    titulo: "Cuidado com Links Suspeitos",
    descricao: "Evite clicar em links desconhecidos, especialmente em e-mails.",
    imagem: phishingIcon,
    link: "https://nordvpn.com/pt-br/link-checker/" // Link para analisar links e conteúdo
  },
];

const ComoSeProteger = () => {
  return (
    <motion.section
      className="como-se-proteger-container"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      id="protecao"
    >
      <motion.h2
        className="como-se-proteger-titulo"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        Como Se Proteger
      </motion.h2>
      <motion.div
        className="como-se-proteger-grid"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
       {dicas.map((dica, index) => (
  <motion.div
    key={dica.id}
    className="dica-card"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
  >
    <img src={dica.imagem} alt={dica.titulo} className="dica-imagem" />
    <h3 className="dica-titulo">{dica.titulo}</h3>
    <p className="dica-descricao">{dica.descricao}</p>
    <a
      href={dica.link}
      target="_blank"
      rel="noopener noreferrer"
      className="dica-link"
    >
      Saiba Como
    </a>
  </motion.div>
))}

      </motion.div>
    </motion.section>
  );
};

export default ComoSeProteger;
