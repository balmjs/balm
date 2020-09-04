#!/bin/bash

npm run build
lerna publish --force-publish "*"
