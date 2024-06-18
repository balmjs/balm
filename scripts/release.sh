#!/bin/bash

npm run build
lerna publish --dist-tag next
