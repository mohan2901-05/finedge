#!/bin/bash
node D:/projects/finedge/frontend/node_modules/@angular/cli/bin/ng.js test --watch=false --no-watch --browsers=ChromeHeadless 2>&1 > D:/projects/finedge/frontend/test_output.log
echo EXIT_CODE=$? >> D:/projects/finedge/frontend/test_output.log
