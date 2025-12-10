# PLAN MODE – Contacts Persistence with SQLite

Enter **Plan Mode**.

You must analyze the Agentic CRM Challenge repository and produce a **technical
implementation plan** for the **Contacts Persistence with SQLite**.

---

## Feature Goal

Design and implement the **contacts persistence layer** using the SQLite client module. This includes:

- Connect the contacts list to SQLite database
- Implement new contact creation with database persistence
- Implement contact editing and deletion

---

## Constraints

- Browser-only implementation using `sql.js`
- No external database or backend
- TypeScript **strict**
- Follow all architectural and coding rules in `copilot-instructions.md`
- Do **NOT** generate full code, only a detailed implementation plan

---

## Your Output Must Include

1. **List of impacted files**
   - New core data module (e.g. `src/db/sqliteClient.ts`)
   - Any adapter or helper modules you propose
   - References from feature-specific data modules (contacts, companies, deals, etc.)

2. **Initialization & lifecycle strategy**
   - How `sql.js` will be loaded and initialized
   - How the database instance will be created and shared
   - How the schema will be applied at startup

3. **Public API design**
   - Proposed TypeScript API for the SQLite client
   - Helper methods for running queries (SELECT) and commands (INSERT/UPDATE/DELETE)
   - Error handling strategy and return shapes

4. **Integration with feature modules**
   - How feature-specific data modules (e.g. `contacts`, `companies`) should use the client
   - How to keep those modules thin and focused on domain queries
   - Strategies to avoid circular dependencies

5. **State persistence (optional)**
   - If applicable, how the database could be persisted/exported/imported
   - Simplifications acceptable for the workshop (e.g. in-memory only by default)

6. **Testing & debugging approach**
   - How to manually verify that the client and schema work together
   - Recommended patterns for logging or debugging SQL queries in dev

7. **Step-by-step execution plan**
   - Ordered steps to design, implement and integrate the SQLite client
   - Suitable for Agent Mode execution with clear milestones

8. **Risks, simplifications and future improvements**
   - Limitations of in-browser SQLite and how to mitigate them
   - Simplifications appropriate for a training environment
   - Future enhancements (e.g. migrations, versioning, snapshot/restore)

---

Important:

- Do **NOT** generate any code.
- Provide a clean, incremental implementation plan aligned with `copilot-instructions.md`.
