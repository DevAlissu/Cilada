import React, { useState, useEffect } from "react";
import "./Noticias.css";

const Noticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchNoticias = async () => {
    setLoading(true); // Define o estado de carregamento antes de buscar as notícias
    setErro(null); // Limpa erros anteriores

    try {
      if (!process.env.REACT_APP_BACKEND_URL) {
        throw new Error(
          "A URL do backend não está definida. Verifique o arquivo .env."
        );
      }

      // Adiciona um timestamp à URL para evitar cache
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/noticias?timestamp=${new Date().getTime()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erro ao buscar notícias: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Dados recebidos:", data);

      if (data.articles && Array.isArray(data.articles)) {
        setNoticias(data.articles);
      } else {
        throw new Error("Formato inesperado de dados da API");
      }
    } catch (error) {
      console.error("Erro ao carregar notícias:", error.message);
      setErro(
        "Não foi possível carregar as notícias. Tente novamente mais tarde."
      );
    } finally {
      setLoading(false); // Finaliza o estado de carregamento
    }
  };

  useEffect(() => {
    fetchNoticias(); // Carrega as notícias ao montar o componente
  }, []);

  return (
    <section className="noticias-container" id="noticias">
      <h2 className="noticias-titulo">Últimas Notícias sobre Cibersegurança</h2>
      <button
        className="recarregar-noticias"
        onClick={fetchNoticias}
        disabled={loading}
      >
        {loading ? "Carregando..." : "Recarregar Notícias"}
      </button>
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
              <h3 className="noticia-titulo">
                {noticia.title || "Título não disponível"}
              </h3>
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