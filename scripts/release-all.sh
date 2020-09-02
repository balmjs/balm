#!/bin/bash

FORCE_PUBLISH = "*"

npm run build
lerna publish --force-publish $FORCE_PUBLISH
