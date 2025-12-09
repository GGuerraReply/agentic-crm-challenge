# GitHub Copilot Instructions – agentic-crm-challenge

Purpose: Practical and controlled use of GitHub Copilot (Chat, Plan Mode,
Agent Mode) within this React + TypeScript + Vite CRM codebase.

This document defines:
- how Copilot must be used,
- how Plan Mode and Agent Mode are applied,
- which repo conventions and quality standards must be respected.

---------------------------------------------------------------------

## 1. Setup

- Install extensions:
  - GitHub Copilot
  - GitHub Copilot Chat
- Sign in with GitHub and ensure organization policy allows Copilot.
- VS Code settings:
  - Enable inline suggestions and Chat access to workspace.
  - Allow multi-line completions.
  - Enable format on save.
- Formatting & linting:
  - ESLint enabled.
  - Prettier enabled.
- Policies:
  - Follow Microsoft/OpenAI content policies.
  - Do NOT generate secrets, tokens, or credentials.

---------------------------------------------------------------------

## 2. Repo Conventions (must be referenced in prompts)

- Language: **TypeScript strict**
- Framework: **React 19**
- Build tool: **Vite**
- Styling: **Tailwind CSS v4** (utility-first)
- Imports:
  - Use path alias `@/*` → `src/*`
  - Example:
    `import { x } from '@/lib/utils'`
- ESLint:
  - `rules-of-hooks`
  - `exhaustive-deps`
- Components:
  - Prefer `src/components/ui/*` primitives before creating new ones.
- Data:
  - **Browser-only**.
  - Use mock data in `src/crm/mock/*`.
  - Optionally SQLite in browser via `sql.js`.
- Shared logic:
  - Hooks: `src/hooks/*`
  - Utils: `src/lib/*` (pure, typed).

When prompting Copilot, always assume and **reinforce** these conventions.

---------------------------------------------------------------------

## 3. Core Working Modes

### 3.1 Plan Mode – Reasoning & Architecture

Plan Mode is used to:
- analyze the existing codebase,
- identify impacted components and files,
- propose a structured implementation plan,
- highlight risks and dependencies.

Plan Mode MUST:
- include file-level impact,
- avoid generating full code,
- stay within browser-only constraints.

Example prompt:

> "Analyze this CRM repository.  
> I need to implement [USE CASE].  
> Enter Plan Mode and produce a step-by-step technical implementation plan.  
> List impacted files, new components, state changes and risks."

The generated plan MUST be **reviewed and simplified by the developer**
before moving to Agent Mode.

---

### 3.2 Agent Mode Rules (TO BE FILLED BY PARTICIPANTS)

- Maximum scope per Agent execution:  
  `[[ e.g. one component / one helper / one page ]]`

- Acceptance rules for Agent output:  
  `[[ Must compile, respect Tailwind, no new libs, etc. ]]`

- When the team will stop Agent Mode and code manually:  
  `[[ Conditions ]]`

---

### 3.3 Refinement Mode

After implementation:
- Use Agent Mode for:
  - refactoring,
  - UX polish,
  - validation improvements,
  - minor test generation.

Example:

> "Refactor this implementation for readability and consistency with project  
> conventions. Do not change behavior."

---------------------------------------------------------------------

## 4. Prompting Best Practices

When using Copilot Chat:

- Always provide:
  - clear **goal**,
  - **constraints** (TS strict, Tailwind, browser-only…),
  - relevant **file paths**,
  - important **types/interfaces**.
- Always reference:
  - **React 19**
  - **Tailwind v4**
  - **TypeScript strict**
  - `@` import alias.
- Ask for:
  - **minimal diffs**,
  - **list of modified files**,
  - **explanation of assumptions**.
- Prefer:
  - composition using existing UI primitives (`src/components/ui/*`),
  - small, incremental changes over big-bang rewrites.
- After generation:
  - ask Copilot to propose **validation** and **test** steps.

---------------------------------------------------------------------

## 5. Common Tasks & Locations

- Feature pages: `src/crm/pages/*`
- Feature components: `src/crm/components/*`
- Shared UI: `src/components/ui/*`
- Hooks: `src/hooks/*`
- Utilities: `src/lib/*`
- Mock data: `src/crm/mock/*`

