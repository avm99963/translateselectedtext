#!/bin/bash
genmanifest -template templates/manifest.gjson -dest src/manifest.json "$@"
