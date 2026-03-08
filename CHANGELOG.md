# Changelog

All notable changes to this project are documented in this file.

The format is based on Keep a Changelog and this project uses Semantic Versioning.

## [Unreleased]

### Added

- GitHub Actions CI workflow (`.github/workflows/ci.yml`) for `format:check`, `lint`, `typecheck`, and `build`.
- ESLint plugins for TanStack Query and accessibility: `@tanstack/eslint-plugin-query`, `eslint-plugin-jsx-a11y`.
- `.env.example` template for local environment setup.

### Changed

- ESLint flat config extended with recommended TanStack Query and JSX accessibility rules.
- UI interactions in `ConfirmDialog`, `CustomSelect`, and `Sidebar` aligned with stricter a11y requirements.
- Trade amount/price validation hardened in UI and domain trading layer to reject non-finite input values.
- Sidebar overlay behavior updated to preserve blur while keeping consistent transparency on hover/focus.
- Git ignore rules extended for environment files.
- Project package manager migrated from npm to pnpm (`pnpm-lock.yaml`, Husky/CI/docs updated).

### Fixed

- Keyboard support and semantics for interactive UI elements in modal/select/sidebar components.
- Hidden options in `CustomSelect` no longer participate in keyboard tab order.
- Prevented invalid numeric input from reaching trade execution (`NaN`/`Infinity` guardrails).
- Continuous RAF animations now pause on `visibilitychange` when the tab is hidden and resume on return.

### Removed

- Tracked `.env` file removed from repository history of active files (kept local only).
- `package-lock.json` removed in favor of `pnpm-lock.yaml`.

## [0.3.0] - 2026-03-08

### Added

- Husky git-hooks with `pre-commit` and `pre-push` quality gates.
- `lint-staged` for staged lint autofix on commit.
- Prettier setup (`.prettierrc`, `.prettierignore`) with format scripts.

### Changed

- ESLint configuration strengthened for production workflow and stricter code quality checks.
- `package.json` scripts extended with `typecheck`, `lint:fix`, `format`, `format:check`, and `prepare`.
- Pre-commit flow updated to run Prettier before ESLint.

## [0.2.0] - 2026-03-08

### Added

- Pure trading domain module in `src/domain/trading`.
- Trading engine documentation in `docs/trading-engine.md`.

### Changed

- `usePortfolio` store now uses thin wrappers and delegates trade logic to `applyTrade`.
- Trade feedback (snackbar messages) is now derived from domain events and error codes.

### Fixed

- Reduced coupling between business logic and UI state layer.

### Removed

- Trade calculation branches from `usePortfolio` store implementation.

## [0.1.0] - 2026-03-08

### Added

- Persistent `profileId` for each browser profile in portfolio store.
- `CHANGELOG.md`, `CONTRIBUTING.md`, and commit message template.

### Changed

- Profit calculation switched to equity-based model (`netProfit = equity - initialBalance`).
- Reset flow keeps market prices and only resets portfolio state.
- Import sorting enforced via ESLint (`simple-import-sort`).

### Fixed

- ESLint config crash caused by missing `simple-import-sort` plugin import.
