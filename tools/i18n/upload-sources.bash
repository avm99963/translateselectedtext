#!/bin/bash
#
# Uploads source files to Crowdin for translation.

if [[ $(git diff --stat) != '' ]]; then
  echo 'The git tree is dirty. The source file has not been uploaded.'
  exit 1
fi

crowdin upload -c crowdin.yml
