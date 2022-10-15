#!/bin/bash

# Very simple script to test PDF generation on at least one developer's machine

if [ "$#" -ne 1 ]; then
    echo "Usage: result-pdf.sh [PORT NUMBER ON LOCALHOST]"
fi

if [ ! command -v evince  &> /dev/null]; then
    apt-get update && apt-get install evince -y
fi

PORT=$1
TMPFILE=$(mktemp /tmp/result-pdf-XXXXXX.pdf)
echo $TMPFILE
wget --post-data='data={"report_timestamp":1471297389, "conclusion": "A.i", "flags":["B.i", "B.ii"], "details":[{"key": "Title of Work", "value": "Untitled"}, {"key":"Published", "value": 1968}]}' -O $TMPFILE http://localhost:$PORT/wp-content/plugins/termination-of-transfer/pdf-result.php
evince $TMPFILE
