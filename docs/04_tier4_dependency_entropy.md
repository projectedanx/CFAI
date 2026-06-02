# TIER 4: Dependency Matrix & Entropy Audit

Thermodynamic Lens (L3) applied based on `package.json` traversal.
Entropy Score: 0 = deterministic, 1 = fully chaotic.

## Build Reproducibility Index

| Dependency | Version Pin | Production? | CI Invoked? | Entropy Vector |
| :--- | :--- | :--- | :--- | :--- |
| `@google/genai` | `^1.25.0` (range) | ✅ Yes | ❌ No (No CI) | ⚠️ MEDIUM — range allows drift |
| `react` | `^19.2.0` (range) | ✅ Yes | ❌ No | ⚠️ MEDIUM — range allows drift |
| `react-dom` | `^19.2.0` (range) | ✅ Yes | ❌ No | ⚠️ MEDIUM — range allows drift |
| `recharts` | `^3.3.0` (range) | ✅ Yes | ❌ No | ⚠️ MEDIUM — range allows drift |
| `@types/node` | `^22.14.0` (range) | ❌ Dev only | ❌ No | ⚠️ MEDIUM |
| `typescript` | `~5.8.2` (tilde) | ❌ Dev only | ❌ No | ⚠️ LOW/MEDIUM |
| `vite` | `^6.2.0` (range) | ❌ Dev only | ❌ No | ⚠️ MEDIUM |
| `vitest` | `^4.1.7` (range) | ❌ Dev only | ❌ No | ⚠️ MEDIUM |

## Entropy Score by Layer

| Layer | Score | Primary Source |
| :--- | :--- | :--- |
| Environment (Docker/ENV) | 0.80 | Missing `.env.example`, 1 SILENT_REQUIRED_ENV (`GEMINI_API_KEY`), no Dockerfile. |
| Application Dependencies | 0.40 | 100% of production dependencies use semantic version ranges (`^`). |
| CI Pipeline | 1.00 | Total absence of CI/CD infrastructure. Manual execution only. |
| Infrastructure (IaC) | 1.00 | No IaC definitions found. |
| Test Coverage | 0.40 | `epistemicEscrow.test.ts` exists, but must be run manually. Ad-hoc `test.js` is orphaned. |
| **Overall Repository Entropy** | **0.72** | **Target: < 0.15 (Critical Intervention Required)** |

**Analysis**: The repository suffers from high structural entropy due to the complete lack of automated CI/CD validation and environment documentation (`.env.example`).
