import React from "react";
import { motion } from "framer-motion";
import "./OQueFazer.css";
import step1Icon from "../../assets/step1-icon.png";
import step2Icon from "../../assets/step2-icon.png";
import step3Icon from "../../assets/step3-icon.png";

const passos = [
  {
    id: 1,
    titulo: "Identifique a Ameaça",
    descricao: "Observe comportamentos suspeitos, como lentidão ou mensagens de erro.",
    imagem: step1Icon,
  },
  {
    id: 2,
    titulo: "Tome Ações Imediatas",
    descricao: "Desconecte-se da internet e evite abrir arquivos suspeitos.",
    imagem: step2Icon,
  },
  {
    id: 3,
    titulo: "Procure Suporte Especializado",
    descricao: "Consulte um especialista ou use ferramentas de segurança.",
    imagem: step3Icon,
  },
];

const OQueFazer = () => {
  return (
    <motion.section
      className="o-que-fazer-container"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      id="o-que-fazer"
    >
      <motion.h2
        className="o-que-fazer-titulo"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        O Que Fazer em Caso de Ameaça?
      </motion.h2>
      <motion.div
        className="o-que-fazer-grid"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {passos.map((passo, index) => (
          <motion.div
            key={passo.id}
            className="passo-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <img src={passo.imagem} alt={passo.titulo} className="passo-imagem" />
            <h3 className="passo-titulo">{passo.titulo}</h3>
            <p className="passo-descricao">{passo.descricao}</p>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        className="cta-container"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <button className="cta-button">Saiba Mais</button>
      </motion.div>
    </motion.section>
  );
};

export default OQueFazer;