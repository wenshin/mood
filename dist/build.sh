#!/bin/sh

cd .. && grunt test

cd dist
rm -r build
cp -r unit .tmp
r.js -o build.js
r.js -o build.js optimize=none out=./build/mood.js
rm -rf .tmp
