#!/bin/sh

echo '** Clean'
(cd Babel && rm -rf build node_modules yarn.lock)
(cd TypeScript && rm -rf build node_modules yarn.lock)

echo '** Running (cd .. && yarn)'
(cd .. && yarn)

echo '** Running yarn'
(cd Babel && yarn)
(cd TypeScript && yarn)

echo '** Running (cd .. && rm -rf node_modules)'
(cd .. && rm -rf node_modules)

echo '** Running webpack'
(cd Babel && yarn run webpack -d --env.development)
(cd TypeScript && yarn run webpack -d --env.development)
