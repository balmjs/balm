#!/bin/bash

npm run prepublishOnly
cd packages/core
npm publish --tag next
