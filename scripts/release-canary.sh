#!/bin/bash

npm run build
lerna publish --canary --force-publish *
