import React from 'react';

interface PromptInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  placeholder: string;
}

const PromptInput: React.FC<PromptInputProps> = ({ prompt, onPromptChange, placeholder }) => {
  return (
    <div className="w-full">
      <label htmlFor="prompt" className="block text-sm font-medium text-text-secondary mb-1">
        Seu Prompt
      </label>
      <textarea
        id="prompt"
        rows={4}
        className="w-full p-3 bg-base-200 border border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200 text-text-primary placeholder-text-secondary/50"
        placeholder={placeholder}
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
      />
    </div>
  );
};

export default PromptInput;