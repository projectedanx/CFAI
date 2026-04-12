
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-4 md:p-6 border-b border-brand-border">
      <h1 className="text-3xl md:text-4xl font-bold text-brand-accent">
        Cogni-Forge AI
      </h1>
      <p className="mt-2 text-md md:text-lg text-brand-text-secondary max-w-3xl mx-auto">
        An experimental environment simulating the Bi-Directional Emergent Learning Framework. Two AI models, starting with fragmented data, learn collaboratively.
      </p>
    </header>
  );
};

export default Header;
