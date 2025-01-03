import React from "react";
import { motion } from "framer-motion";
import "./PrincipaisGolpes.css";
import golpe1 from "../../assets/golpe1.png";
import golpe2 from "../../assets/golpe2.png";
import golpe3 from "../../assets/golpe3.png";

const golpes = [
  {
    id: 1,
    imagem: golpe1,
    titulo: "Phishing",
    descricao: "Tentativas de obter informações confidenciais, como senhas e dados bancários.",
  },
  {
    id: 2,
    imagem: golpe2,
    titulo: "Ransomware",
    descricao: "Malware que sequestra seus dados e exige resgate.",
  },
  {
    id: 3,
    imagem: golpe3,
    titulo: "Spyware",
    descricao: "Software espião que coleta informações sem o seu consentimento.",
  },
];

const PrincipaisGolpes = () => {
  return (
    <motion.section
      className="principais-golpes-container"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      id="principais-golpes"
    >
      <motion.h2
        className="principais-golpes-titulo"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        Principais Golpes Cibernéticos
      </motion.h2>
      <motion.div
        className="principais-golpes-grid"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {golpes.map((golpe, index) => (
          <motion.div
            key={golpe.id}
            className="golpe-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <img src={golpe.imagem} alt={golpe.titulo} className="golpe-imagem" />
            <h3 className="golpe-titulo">{golpe.titulo}</h3>
            <p className="golpe-descricao">{golpe.descricao}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default PrincipaisGolpes;