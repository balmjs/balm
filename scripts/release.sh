#!/bin/bash

if [ -f ~/.zshrc ]; then
  ZSH_NPM_TOKEN=$(grep -E '^export NPM_TOKEN=' ~/.zshrc | cut -d '=' -f2-)
  if [ -n "$ZSH_NPM_TOKEN" ]; then
    export NPM_TOKEN="$ZSH_NPM_TOKEN"
  fi
fi

npm run build
lerna publish --dist-tag next --no-verify-access
