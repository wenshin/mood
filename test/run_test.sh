#!/bin/sh

# --debug-brk 可以配合node-inspector进行调试
debug=$1

mocha ${debug} unit
