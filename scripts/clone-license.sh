#!/bin/bash

echo "Cloning LICENSE to balm packages"
cat LICENSE
ls -db ./packages/*/ | xargs -n 1 cp LICENSE
