#!/bin/bash

npm run build
lerna publish premajor --no-git-tag-version --no-push --preid canary.$(git rev-parse --short HEAD) --exact --dist-tag canary --force-publish balm-core
