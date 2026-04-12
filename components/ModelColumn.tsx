import React from 'react';
import { Model, Message } from '../types';

interface ModelColumnProps {
  model: Model;
  messages: Message[];
  isThinking: boolean;
}

const ModelColumn: React.FC<ModelColumnProps> = ({ model, messages, isThinking }) => {
  return (
    <div className="bg-brand-surface border border-brand-border rounded-xl p-6 flex flex-col h-full shadow-lg">
      <div className="flex items-center mb-4">
        <div className={`w-3 h-3 rounded-full mr-3 ${model.id === 'A' ? 'bg-blue-500' : 'bg-teal-500'}`}></div>
        <h2 className="text-2xl font-bold text-brand-text-primary">{model.name}</h2>
      </div>
      
      <div className="mb-4 p-4 bg-brand-bg rounded-lg border border-brand-border">
        <h3 className="font-semibold text-brand-accent mb-2">Epistemic Lens:</h3>
        <p className="text-sm text-brand-text-secondary italic">{model.lens || 'Awaiting mandate initiation...'}</p>
      </div>

      <div className="flex-grow bg-brand-bg p-4 rounded-lg overflow-y-auto border border-brand-border min-h-[200px]">
        <h3 className="font-semibold text-brand-text-primary mb-3">Dialogue Contribution:</h3>
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className="animate-slide-in-bottom">
              <div className={`p-3 rounded-lg ${model.id === 'A' ? 'bg-blue-900/50' : 'bg-teal-900/50'}`}>
                <p className="text-sm text-brand-text-primary">{msg.content}</p>
                <p className="text-xs text-right mt-1 text-brand-text-secondary">Turn {msg.turn}</p>
              </div>
            </div>
          ))}
          {isThinking && (
             <div className="flex items-center space-x-2 text-brand-text-secondary">
                <div className="w-2 h-2 bg-brand-text-secondary rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-brand-text-secondary rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-brand-text-secondary rounded-full animate-pulse"></div>
                <span>Translating ontology...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelColumn;
