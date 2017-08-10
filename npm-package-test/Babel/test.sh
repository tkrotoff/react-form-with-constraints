#!/bin/sh
echo '** Running rm -rf node_modules'
rm -rf node_modules

echo '** Running (cd ../.. && npm install)'
(cd ../.. && npm install)

echo '** Running npm install'
npm install

echo '** Running (cd ../.. && rm -rf node_modules)'
(cd ../.. && rm -rf node_modules)

echo '** Running npm run build'
npm run build
