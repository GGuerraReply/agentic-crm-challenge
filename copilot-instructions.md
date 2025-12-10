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

### 3.2 Agent Mode – Controlled Execution

Agent Mode is used to:
- implement **approved plan steps**,
- create or modify files,
- generate functions, hooks and components.

Rules:
<!-- - Implement **one logical step at a time**. -->
- The developer must **approve or reject** each proposal.
Large autonomous rewrites are **forbidden** such as more than 15 files.

Example prompt:

> "Switch to Agent Mode.  
> Implement step 1 and 2 of the approved plan.  
> Follow project conventions, TypeScript strict and Tailwind v4."

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

## 6. Testing Guidelines

Even in a workshop context, testing should be considered whenever feasible,
especially for **pure logic and critical behavior**.

- Use **Jest** (or Vitest, depending on repo) as test runner.
- Use **React Testing Library** for component tests.

Priorities:

1. **Pure logic first**
   - Write unit tests for helper functions:
     - filtering
     - validation
     - CSV parsing
   - Test behavior, not implementation details.

2. **Component behavior**
   - For key components, test:
     - visible output given a state/props,
     - interactions (clicks, form submit),
     - loading and error states.

3. **Scope**
   - Aim for at least **1–2 meaningful tests per use case** if time allows.
   - Integration tests only for **complex interactions** (optional).

4. **Mocks**
   - Mock external dependencies and API calls (if any).
   - Keep tests fast and deterministic.

Example prompt:

> "Generate unit tests for the `applyCompanyFilters` helper using Jest.  
> Focus on behavior: no filters, status only, country only, combined filters."

---------------------------------------------------------------------

## 7. Security Guidelines (within this sandbox)

This project is a **workshop sandbox**, but basic security hygiene still
applies:

- Sanitize and validate user inputs where they are rendered back to the UI
  to prevent XSS-like issues.
- Avoid storing **sensitive data** in `localStorage` or `sessionStorage`.
- Do NOT embed secrets, tokens or credentials in code.
- Any external API calls (if introduced):
  - must use HTTPS,
  - must be clearly mocked or stubbed for the workshop.
- Prefer safe defaults:
  - never `dangerouslySetInnerHTML` unless absolutely necessary and justified.

Example prompt:

> "Review this form handling logic from a security perspective.  
> Identify potential XSS or unsafe patterns and propose safer alternatives."

---------------------------------------------------------------------

## 8. Accessibility Guidelines

Aim for **basic but meaningful accessibility**:

- Use **semantic HTML** elements where possible.
- Use proper **ARIA attributes and roles** when semantics alone are
  not enough.
- Ensure **keyboard navigation** works for interactive elements
  (buttons, links, inputs).
- Provide:
  - `alt` text for images,
  - descriptive text for icons when they convey meaning.
- Keep **color contrast** reasonable (Tailwind tokens usually help).
- When possible, test with accessibility tools (even minimally).

Example prompt:

> "Review this component for basic accessibility.  
> Suggest improvements for keyboard navigation and ARIA usage."

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

End of Instructions.
