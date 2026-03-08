# Contributing

## Workflow

1. Create a branch from `main`:
   - `feat/<short-description>`
   - `fix/<short-description>`
   - `chore/<short-description>`
2. Make one logical change per commit.
3. Run checks before push:
   - `npm run lint`
   - `npm run build`
4. Update `CHANGELOG.md` in `Unreleased` for every user-visible change.
5. Open PR or merge to `main`.
6. Deploy with `npm run deploy` after merge to `main`.

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

