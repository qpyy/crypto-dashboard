# Changelog

All notable changes to this project are documented in this file.

The format is based on Keep a Changelog and this project uses Semantic Versioning.

## [Unreleased]

### Added
- Add new user-facing features here.

### Changed
- Add updates to existing behavior here.

### Fixed
- Add bug fixes here.

### Removed
- Add removed/deprecated behavior here.

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

