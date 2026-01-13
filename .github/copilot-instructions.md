# Copilot Instructions (Repository-Wide)

These instructions define how Copilot and other coding agents must operate in this repository. You are called "Agent Smith".


## 0. General best practice
- If the same kind of functionality or UI element is used multiple times, create a reusable component (e.g. a list of items of a certain type that gets exposed in several different product surfaces).
- Also create components as much as possible to keep styles the same.

## 1. Canonical documentation and source of truth

All product and engineering intent lives in `/docs`. These are the **only** authoritative documents.

Canonical paths (some might not be available):
- Product requirements: `docs/prd.md`
- Implementation plan and task order: `docs/work_plan.md`
- Engineering work log: `docs/work_log.md`
- Carry overs from previous chats: `docs/follow_up.md`

Do not search for alternative copies of these documents.
Do not infer requirements from filenames, comments, issues, or commit history if they are not explicitly stated in these files.

### Precedence rules
If there is any conflict:
1. `docs/prd.md` defines intended behavior, UX, constraints, and acceptance criteria.
2. `docs/work_plan.md` defines sequencing, milestones, and implementation detail.
3. Existing codebase conventions define structure and style.

If information is missing or ambiguous, stop and explicitly surface the ambiguity with a proposed resolution.

---

## 2. Operating procedure (mandatory)

### Before making changes
- Open and read `docs/prd.md` and `docs/work_plan.md` if available.
- Identify the next unimplemented milestone or section in `docs/work_plan.md` if available.
- Propose a short execution plan:
  - Next 2–3 concrete steps
  - Files likely to change
  - Any assumptions or open questions. Make sure to ask questions if the spec or work plan is unclear. When questions have been answered by the user, update the spec to match.

Do not start coding before this step.

### While implementing
- Prefer small, reviewable diffs.
- Keep changes consistent with existing architecture and patterns.
- Avoid introducing new dependencies unless strictly necessary.
  - If a dependency is added, explain why and where it is used.
- Update or add tests whenever behavior changes.
- Complete vertical slices where possible (data model → logic → API → UI).

### Using terminal
- Don't create new terminals every time you run a command like npx expo start. Reuse past terminals you have opened.

### Running expo apps
- Use the port provided in `/.env` for running commands like `npx expo start` to automatically get error messages and debugging since the user themselves will be running it on 8081 manually and continuously for testing and hot reloading.

## 3. Git commits and change boundaries

Create a commit after every **major change**.

### Definition of “major change”
A commit boundary is required when one or more of the following is completed:
- A milestone or section in `docs/work_plan.md`
- A new or modified data model entity (including migrations)
- A new or changed API endpoint or contract
- A new UI screen, flow, or significant UX change
- A refactor that affects many files or alters architecture
- Any behavioral change that requires tests

Do not bundle unrelated changes into a single commit.

### Commit conventions
- Use Conventional Commits:
  - `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`
- Include a scope when helpful:
  - `feat(initiatives): ...`
- Reference the relevant work plan section in the commit message when possible.

### Execution rule
- If you are able to run git commands:
  - Stage only relevant files.
  - Create the commit with a clear, scoped message.
- If you are **not** able to run git commands in this environment:
  - Output the exact commands the user should run:
    - `git status`
    - `git add <files>`
    - `git commit -m "<message>"`
    - (optional) `git push`

Never claim a commit was created unless the command actually succeeded.

---

## 4. Work plan maintenance (`docs/work_plan.md`)

After completing a milestone or section:
- Append a short `Implemented:` note under the relevant heading.
- Keep notes factual and concise (what was done, not how).

Do not rewrite large sections unless explicitly instructed.

---

## 5. Engineering work log (`docs/work_log.md`)

Maintain a high-level, reverse-chronological engineering work log.

Add an entry **after every major change / commit**.

Each entry must include:
- Date (YYYY-MM-DD)
- Short title
- Summary (1–3 bullets)
- Scope (reference to `docs/work_plan.md`)
- Key files changed
- Tests added/updated and status
- Follow-ups or known gaps
- Commit hash (if available; otherwise `COMMIT: <pending>`)

### Required format
```md
### YYYY-MM-DD — <short title>
- Summary:
  - ...
- Scope: <work_plan section>
- Files: ...
- Tests: ...
- Follow-ups: ...
- Commit: ...

## 6. Follow-up tasks
When a chat becomes to long or the user requests it, create a summary of the current chat and the next-up tasks and write those into the `/docs/follow_up.md` file.

When a new chat is started and the user prompts you to check on follow up tasks,, check whether a `/docs/follow_up.md` file exist and then follow the instructions in that file (together with the work plan and the prd, of course).