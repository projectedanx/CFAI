# TIER 3: CI/CD Pipeline Cartograph

AST-to-YAML Reverse Trace complete.
**Status**: ⚠️ NOMINATIVE TRAP DETECTED - NO CI FOUND.

Per the Ground Truth Directive (Rule: *Never document what you cannot trace*), this repository lacks an automated CI/CD pipeline (e.g., GitHub Actions, GitLab CI). The documentation below represents the *manual* execution flow extracted from package.json scripts and developer heuristics.

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer
    participant Local as Local Environment
    participant Vite as Vite Dev Server
    participant Vitest as Vitest Runner

    Note over Dev,Local: Phase 1 — Environment Setup (Manual)
    Dev->>Local: npm install
    Dev->>Local: Create .env.local (Required: GEMINI_API_KEY)

    Note over Dev,Vite: Phase 2 — Local Development
    Dev->>Local: npm run dev
    Local->>Vite: Start Vite server
    Vite-->>Dev: Served on localhost

    Note over Dev,Vitest: Phase 3 — Validation (Manual)
    Dev->>Local: npm run test
    Local->>Vitest: Execute vitest run
    Vitest-->>Dev: Status: PASS/FAIL (TDD Cycle)

    Note over Dev,Local: Phase 4 — Build (Manual)
    Dev->>Local: npm run build
    Local->>Local: vite build
    Note over Dev,Local: ⚠️ MISSING LINK: No deployment step defined. Output remains in local /dist.
```

### Analysis
- **Missing CI**: The absence of a `.github/workflows` directory or similar CI manifest indicates that the "pipeline" is currently restricted to local developer machine execution.
- **Thermodynamic Test Waste**: Tests must be manually triggered via `npm run test` (mapped to `vitest run`). Failure to do so bypasses validation.
