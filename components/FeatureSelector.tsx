import React from 'react';
import type { Feature } from '../types';
import { ImageIcon, VideoIcon } from './icons';

interface FeatureSelectorProps {
  selectedFeature: Feature;
  onFeatureChange: (feature: Feature) => void;
}

const FeatureSelector: React.FC<FeatureSelectorProps> = ({ selectedFeature, onFeatureChange }) => {
  const baseClasses = "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-brand-primary";
  const activeClasses = "bg-brand-primary text-white shadow-lg";
  const inactiveClasses = "bg-base-200 text-text-secondary hover:bg-base-300";

  return (
    <div className="flex bg-base-300/50 p-1 rounded-lg space-x-2">
      <button
        onClick={() => onFeatureChange('image')}
        className={`${baseClasses} ${selectedFeature === 'image' ? activeClasses : inactiveClasses}`}
      >
        <ImageIcon className="w-5 h-5" />
        Aprimoramento de Imagem
      </button>
      <button
        onClick={() => onFeatureChange('video')}
        className={`${baseClasses} ${selectedFeature === 'video' ? activeClasses : inactiveClasses}`}
      >
        <VideoIcon className="w-5 h-5" />
        Geração de Vídeo
      </button>
    </div>
  );
};

export default FeatureSelector;