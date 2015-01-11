#!/bin/sh

rm -rf .tmp
cp -r unit .tmp
sed -i -e "s/\.\///g" `grep "./" -rl .tmp`
r.js -o build.js
