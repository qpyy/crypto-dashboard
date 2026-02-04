# Best Practices (Crypto Sim)

This document captures the team conventions for hooks, stores, and UI logic.

## React Query + Snackbar
- Never show snackbars directly during render.
- Use `useEffect` to react to `isError`, or set `onError` in `useQuery`.
- Keep error messages user-friendly and consistent.

## Zustand Stores
- Keep stores focused on state and pure data updates.
- Avoid UI side effects inside store actions when possible.
- Prefer batch setters like `setPrices(record)` to reduce render churn.

## Hooks
- Avoid side effects outside of `useEffect`.
- Keep hooks small and single-purpose.
- Prefer `useMemo` only for expensive derivations.

## UI Components
- Use a single source of truth for display names (constants).
- Avoid hard-coded repeated strings; pull from constants or i18n.
- Keep layout CSS in component modules and avoid global overrides.
