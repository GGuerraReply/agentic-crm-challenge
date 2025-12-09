# PLAN MODE – SQLite Schema Design

Enter **Plan Mode**.

You must analyze the Agentic CRM Challenge repository and produce a **technical
implementation plan** for the **SQLite schema** that will support all CRM features.

---

## Feature Goal

Design or refine the **SQLite database schema** (using sql.js in the browser)
to support the main CRM entities:

- Contacts
- Companies
- Deals
- Tasks
- Notes

The schema should be consistent, normalized enough for this scope, and aligned
with the domain needs of the challenge.

---

## Constraints

- Database runs fully in the browser using `sql.js`
- No external database server or backend
- Schema must be compatible with TypeScript models used in the app
- Primary keys should be stable and unique
- Foreign keys and relationships should be clearly defined conceptually
- Follow all rules in `copilot-instructions.md`
- Do **NOT** generate full SQL code, only a detailed schema plan

---

## Your Output Must Include

1. **List of impacted files**
   - Existing or new module that defines the schema (e.g. `src/db/schema.ts`)
   - Any initialization/bootstrap code that applies the schema
   - Other modules that will depend on the schema structure

2. **Entity-level schema design**
   - Conceptual table design for each entity (contacts, companies, deals, tasks, notes)
   - Columns, data types at a high level, and required vs optional fields
   - Assumptions about IDs (integer vs text UUIDs, etc.)

3. **Relationships & constraints**
   - How contacts relate to companies and deals
   - How tasks and notes relate to other entities (via foreign keys or polymorphic pattern)
   - Constraints such as uniqueness (emails, VAT numbers) and NOT NULL fields

4. **Indexing strategy (conceptual)**
   - Which columns should be indexed for typical CRM queries
   - Trade-offs between simplicity and query performance in a browser context

5. **Initialization & migration approach**
   - How the schema is applied on first load
   - How future, non-breaking schema changes could be handled for the workshop
   - Simplifications acceptable for an in-memory / browser-only database

6. **Integration with TypeScript models**
   - How the schema maps to TypeScript interfaces used in the app
   - Considerations to keep models and schema in sync over time

7. **Step-by-step execution plan**
   - Ordered steps to design, document, and implement the schema definition
   - Suitable for Agent Mode execution
   - Include basic tests/queries to validate that schema supports key use cases

8. **Risks, simplifications and future extensions**
   - Simplifications acceptable for the challenge (e.g. limited constraints)
   - Potential limitations of running SQLite in-memory via sql.js
   - Future extensions (extra tables, audit logs, advanced relationships)

---

Important:
- Do **NOT** generate actual SQL statements.
- Focus on a clear conceptual schema and implementation plan aligned with `copilot-instructions.md`.
