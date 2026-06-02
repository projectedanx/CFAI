# TIER 5: Operational Runbook & Cultural Artifacts Log

## Operational Runbook

**Time-to-Deploy (TTD) Sequence**
*Measured TTD (from commit to production):* Indeterminate (No CI/CD pipeline).
*Target TTD:* < 3 minutes
*Bottleneck:* Entire process is manual.

### Local Development Sequence

1. **Clone & Install**:
   ```bash
   npm i
   ```
2. **Environment Setup** (⚠️ SILENT_REQUIRED_ENV):
   Create a `.env.local` file in the root directory.
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```
   *Note*: The application explicitly maps `process.env.API_KEY` to `env.GEMINI_API_KEY` in `vite.config.ts`. Failing to set this will cause `services/geminiService.ts` to throw an initialization error.
3. **Start Development Server**:
   ```bash
   npm run build
   # and run the output via a static server
   ```
4. **Validation (TDD Cycle)**:
   All code-producing tasks must include the full TDD cycle (Red-Green-Refactor) using Vitest.
   ```bash
   npm run test
   ```

## Symbolic Scar Tissue Log — Cultural Artifacts

Per DRP_7: Golden_Scar_Tension pattern. These artifacts are PRESERVED, not standardized. Φ-weighting: 1.618 (native logic) vs 1.000 (standard).

**Golden Scar #001: EpistemicEscrow**
- **Location:** `services/escrowService.ts`
- **Tension:** While standard software architecture might call this a "Dead Letter Queue" or "Error Boundary," renaming it would erase the fundamental architectural purpose: sequestering messages with a CFDI > 15 to await human Debridement.
- **Recommendation:** Document in JSDoc, do NOT rename.

**Golden Scar #002: +++DCCDSchemaGuard**
- **Location:** `services/geminiService.ts` (conceptual implementation via `EmergentConstraint`)
- **Tension:** It is not merely a "JSON Validator." It is the Dynamic Constraint Inversion Engine mechanism to structurally bind generative agents and prevent Epistemic Monoculture.
- **Recommendation:** Preserve the PDL notation in documentation and agent prompts.

**Cultural Artifact #001: API_KEY vs GEMINI_API_KEY Mapping**
- **Location:** `vite.config.ts` lines 14-15
- **Developer Sub-Culture:** A discrepancy exists between how the UI/Services expect the key (`process.env.API_KEY`) and how Vite exposes it from `.env.local` (`env.GEMINI_API_KEY`). The config bridges this gap manually.
- **Standard Equivalent:** Unified naming (e.g., exclusively `VITE_GEMINI_API_KEY`).
- **Preservation Decision:** `[CULTURAL_ARTIFACT]` - L5 Paraconsistent State. Preserve mapping logic; standardizing might break decoupled backend expectations.
