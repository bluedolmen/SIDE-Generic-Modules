#!/bin/sh

echo
echo This script generates in live js documentation from your js sources
echo through YU!I Docs
echo
echo Of course, you must have installed YUIDocs first :-\)
echo Please go and see http://yui.github.com/yuidoc/##install
echo
echo I needed to reinstall Node.js but it was a matter of a few minutes
echo
echo Please press a key when everything is ready or press Ctrl-C otherwise
echo to stop the process
echo

read
#yuidoc -c src/jsdoc/yuidocs.json --server
yuidoc -c src/jsdoc/yuidocs.json
