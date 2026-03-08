# Contributing

## Workflow

1. Create a branch from `main`:
   - `feat/<short-description>`
   - `fix/<short-description>`
   - `chore/<short-description>`
2. Make one logical change per commit.
3. Run checks before push:
   - `corepack pnpm run format:check`
   - `corepack pnpm run lint`
   - `corepack pnpm run typecheck`
   - `corepack pnpm run build`
4. Update `CHANGELOG.md` in `Unreleased` for every user-visible change.
5. Open PR or merge to `main`.
6. Deploy with `corepack pnpm run deploy` after merge to `main`.

## Architecture Docs

Before changing trading/store logic, read:

- `docs/state-architecture.md`
- `docs/trading-engine.md`

## Quality Gates (Husky)

Hooks are configured via Husky and run automatically:

- `pre-commit`: `lint-staged` (prettier + eslint --fix for staged files)
- `pre-push`: `format:check` + full `lint` + `typecheck`

Setup command:

`corepack pnpm run prepare`

## Commit Message Format

Use Conventional Commit style:

`type(scope): short summary`

Examples:

- `feat(portfolio): add persistent profile id`
- `fix(statistics): correct net profit formula`
- `chore(eslint): enable import sorting plugin`

Recommended `type` values:

- `feat`
- `fix`
- `refactor`
- `perf`
- `test`
- `docs`
- `chore`

## Changelog Rules

- Keep `Unreleased` section always at the top.
- Move `Unreleased` entries into a version section during release.
- Use date format `YYYY-MM-DD`.
- Only include notable changes (feature, bug fix, breaking behavior, UX/API changes).
