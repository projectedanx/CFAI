# TIER 2: Architecture Topology Map

Generated via Mycelial CI Trace (DRP_7_PATTERN_MODEL).
**Betti-1 Cycle Status**: CLEAN (No circular dependencies detected in static analysis)
**Dependency Graph Depth**: 4 (max: 8)

```mermaid
graph TD
    subgraph ENV["Environment Layer (Local)"]
        E1[".env.local (Required)"]
        E2["SILENT_REQUIRED_ENV: GEMINI_API_KEY<br/>⚠️ Extracted via process.env map"]
    end

    subgraph APP["Application Layer (React/Vite)"]
        A1["Entry Point<br/>index.tsx / index.html"]
        A2["Main Application<br/>App.tsx"]

        subgraph COMPONENTS["Components (src/components)"]
            C1["Header.tsx"]
            C2["LearningProgressChart.tsx"]
            C3["ModelColumn.tsx"]
            C4["TaskInputForm.tsx"]
        end

        subgraph SERVICES["Services (src/services)"]
            S1["geminiService.ts<br/>(+++DCCDSchemaGuard injection)"]
            S2["escrowService.ts<br/>(EpistemicEscrow Quarantine)"]
        end
    end

    subgraph TEST["Test Layer"]
        T1["Vitest Config<br/>vite.config.ts"]
        T2["Unit Tests<br/>epistemicEscrow.test.ts"]
        T3["test.js<br/>(Orphaned/Ad-hoc script)"]
    end

    subgraph CI["CI/CD Layer"]
        CI1["ORPHANED_INFRASTRUCTURE<br/>⚠️ No .github/workflows detected"]
    end

    E1 --> E2
    E2 -->|Mapped via vite.config.ts| S1

    A1 --> A2
    A2 --> COMPONENTS
    A2 --> SERVICES

    C3 --> S1
    C3 --> S2

    T1 --> T2

    classDef warning fill:#fef3c7,stroke:#d97706,color:#000
    classDef golden fill:#fde68a,stroke:#b45309,color:#000
    classDef phantom fill:#fee2e2,stroke:#dc2626,color:#000
    classDef clean fill:#d1fae5,stroke:#059669,color:#000

    class E2,CI1 warning
    class S1,S2 golden
    class T3 phantom
```
