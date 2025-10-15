import React, { useState, useCallback } from 'react';
import type { Feature } from './types';
import Header from './components/Header';
import FeatureSelector from './components/FeatureSelector';
import FileUpload from './components/FileUpload';
import PromptInput from './components/PromptInput';
import Loader from './components/Loader';
import ResultDisplay from './components/ResultDisplay';
import { enhanceImage, generateVideo } from './services/geminiService';

const App: React.FC = () => {
  const [feature, setFeature] = useState<Feature>('image');
  const [prompt, setPrompt] = useState<string>('');
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((file: File) => {
    setInputFile(file);
  }, []);

  const handleFeatureChange = (newFeature: Feature) => {
    setFeature(newFeature);
    setResultUrl(null); // Limpa o resultado ao trocar de funcionalidade
  }

  const getPlaceholder = () => {
    return feature === 'image'
      ? 'ex: Torne o céu um pôr do sol vibrante, adicione um castelo ao fundo.'
      : 'ex: Uma cena cinematográfica do carro dirigindo por uma cidade iluminada por neon à noite.';
  };

  const handleSubmit = async () => {
    if (!inputFile || !prompt) {
      setError('Por favor, envie uma imagem e forneça um prompt.');
      return;
    }

    setIsLoading(true);
    setResultUrl(null);
    setError(null);

    try {
      if (feature === 'image') {
        setLoadingMessage('Aplicando melhorias de IA...');
        const imageUrl = await enhanceImage(prompt, inputFile);
        setResultUrl(imageUrl);
      } else {
        setLoadingMessage('Iniciando a geração de vídeo...');
        const videoUrl = await generateVideo(prompt, inputFile, setLoadingMessage);
        setResultUrl(videoUrl);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Header />
      <main className="flex-grow container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Coluna de Controles */}
          <div className="flex flex-col space-y-6 bg-base-100/50 p-6 rounded-lg border border-base-300">
            <FeatureSelector selectedFeature={feature} onFeatureChange={handleFeatureChange} />
            <FileUpload onFileChange={handleFileChange} />
            <PromptInput prompt={prompt} onPromptChange={setPrompt} placeholder={getPlaceholder()} />
            
            <button
              onClick={handleSubmit}
              disabled={isLoading || !inputFile || !prompt}
              className="w-full py-3 px-4 text-white font-semibold rounded-lg shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 disabled:from-brand-primary/50 disabled:to-brand-secondary/50"
            >
              {isLoading ? 'Gerando...' : `Gerar ${feature === 'image' ? 'Imagem' : 'Vídeo'}`}
            </button>

            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-md text-sm">{error}</div>}
          </div>

          {/* Coluna de Resultado */}
          <div className="bg-base-200/50 rounded-lg border border-base-300 min-h-[50vh] lg:min-h-0 flex items-center justify-center p-4">
            {isLoading ? (
              <Loader message={loadingMessage} />
            ) : (
              <ResultDisplay resultUrl={resultUrl} feature={feature} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;