#!/bin/bash

if [ -f ~/.zshrc ]; then
  ZSH_NPM_TOKEN=$(grep -E '^export NPM_TOKEN=' ~/.zshrc | cut -d '=' -f2-)
  if [ -n "$ZSH_NPM_TOKEN" ]; then
    export NPM_TOKEN="$ZSH_NPM_TOKEN"
  fi
fi

npm run build
lerna publish premajor --no-git-tag-version --no-push --preid canary.$(git rev-parse --short HEAD) --exact --dist-tag canary --force-publish balm-core --no-verify-access
