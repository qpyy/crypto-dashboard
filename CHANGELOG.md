# Changelog

All notable changes to this project are documented in this file.

The format is based on Keep a Changelog and this project uses Semantic Versioning.

## [Unreleased]

### Added
- No changes yet.

### Changed
- No changes yet.

### Fixed
- No changes yet.

### Removed
- No changes yet.

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
