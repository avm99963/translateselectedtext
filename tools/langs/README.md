# Language list generator
The tool found in this folder serves the purpose of updating the `isoLangs`
object found in `//src/js/common.js`, which contains a list of possible
target translation languages.

Run `go run langs.go` in order to obtain the updated `isoLangs` object, and copy
it to `//src/js/common.js`. If it fails, run it again until it works (it might
take 3 or 4 attempts).

If the way the languages are encoded into `https://translate.google.com/`
change, this tool will no longer work, but it probably can be slightly adapted
to make it work again. It is expected that this tool will not work in the
future.
