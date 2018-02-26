#!/bin/bash
ng build --base-href ./ && cp manifest.webapp dist/ && cd dist && zip -r app.zip * && cp app.zip ~/Desktop && echo "done"
