# Dental Clinic Project Rules

## 1. Branch Strategy

- `main`: production-ready only.
- `develop/reception`: integration branch for the Reception module.
- Every feature MUST have its own branch from `develop/reception`.
- Naming:
  - `feature/reception-<name>`
  - `fix/reception-<name>`
  - `refactor/reception-<name>`
  - `docs/<name>`
- Never develop directly on `main`.
- Do not mix unrelated features in one branch.

## 2. Commit Rules

Use Conventional Commits:

- `feat(reception): ...`
- `fix(reception): ...`
- `refactor(web): ...`
- `refactor(api): ...`
- `style(web): ...`
- `test(reception): ...`
- `docs: ...`

A commit should represent one coherent change.

## 3. Architecture Rules

### Frontend

- Next.js App Router.
- TanStack Query owns server state.
- Zustand owns local UI state only.
- Zod owns runtime validation schemas.
- React Hook Form owns form state.
- UI primitives go in `components/ui`.
- Reception-specific components go in `components/reception`.
- Never place API calls directly inside visual components.
- Never duplicate modal, button, input, table, badge or card implementations.

### Backend

- NestJS modules are organized by domain.
- Controllers handle HTTP concerns only.
- Services contain business rules.
- Prisma is accessed through services only.
- Zod validation runs at API boundaries.
- Business workflow transitions must be validated in services.
- Do not encode business rules in the frontend.

### Database

- Patient is the person.
- Visit is a single operational visit.
- Appointment is a future booking.
- QueueEntry is the patient's current operational queue position.
- Financial data must never be stored as static UI values.
- Destructive deletion must be avoided when historical/financial records exist.

## 4. Code Quality

- Strict TypeScript.
- No `any` unless documented and temporary.
- Prefer small pure functions.
- Avoid files that combine UI, API, validation and business logic.
- Extract repeated logic after the second repetition.
- Names must describe business intent, not implementation detail.
- No magic strings for workflow states.
- Use enums or centralized constants for business states.

## 5. Definition of Done

A reception feature is complete only when:

1. UI works.
2. API exists.
3. Validation exists.
4. Database migration exists if required.
5. Loading, empty and error states exist.
6. Happy path works.
7. Invalid state transition is rejected.
8. Query cache is invalidated correctly.
9. No duplicated UI primitive is introduced.
10. Feature is tested manually against the reception workflow.
