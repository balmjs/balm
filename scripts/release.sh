#!/bin/bash

# VERSION=$1

# git tag $VERSION
# git push origin --tags
lerna publish --dist-tag next
