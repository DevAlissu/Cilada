const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// Middleware para permitir requisições CORS
app.use(
  cors({
    origin: "https://cilada.vercel.app", // Substitua pelo domínio do frontend no Vercel
    methods: ["GET", "POST", "OPTIONS"],
  })
);

// Sua API Key da NewsAPI
const API_KEY = "3237b7e7ced247a1bcbdb1fa04977c2f";

// Rota para buscar notícias
app.get("/api/noticias", async (req, res) => {
  try {
    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: "cybersecurity OR ransomware OR phishing OR hacking OR hacker",
        language: "pt",
        sortBy: "publishedAt",
        apiKey: API_KEY,
      },
    });

    res.json({
      status: "success",
      articles: response.data.articles,
    });
  } catch (error) {
    console.error("Erro ao buscar notícias:", error.message); // Log do erro
    res.status(500).json({
      status: "error",
      message: "Erro ao buscar notícias. Por favor, tente novamente mais tarde.",
    });
  }
});

// Porta configurada para o Render (ou fallback para 4000 localmente)
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});