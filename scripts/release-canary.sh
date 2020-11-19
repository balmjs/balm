#!/bin/bash

npm run build
lerna publish --no-git-tag-version --no-push --canary preminor --preid canary.$(git rev-parse --short HEAD) --yes --exact from-package --dist-tag canary --force-publish balm-core
