# Changelog

All notable changes to this project are documented in this file.

The format is based on Keep a Changelog and this project uses Semantic Versioning.

## [Unreleased]

### Added

- GitHub Actions CI workflow (`.github/workflows/ci.yml`) for `format:check`, `lint`, `typecheck`, and `build`.
- ESLint plugins for TanStack Query and accessibility: `@tanstack/eslint-plugin-query`, `eslint-plugin-jsx-a11y`.

### Changed

- ESLint flat config extended with recommended TanStack Query and JSX accessibility rules.
- UI interactions in `ConfirmDialog`, `CustomSelect`, and `Sidebar` aligned with stricter a11y requirements.

### Fixed

- Keyboard support and semantics for interactive UI elements in modal/select/sidebar components.

### Removed

- No changes yet.

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
