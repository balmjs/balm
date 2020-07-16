#!/bin/bash

npm run prepublishOnly
cd packages/balm-core
npm publish --tag next
