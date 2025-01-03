import React from 'react';
import Header from './components/Header/Header';
import Introducao from './components/Introducao/Introducao';
import ProtecaoDigital from './components/Introducao/ProtecaoDigital';
import PrincipaisGolpes from './components/PrincipaisGolpes/PrincipaisGolpes';
import ComoSeProteger from './components/ComoSeProteger/ComoSeProteger';
import OQueFazer from './components/OQueFazer/OQueFazer';
import Noticias from './components/Noticias/Noticias';
import Footer from './components/Footer/Footer';
function App() {
  return (
    <div className="App">
      <Header />
      <main>
        
        <Introducao/>
        <ProtecaoDigital />
        
        <PrincipaisGolpes />
        
        <OQueFazer />
        <ComoSeProteger />
        <Noticias />
        <Footer />
      </main>
    </div>
  );
}

export default App;