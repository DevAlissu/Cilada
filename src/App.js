import React from "react";
import { useLocation, Routes, Route } from "react-router-dom"; // Certifique-se de importar `Routes` e `Route`
import Header from "./components/Header/Header";
import Introducao from "./components/Introducao/Introducao";
import ProtecaoDigital from "./components/Introducao/ProtecaoDigital";
import PrincipaisGolpes from "./components/PrincipaisGolpes/PrincipaisGolpes";
import ComoSeProteger from "./components/ComoSeProteger/ComoSeProteger";
import OQueFazer from "./components/OQueFazer/OQueFazer";
import Noticias from "./components/Noticias/Noticias";
import Footer from "./components/Footer/Footer";
import Sobre from "./components/Sobre/Sobre";

function App() {
  const location = useLocation(); // Verifica a rota atual

  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Introducao />
                <ProtecaoDigital />
                <PrincipaisGolpes />
                <OQueFazer />
                <ComoSeProteger />
                <Noticias />
              </>
            }
          />
          <Route path="/sobre" element={<Sobre />} />
        </Routes>
      </main>
      {/* Renderiza o footer somente fora da rota /sobre */}
      {location.pathname !== "/sobre" && <Footer />}
    </div>
  );
}

export default App;