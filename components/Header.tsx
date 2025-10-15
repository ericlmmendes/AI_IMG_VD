import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-base-200/50 backdrop-blur-sm p-4 border-b border-base-300">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
          Estúdio de Imagem e Vídeo com IA
        </h1>
        <p className="text-sm text-text-secondary">Aprimore imagens e gere vídeos com a IA Gemini</p>
      </div>
    </header>
  );
};

export default Header;