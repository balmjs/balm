#!/bin/bash

set -e

if [ -f ~/.zshrc ]; then
  ZSH_NPM_TOKEN=$(grep -E '^export NPM_TOKEN=' ~/.zshrc | cut -d '=' -f2-)
  if [ -n "$ZSH_NPM_TOKEN" ]; then
    export NPM_TOKEN="$ZSH_NPM_TOKEN"
  fi
fi

npm run build
npx lerna version "$@"
npm publish --workspace=packages/balm-core --tag "${NPM_DIST_TAG:-next}"
npm publish --workspace=packages/balm --tag "${NPM_DIST_TAG:-next}"
