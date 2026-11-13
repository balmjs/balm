# Releasing BalmJS (`6.x`)

This repository manages multi-package releases for **`balm-core`** and **`balm`** using [Changesets](https://github.com/changesets/changesets) (`@changesets/cli`) and `pnpm` workspaces.

---

## 1. Release Architecture

| Component | Configuration / Location | Role |
| :--- | :--- | :--- |
| **Base branch** | `.changeset/config.json` (`"baseBranch": "6.x"`) | Integration and release branch for Balm 6.x |
| **Fixed package group** | `"fixed": [["balm", "balm-core"]]` | Keeps `balm` and `balm-core` strictly on the same version |
| **Ignored workspace** | `"ignore": ["playground"]` | Excludes the private `playground` app from versioning |
| **Monorepo root** | `package.json` (`"private": true`, no `"version"`) | Holds workspace scripts without drifting behind package versions |
| **Prerelease state** | `.changeset/pre.json` (`{"mode": "pre", "tag": "alpha"}`) | Keeps Changesets in `6.0.0-alpha.x` prerelease mode |
| **Internal link** | `packages/balm/package.json` (`"balm-core": "workspace:*"`) | Rewritten to exact version automatically by `pnpm publish` |
| **CLI version** | `packages/balm/src/cli.ts` (`getCliVersion()`) | Reads `packages/balm/package.json` at runtime so `balm --version` stays accurate |
| **Tarball contents** | `"files"` in each package's `package.json` | Publishes only built artifacts (`dist/`, plus `bin/` for `balm`) |

> **Important**: Never run plain `npm publish` directly inside `packages/balm`. Doing so leaves `"balm-core": "workspace:*"` unexpanded in the published manifest. Always publish via `pnpm release` (which delegates to `changeset publish` -> `pnpm publish`).

---

## 2. npm Dist-Tags Strategy

Both `balm` and `balm-core` maintain distinct npm distribution tags:

- **`alpha`** (`6.0.0-alpha.x`): Active `6.x` prerelease channel while `.changeset/pre.json` has `"mode": "pre", "tag": "alpha"`.
- **`latest`** (`4.34.0` currently): Default install channel (`npm install balm`). `6.x` promotes to `latest` once it exits prerelease.
- **`next`** (`5.2.0`): Previous 5.x preview line.
- **`legacy`** (`3.37.0`): Legacy 3.x maintenance tag.

When `.changeset/pre.json` is active (`mode: "pre"`), run `changeset publish` **without** `--tag`. `@changesets/cli` automatically selects `preState.tag` (`alpha`) and forbids passing an explicit `--tag` flag in pre mode.

---

## 3. Contributor Workflow: Adding a Changeset

Every user-facing change to `packages/balm-core` or `packages/balm` should include a Changeset file generated in **English**.

1. Generate a changeset interactively:

   ```bash
   pnpm changeset
   ```

2. Select the affected package(s) (`balm-core`, `balm`, or both — because they are `fixed`, bumping either bumps both together).
3. Choose the bump type (`patch`, `minor`, or `major`). While in `pre` mode, any bump increments the prerelease counter (`6.0.0-alpha.N` -> `6.0.0-alpha.(N+1)`).
4. Write a concise **English** summary for `CHANGELOG.md`.
   - Start with plain text (do **not** prefix the first line with `- `, because `@changesets/cli/changelog` automatically wraps the first line in a bullet).
   - Add any optional sub-bullets on subsequent lines starting with `- ` (`@changesets/cli/changelog` indents follow-up lines automatically).
5. Commit the generated `.changeset/<random-name>.md` file together with your code changes using English Conventional Commits (`feat(core): ...`, `fix(cli): ...`).

Check queued releases anytime without modifying files:

```bash
pnpm changeset:status
```

---

## 4. Releasing a Prerelease (`6.0.0-alpha.x`) Locally

### Prerequisites

- Clean working tree on `6.x` synced with `origin/6.x`:

  ```bash
  git checkout 6.x
  git pull --ff-only origin 6.x
  git status
  ```

- Logged in to npm with publish permissions for `balm` and `balm-core`:

  ```bash
  npm whoami
  ```

- Confirm `.changeset/pre.json` is in `alpha` pre mode (`{"mode": "pre", "tag": "alpha"}`) and at least one `.changeset/*.md` file exists (`pnpm changeset:status`).

### Release Steps

1. **Apply version bumps & generate English changelogs**

   ```bash
   pnpm version-packages
   ```

   This runs `changeset version && pnpm install --lockfile-only`, which:
   - Bumps `packages/balm-core/package.json` and `packages/balm/package.json` to the next `6.0.0-alpha.x` version.
   - Prepends the English release notes to `packages/balm-core/CHANGELOG.md` and `packages/balm/CHANGELOG.md`.
   - Archives consumed changeset files from `.changeset/*.md` into `.changeset/pre/`.

2. **Review generated changes**

   ```bash
   git status
   git diff packages/*/package.json packages/*/CHANGELOG.md
   ```

3. **Commit the release preparation commit**

   ```bash
   git add -A
   git commit -m "chore(release): version 6.0.0-alpha.x"
   ```

4. **Test, build, and publish to npm**

   ```bash
   pnpm release
   ```

   This executes `pnpm test && pnpm build && changeset publish`:
   - Runs the full Vitest suite (`pnpm test`).
   - Builds ESM/CJS bundles and `.d.ts` files (`pnpm build`).
   - Publishes `balm-core` first, then `balm` (rewriting `"balm-core": "workspace:*"` cleanly) under `--tag alpha --access public`.
   - Prompts for your npm 2FA OTP if required (or supply `NPM_CONFIG_OTP=<code> pnpm release`).
   - Creates annotated git tags (`balm-core@6.0.0-alpha.x`, `balm@6.0.0-alpha.x`).

5. **Push commits and git tags**

   ```bash
   git push --follow-tags origin 6.x
   ```

6. **Verify registry & CLI**

   ```bash
   npm view balm dist-tags --json
   npm view balm-core dist-tags --json
   node ./packages/balm/bin/balm.js --version
   ```

---

## 5. Promoting `6.x` Beyond Alpha (Beta / RC / Stable `6.0.0`)

### Switching Prerelease Channels (`alpha` -> `beta` -> `rc`)

```bash
pnpm pre:exit
npx changeset pre enter beta   # or: rc
```

Update `.changeset/pre.json`, ensure pending changesets exist (if any), and follow Section 4. When `.changeset/pre.json` says `"tag": "beta"`, `pnpm release` automatically publishes under `--tag beta`.

### Graduating to Stable `6.0.0` (`@latest`)

1. Exit prerelease mode:

   ```bash
   pnpm pre:exit
   ```

   This marks `.changeset/pre.json` with `"mode": "exit"`.

2. Apply version bump:

   ```bash
   pnpm version-packages
   ```

   Changesets deletes `.changeset/pre.json`, graduates both packages to `6.0.0`, and rolls prerelease notes cleanly into the `## 6.0.0` section in each `CHANGELOG.md`.

3. Review, commit (`chore(release): version 6.0.0`), run `pnpm release` (now automatically publishes under `@latest`), and `git push --follow-tags origin 6.x`.

> **Tip**: Because `npm install balm@latest` will switch from `4.34.0` to `6.0.0` once `6.0.0` is published under `latest`, consider creating a dedicated dist-tag (e.g., `npm dist-tag add balm@4.34.0 v4`) before graduating `6.0.0` to `latest` if 4.x users need a named channel.

---

## 6. Automated Releases via GitHub Actions

Two workflows live under `.github/workflows/`:

- **`.github/workflows/ci.yml`**: Runs `pnpm install --frozen-lockfile`, `pnpm build`, CLI `--version` check, and `pnpm test` across Node.js `18`, `20`, and `22` on every push and PR targeting `6.x`.
- **`.github/workflows/release.yml`**: Runs `changesets/action@v1` on pushes to `6.x` (or manual `workflow_dispatch`):
  - When unreleased `.changeset/*.md` files are present on `6.x`, it opens or updates a **"Version Packages"** Pull Request (`chore(release): version packages`).
  - Merging that PR triggers `pnpm release`, publishing unpublished package versions to npm and pushing git tags automatically.

### Enabling CI Publishing

`release.yml` automatically skips running when `NPM_TOKEN` is absent so regular pushes stay green while developing locally. To enable automated CI publishing:

1. Create an npm **Automation** token (bypasses interactive OTP prompts) on npmjs.com.
2. Add it as a GitHub repository secret named **`NPM_TOKEN`** under **Settings -> Secrets and variables -> Actions**.
3. Ensure repository **Settings -> Actions -> General -> Workflow permissions** allows **Read and write permissions** (plus PR creation if opening Version Packages PRs via `GITHUB_TOKEN`).

---

## 7. Package Tarball Verification & Troubleshooting

### Inspecting Package Tarballs Before Publishing

Always verify that only intended build artifacts and manifests are included (no `src/`, `tsconfig.json`, or `tsup.config.ts`):

```bash
pnpm build
(cd packages/balm-core && npm pack --dry-run)
(cd packages/balm && npm pack --dry-run)
```

### Common Issues

- **`Releasing under custom tag is not allowed in pre mode!`**
  - Caused by passing `--tag ...` to `changeset publish` while `.changeset/pre.json` is active (`mode: "pre"`). Use `pnpm release` (which invokes `changeset publish` with no `--tag` flag).
- **`pnpm release` fails mid-publish (network error or OTP expiry)**
  - `changeset publish` checks the npm registry before publishing each package, so already-published versions are skipped safely. Fix authentication/network and re-run `pnpm release`.
- **npm publish succeeded, but git tags were not created or pushed**
  - Run `pnpm release:tag && git push --follow-tags origin 6.x`.
- **Uncommitted changes check before releasing**
  - Always verify `git status` is completely clean before running `pnpm version-packages` or `pnpm release`.
