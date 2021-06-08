# i18n tools
This folder contains tools which aid in working with everything related to
the internationalization/localization of the extension.

## i18n summary
The extension strings are defined in `//src/_locales/en/manifest.json`, which is
the "source file". This file then is translated to multiple languages, each of
which has its own subfolder at `//src/_locales`.

In order to streamline translation efforts, the translation is done in a
[Crowdin project](https://crowdin.com/project/translateselectedtext) (because
translators aren't always developers, and they might not know about git), which
is synced to this git repository via the tools offered in this folder.

## Tools
- `upload-sources.bash`:  used to upload the `manifest.json` source file to
Crowdin, in order to sync it.
- `bump-translations.bash`: used to download updated translations from Crowdin
and create a new commit with the new updates.
- `generate-i18n-credits.go` (should not be called directly): used by the build
script to generate the list of translators which are displayed in the credits
dialog in the extension. The list of translators is retrieved from Crowdin, and
users listed in `blocked-users.txt` are removed from the list (some translators
who contributed before Crowdin was set up are also manually added to the list by
the script).

## Crowdin settings file
In order to use these tools, the crowdin settings file must be created and set
up:

1. Create a copy of `crowdin.template.yml` called `crowdin.yml`.
2. Edit `crowdin.yml` replacing `{{API_TOKEN}}` by the actual API token.
