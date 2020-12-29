#!/bin/bash
#
# Generate release files (ZIP archives of the extension source code).

# Prints help text
function usage() {
  cat <<END

  Usage: $progname [--channel CHANNEL --browser BROWSER]

  optional arguments:
    -h, --help     show this help message and exit
    -c, --channel  indicates the channel of the release. Can be "beta"
                   or "stable". Defaults to "stable".
    -b, --browser  indicates the target browser for the release. As of
                   now it can only be "chromium", which is also the
                   default value.
    -f, --fast     indicates that the release shouldn't generate the
                   i18n credits JSON file.

END
}

# Updates manifest.json field
function set_manifest_field() {
  sed -i -E "s/\"$1\": \"[^\"]*\"/\"$1\": \"$2\"/" src/manifest.json
}

# Get options
opts=$(getopt -l "help,channel:,browser:,fast" -o "hc:b:f" -n "$progname" -- "$@")
eval set -- "$opts"

channel=stable
browser=chromium
fast=0

while true; do
  case "$1" in
    -h | --help)
      usage
      exit
      ;;
    -c | --channel)
      channel="$2"
      shift 2
      ;;
    -b | --browser)
      browser="$2"
      shift 2
      ;;
    -f | --fast)
      fast=1
      shift
      ;;
    *) break ;;
  esac
done

if [[ $channel != "stable" && $channel != "beta" ]]; then
  echo "channel parameter value is incorrect." >&2
  usage
  exit
fi

if [[ $browser != "chromium" ]]; then
  echo "browser parameter value is incorrect." >&2
  usage
  exit
fi

echo "Started building release..."

# First of all, generate the appropriate manifest.json file for the
# target browser
dependencies=(${browser})

bash generateManifest.bash "${dependencies[@]}"

# Also, generate the credits for the translators
if [[ $fast == 0 ]]; then
  bash generatei18nCredits.bash
fi

# This is the version name which git gives us
version=$(git describe --always --tags --dirty)

# If the version name contains a hyphen then it isn't a release
# version. This is also the case if it doesn't start with a "v".
if [[ $version == *"-"* || $version != "v"* ]]; then
  # As it isn't a release version, setting version number to 0 so it
  # cannot be uploaded to the Chrome Web Store
  set_manifest_field "version" "0"
  set_manifest_field "version_name" "$version-$channel"
else
  # It is a release version, set the version fields accordingly.
  set_manifest_field "version" "${version:1}"
  set_manifest_field "version_name" "${version:1}-$channel"
fi

if [[ $channel == "beta" ]]; then
  # Change manifest.json to label the release as beta
  set_manifest_field "name" "__MSG_appBetaName__"
fi

# Create ZIP file for upload to the Chrome Web Store
mkdir -p out
rm -rf out/translateselectedtext-$version-$browser-$channel.zip
(cd src &&
  zip -rq ../out/translateselectedtext-$version-$browser-$channel.zip * \
  -x "*/.git*" -x "*/\.DS_Store" -x "*/OWNERS")

# Clean generated manifest.json file
rm -f src/manifest.json

echo "Done!"
