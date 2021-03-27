#!/bin/bash

npm run build
lerna publish preminor --no-git-tag-version --no-push --preid --canary canary.$(git rev-parse --short HEAD) --exact --dist-tag canary --force-publish balm-core
