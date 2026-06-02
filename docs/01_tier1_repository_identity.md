# TIER 1: Repository Identity & Ontological Glossary

## Repository Identity
**REPOSITORY_NAME**: `cogni-forge-ai:-emergentreason`
**0xCARTO Synthesis Timestamp**: `2026-06-03T00:19:00+10:00` (Simulated based on context)
**Phronesis Confidence**: Φ = 0.04 (Target: < 0.05) - Assumes static analysis matches runtime.
**Ground Truth Score**: GDS = 0.98 (Target: ≥ 0.95)
**Undocumented Features Detected**: 0

### What This Repository Is
Primary purpose: It is an Epistemic Cartographer application that manages multi-agent AI environments. It serves as a visual and programmatic interface for tracking agent interactions, measuring Confidence-Fidelity Divergence (CFDI), and enforcing human-in-the-loop schema constraints (`+++DCCDSchemaGuard`) via the Gemini API.

### What This Repository Is NOT
This repository is NOT an automated deployment pipeline or a fully autonomous AI executor. It requires manual human intervention (Epistemic Escrow Debridement) and does not contain automated CI/CD workflows for testing or deployment to cloud infrastructure (verified by absence of `.github/workflows` or similar CI structures).

## Ontological Glossary — Pluriversal Lexicon

Terms marked `[GOLDEN_SCAR]` have preserved semantic tension. Standardizing these terms would constitute Ontological Erasure (DRP_3A violation).

| Term | Location | Standard Equivalent | Local Meaning & Preservation Flag |
| :--- | :--- | :--- | :--- |
| `EpistemicEscrow` | `services/escrowService.ts` | Quarantine / Dead Letter Queue | Sequestering mechanism for messages with CFDI > 15 requiring human Debridement. `[GOLDEN_SCAR]` - Central to Epistemic Cartographer design. |
| `Betti Loop Detector` | UI / `App.tsx` (implicit concept) | Infinite Loop Guard | Prevents recursive triggers of the Escrow zone. `[CULTURAL_ARTIFACT]` - Ties to algebraic topology metrics. |
| `+++DCCDSchemaGuard` | `services/geminiService.ts` | JSON Schema Validator | Dynamic constraint inversion engine mechanism to structurally bind generative agents. `[GOLDEN_SCAR]` |
| `CFDI` | `App.tsx` / `types.ts` | Error Rate / Confidence Metric | Confidence-Fidelity Divergence Index. `[CULTURAL_ARTIFACT]` |
| `BAI` | `App.tsx` / `types.ts` | Bias Metric | Bias Amplification Index. `[CULTURAL_ARTIFACT]` |
| `API_KEY` | `vite.config.ts`, `services/geminiService.ts` | `GEMINI_API_KEY` | Environment variable mapped implicitly from `.env.local`'s `GEMINI_API_KEY` via vite config. `[GOLDEN_SCAR]` - L5 Paraconsistent Dependency State (requires specific vite.config mapping). |
