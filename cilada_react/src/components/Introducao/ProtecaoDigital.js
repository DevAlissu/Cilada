import React from "react";
import { motion } from "framer-motion";
import "./ProtecaoDigital.css";

const ProtecaoDigital = () => {
  return (
    <div className="protecao-digital-container">
      <motion.div
        className="protecao-digital-content"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>Proteja Seu Futuro Digital</h1>
        <p>
          Descubra como podemos ajudar você a navegar com segurança e
          confiança. Dicas, ferramentas e suporte para uma experiência digital
          protegida.
        </p>
      </motion.div>
    </div>
  );
};

export default ProtecaoDigital;