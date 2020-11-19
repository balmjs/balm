#!/bin/bash

npm run build
lerna publish --canary --preid canary --no-git-tag-version --no-push --dist-tag canary --force-publish balm-core
