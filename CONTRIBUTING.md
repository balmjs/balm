# Contributing to BalmJS

BalmJS is an open source project that accepts contributions from community members.

If you’ve never contributed to an open source project before, take a look at GitHub’s [Contributing to Open Source on GitHub](https://guides.github.com/activities/contributing-to-open-source/) to learn some of the basics.

Before submitting your contribution, please make sure to take a moment and read through the following guidelines:

- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing Project Tests](#contributing-project-tests)
- [Financial Contribution](#financial-contribution)

## Issue Reporting Guidelines

If you find a bug in the source code or a mistake in the documentation, you can help us by submitting an issue to the GitHub repository for that platform.

Even better: propose a fix with a pull request and link it to the issue!

## Pull Request Guidelines

- The `master` branch is just a snapshot of the latest stable release. All development should be done in dedicated branches. **Do not submit PRs against the `master` branch.**

- Checkout a topic branch from a base branch, e.g. `dev`, and merge back against that branch.

- If adding a new feature:

  - Add accompanying test case.
  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first and have it approved before working on it.

- If fixing a bug:

  - If you are resolving a special issue, add `(fix #xxxx[,#xxxx])` (#xxxx is the issue id) in your PR title for a better release log, e.g. `update entities encoding/decoding (fix #1024)`.
  - Provide a detailed description of the bug in the PR. Live demo preferred.
  - Add appropriate test coverage if applicable.

- It's OK to have multiple small commits as you work on the PR - GitHub can automatically squash them before merging.

- Make sure tests pass!

- Commit messages must follow the [commit message convention](https://www.conventionalcommits.org/). Commit messages are automatically validated before commit.

- No need to worry about code style as long as you have installed the dev dependencies - modified files are automatically formatted with Prettier on commit.

## Development Setup

You will need [Node.js](http://nodejs.org) **version 12+**, and [Yarn 1.x](https://yarnpkg.com/en/docs/install).

After cloning the repo, run:

```bash
$ yarn # install the dependencies of the project
```

A high level overview of tools used:

- [TypeScript](https://www.typescriptlang.org/) as the development language
- [Babel](https://babeljs.io/) for bundling
- [Mocha](https://mochajs.org/) for unit testing
- [Prettier](https://prettier.io/) for code formatting

## Scripts

### `yarn build`

The `build` script builds all public packages.

### `yarn test`

The `test` script simply calls the `mocha` binary, so all Mocha CLI Options can be used.

## Project Structure

This repository employs a [monorepo](https://en.wikipedia.org/wiki/Monorepo) setup which hosts a number of associated packages under the `packages` directory:

- `balm-core`: The **BalmJS** workflow compiler core package for global.

- `balm`: The **BalmJS** workflow runtime core package for local.

## Contributing Project Tests

```
test-workspace
├─┬ config
│ └─┬ awesome-project
│   └── index.js
├─┬ awesome-project
│ └── ...
├── src
├── balm.env.js
└── package.json
```

- `awesome-project`: Create a test project (e.g. `vue`), please refer to `src` for project structure.

- `config/awesome-project/index.js`: The configuration corresponding to your test project.

- `balm.env.js`: update `BALM_ROOT` for your local development environment

- update `package.json` scripts:

  - `"awesome:dev": "balm --config config/awesome-project"`
  - `"awesome:prod": "balm -p --config config/awesome-project"`

- Let's enjoy!

> NOTE: Before starting your project, remember to run `yarn build` in the repo root directory.

## Financial Contribution

As a pure community-driven project without major corporate backing, we also welcome financial contributions via OpenCollective.

- [Become a backer or sponsor on OpenCollective](https://opencollective.com/balmjs)
