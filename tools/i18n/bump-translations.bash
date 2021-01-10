#!/bin/bash
emptyTranslationFile="{}"

# Download new translations
if [ ! -f "crowdin.yml" ]; then
  echo "Copy crowdin.template.yml to crowdin.yml and fill in the API token."
fi

crowdin download -c crowdin.yml

cd ../../src/_locales

# Delete empty translations
for lang in *; do
  if [[ "$lang" == "README.md" ]]; then
    continue
  fi
  if [ "x$emptyTranslationFile" = "x$(cat $lang/messages.json)" ]; then
    echo "$lang has an empty translation. Deleting folder..."
    rm -rf $lang
  else
    git add $lang/messages.json
  fi
done

# Commit new translations
git commit -m "Updating i18n files from Crowdin"
