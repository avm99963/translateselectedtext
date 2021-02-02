#!/bin/bash
#
# Tags the current git HEAD as a new version, passed via a flag.

GITILES_REPO_URL="https://gerrit.avm99963.com/plugins/gitiles/translateselectedtext"

# Prints help text
function usage() {
  cat <<END

  Usage: $progname --version VERSION

  required arguments:
    -v, --version  the version of the new release (in the form vx)
                   which wants to be tagged.

  optional arguments:
    -h, --help     show this help message and exit

END
}

opts=$(getopt -l "help,version:" -o "hv:" -n "$progname" -- "$@")
eval set -- "$opts"

prevVersion=$(git describe --abbrev=0)
nextVersion="null"

while true; do
  case "$1" in
    -h | --help)
      usage
      exit
      ;;
    -v | --version)
      nextVersion="$2"
      shift 2
      ;;
    *) break ;;
  esac
done

if [[ $nextVersion == "null" ]]; then
  echo "version parameter value is incorrect." >&2
  usage
  exit
fi

commitMessage1="$nextVersion"
commitMessage2="Changelog: $GITILES_REPO_URL/+log/refs/tags/$prevVersion..refs/tags/$nextVersion"
git tag -s $nextVersion -m "$commitMessage1" -m "$commitMessage2"

echo "Tag created. Now run \`git push --tags\` to push the tags to the server."