When asking Copilot to create something, **always** specify the target
folder (e.g. “under `src/crm/components`”).

---------------------------------------------------------------------

## 6. Testing Guidelines (TO BE FILLED BY PARTICIPANTS)

Select at least one:

- `[ ]` Unit tests for pure logic  
- `[ ]` Component behavior tests  
- `[ ]` No tests due to time constraints (must justify)

Target areas to test:  
`[[ e.g. filters helper, validation, CSV parser ]]`

---------------------------------------------------------------------

## 7. Security Guidelines (TO BE FILLED BY PARTICIPANTS)

### Fixed Rules
- No secrets in code.
- No sensitive data in localStorage/sessionStorage.
- Validate user input before rendering.

### Team Notes (Optional)
`[[ Optional additional notes ]]`

---------------------------------------------------------------------

## 8. Accessibility Guidelines (TO BE FILLED BY PARTICIPANTS)


- `[ ]` Using semantic HTML  
- `[ ]` Ensuring keyboard navigation for main interactions  
- `[ ]` Providing basic aria-labels / alt text  

Known limitations:  
`[[ Optional ]]`

---------------------------------------------------------------------

## 9. Implementation Process Checklist

For each feature/use case, the recommended implementation flow is:

1. **Plan**
   - Understand the requirement.
   - Use **Plan Mode** to generate a technical plan.
   - Simplify and approve the plan.

2. **Structure**
   - Identify or create:
     - target page/component,
     - supporting hooks/helpers,
     - any needed mock data.

3. **Types**
   - Define TypeScript interfaces and types early:
     - domain models,
     - props,
     - state shapes.

4. **Core Implementation**
   - Implement core components and logic:
     - UI structure using existing primitives,
     - state management (local state + hooks),
     - data handling (mock or in-memory).

5. **Behavior & UX**
   - Add:
     - form handling,
     - validation,
     - error and loading states,
     - basic accessibility.

6. **Testing & Polish**
   - Add tests for critical helpers / behavior if time allows.
   - Run `npm run lint` and fix issues.
   - Refactor for readability and consistency.

7. **Documentation**
   - Add minimal documentation:
     - comments where non-obvious,
     - short notes in README or code about limitations and future work.

You can ask Copilot to **guide you through this checklist**:

> "Act as a senior React + TS developer.  
> Using the project conventions and this checklist, guide me step by step  
> to implement [USE CASE] in small, verifiable increments."

---------------------------------------------------------------------

## 10. Safety & Quality Rules

- No secrets or API keys in code.
- Browser-only execution (no unauthorized backend calls).
- Always run:
  - `npm run lint` before considering a feature “done”.
- Copilot can be used for:
  - self code review,
  - ESLint error explanation,
  - refactoring suggestions.

Example review prompt:

> "Review this diff against repo conventions.  
> Check hooks rules, imports, Tailwind usage and state handling.  
> Suggest improvements step by step."

---------------------------------------------------------------------

## 11. Developer Responsibilities

Even with Agent Mode active:

- Developers remain fully responsible for:
  - **correctness**,
  - **security & data handling**,
  - **maintainability**,
  - **accessibility** (within reason for the workshop).
- AI suggestions must always be:
  - **understood**,
  - **validated**,
  - **adapted** to the repo conventions.
- Blind copy–paste is forbidden.
- If AI proposes non-existing APIs or libraries:
  - reject, or
  - explicitly introduce them with full awareness.

---------------------------------------------------------------------

## 12. Workshop Operational Flow

1. Open the repository and run the CRM UI locally.
2. Choose a use case (challenge).
3. Activate **Plan Mode** using the corresponding `PLAN_MODE.md`.
4. Validate and simplify the plan.
5. Activate **Agent Mode** and implement step by step.
6. Add minimal tests for key logic if time allows.
7. Refine, lint, and polish.
8. Demo the feature and discuss where Copilot helped or struggled.

---------------------------------------------------------------------

## 13.  Definition of DONE (TO BE AGREED BY TEAM)

This challenge is considered **DONE** when:

- `[ ]` The main feature works end-to-end in the UI  
- `[ ]` The agreed Plan steps are completed  
- `[ ]` The selected testing expectations are met  
- `[ ]` Known limitations are documented  

Additional acceptance criteria:  
`[[ Optional ]]`


End of Instructions.
