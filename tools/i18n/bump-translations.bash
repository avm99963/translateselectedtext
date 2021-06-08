#!/bin/bash
#
# Downloads updated translations from Crowdin and creates a new commit with the
# new updates.
#
# This commit should be uploaded afterwards for review with the |git review|
# command (take a look to check everything went well before uploading it).

emptyTranslationFile="{}"

# Download new translations
if [ ! -f "crowdin.yml" ]; then
  echo "Copy crowdin.template.yml to crowdin.yml and fill in the API token."
fi

crowdin download -c crowdin.yml

# Generate i18n credits file
go run generate-i18n-credits.go
git add ../../src/json/i18n-credits.json

# Delete empty translations
cd ../../src/_locales
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
