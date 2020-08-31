#!/bin/bash

gulp prepublish && npm run build
lerna publish
