#!/bin/bash
emptyTranslationFile="{}"

# Download new translations
if [ ! -f "crowdin.yml" ]; then
  echo "Copy crowdin.template.yml to crowdin.yml and fill in the API token."
fi

crowdin download -c crowdin.yml

cd ../../src/_locales

for lang in *; do
  if [ "x$emptyTranslationFile" = "x$(cat $lang/messages.json)" ]; then
    echo "$lang has an empty translation. Deleting folder..."
    rm -rf $lang
  fi
done
