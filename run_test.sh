#!/bin/sh

debug=$1

grunt clean 
grunt concat
mocha ${debug} test/unit
