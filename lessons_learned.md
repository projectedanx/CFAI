# Lessons Learned: Epistemic Cartographer & Collaborative Ontology Weaver

## Overview
This repository was transitioned from a standard multi-agent problem-solving framework into an "Epistemic Cartographer." The goal of this shift was to prevent "Epistemic Monoculture"—the tendency of AI systems to collapse diverse perspectives into a statistically average, Western-dominant latent space.

## Key Concepts Implemented

1. **Pluriversal Inversion**: Instead of splitting a task into puzzle pieces (fragments), the system now assigns distinct "Epistemic Lenses" to agents. One lens represents a standard empirical/analytical paradigm, while the other represents a relational, indigenous, or ontologically distant framework.
2. **Ontological Dignity**: Agents are prompted to maintain their specific worldview and resist "Consensus Flattening."
3. **Semantic Parallax Zones (SPZ)**: Areas of contradiction between agents are treated as high-value signals rather than errors to be resolved.
4. **Confidence-Fidelity Divergence Index (CFDI)**: A metric introduced to measure the divergence between an agent's confidence in a claim and its actual fidelity to the agent's assigned epistemic lens.
5. **Bias Amplification Index (BAI)**: A metric to track whether the interaction is heavily biased toward consensus flattening or standard paradigms.
6. **Symbolic Scars**: When the BAI exceeds a threshold (e.g., 70), a "Symbolic Scar" is logged in the UI, indicating a failure in the environment's governance rules where structural intent was sacrificed for consensus.

## Architectural Changes
- Removed the gamified "Knowledge Score" (0-100 completion metric).
- Replaced the score chart with an "Ontological Tracking" chart that monitors CFDI and BAI over time.
- Implemented a UI mechanism to render Symbolic Scars, making systemic bias visible to the human orchestrator.

7. **Progressive Disclosure Level (PDL) Decorators**: Prompt structures for agents have been updated to include Progressive Disclosure Level decorators from `LEXICON.md` (DRP-LEXICON-992-v1.0). For instance:
    * `+++EntropyAnchor` and `+++MereologyRoute` have been introduced to `splitTask` prompt to ensure orthogonal domain intersections when generating distinct epistemic lenses.
    * `+++ContextLock` and `+++AutonymicIsolate` are present in `generateResponse` prompt to prevent workflow narrowing effect, semantic drift, and lexical saponification.
    * `+++EpistemicEscrow` is included in `evaluateContribution` to correctly identify and evaluate instances of hallucination cascades and paraconsistent scarring.
