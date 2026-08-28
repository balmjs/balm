#!/bin/bash

set -e

if [ -f ~/.zshrc ]; then
  ZSH_NPM_TOKEN=$(grep -E '^export NPM_TOKEN=' ~/.zshrc | cut -d '=' -f2-)
  if [ -n "$ZSH_NPM_TOKEN" ]; then
    export NPM_TOKEN="$ZSH_NPM_TOKEN"
  fi
fi

npm run build
npx lerna version premajor --no-git-tag-version --no-push --preid canary.$(git rev-parse --short HEAD) --exact --force-publish balm-core --yes
npm publish --workspace=packages/balm-core --tag canary
