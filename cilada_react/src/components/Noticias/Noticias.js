import React, { useState, useEffect } from "react";
import "./Noticias.css";

const Noticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const response = await fetch("https://cilada.onrender.com/api/noticias");
        if (!response.ok) {
          throw new Error("Erro ao buscar notícias");
        }
        const data = await response.json();
        console.log("Dados recebidos:", data); // Log para verificar os dados recebidos
        if (data.articles) {
          setNoticias(data.articles); // Armazena as notícias recebidas
        } else {
          throw new Error("Formato inesperado de dados");
        }
      } catch (error) {
        console.error("Erro ao carregar notícias:", error.message);
        setErro("Não foi possível carregar as notícias. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchNoticias();
  }, []);

  return (
    <section className="noticias-container" id="noticias">
      <h2 className="noticias-titulo">Últimas Notícias sobre Cibersegurança</h2>
      {loading ? (
        <p className="noticias-loading">Carregando notícias...</p>
      ) : erro ? (
        <p className="noticias-erro">{erro}</p>
      ) : (
        <div className="noticias-grid">
          {noticias.slice(0, 3).map((noticia, index) => (
            <div key={index} className="noticia-card">
              {noticia.urlToImage && (
                <img
                  src={noticia.urlToImage}
                  alt={noticia.title || "Imagem da notícia"}
                  className="noticia-thumbnail"
                />
              )}
              <h3 className="noticia-titulo">{noticia.title || "Título indisponível"}</h3>
              <p className="noticia-descricao">
                {noticia.description || "Descrição não disponível"}
              </p>
              <a
                href={noticia.url}
                target="_blank"
                rel="noopener noreferrer"
                className="noticia-link"
              >
                Leia mais
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Noticias;