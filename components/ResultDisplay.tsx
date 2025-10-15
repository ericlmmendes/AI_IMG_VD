import React from 'react';
import type { Feature } from '../types';
import { DownloadIcon, ImageIcon, VideoIcon } from './icons';

interface ResultDisplayProps {
  resultUrl: string | null;
  feature: Feature;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ resultUrl, feature }) => {
  if (!resultUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center bg-base-200 rounded-lg p-8">
         {feature === 'image' ? <ImageIcon className="w-16 h-16 text-base-300" /> : <VideoIcon className="w-16 h-16 text-base-300" />}
        <h3 className="mt-4 text-xl font-semibold text-text-secondary">Seu resultado aparecerá aqui</h3>
        <p className="mt-1 text-sm text-text-secondary/70">Envie uma imagem e forneça um prompt para começar.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black rounded-lg group">
      {feature === 'image' ? (
        <img src={resultUrl} alt="Resultado gerado" className="object-contain w-full h-full" />
      ) : (
        <video src={resultUrl} controls autoPlay loop className="object-contain w-full h-full" />
      )}
      <a
        href={resultUrl}
        download={`gerado-por-ia-${feature}.${feature === 'video' ? 'mp4' : 'png'}`}
        className="absolute top-4 right-4 bg-base-100/50 hover:bg-brand-primary text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
        title={`Baixar ${feature === 'image' ? 'imagem' : 'vídeo'}`}
      >
        <DownloadIcon className="w-6 h-6" />
      </a>
    </div>
  );
};

export default ResultDisplay;