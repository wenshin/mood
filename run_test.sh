#!/bin/sh

debug=$1

grunt concat
mocha ${debug} test/unit
