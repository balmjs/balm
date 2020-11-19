#!/bin/bash

npm run build
lerna publish version preminor --no-git-tag-version --no-push --canary --preid canary.$(git rev-parse --short HEAD) --dist-tag canary --force-publish balm-core
