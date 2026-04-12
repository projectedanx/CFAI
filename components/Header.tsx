import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-4 md:p-6 border-b border-brand-border">
      <h1 className="text-3xl md:text-4xl font-bold text-brand-accent">
        Epistemic Cartographer
      </h1>
      <p className="mt-2 text-md md:text-lg text-brand-text-secondary max-w-3xl mx-auto">
        A Collaborative Ontology Weaver. Preventing Epistemic Monoculture by governing Persistent Collaborative Environments via Agentic Affordance Proposal Protocols.
      </p>
    </header>
  );
};

export default Header;
