.PHONY: node_deps clean_dist deps clean_deps serve_chromium serve_edge release release_chromium_stable release_chromium_beta release_edge build_test_extension clean_releases clean

.DEFAULT_GOAL := release
WEBPACK := ./node_modules/webpack-cli/bin/cli.js
RELEASE_SCRIPT := bash tools/release.bash

node_deps:
	npm ci --no-save

clean_dist:
	rm -rf dist

deps: node_deps
	mkdir -p dist

clean_deps:
	rm -rf node_modules


serve_chromium: deps
	$(WEBPACK) --mode development --env browser_target=chromium --watch

serve_edge: deps
	$(WEBPACK) --mode development --env browser_target=edge --watch

release: release_chromium_stable release_chromium_beta release_edge

release_chromium_stable: deps
	$(WEBPACK) --mode production --env browser_target=chromium
	$(RELEASE_SCRIPT) -c stable -b chromium -f
	rm -rf dist/chromium

release_chromium_beta: deps
	$(WEBPACK) --mode production --env browser_target=chromium
	$(RELEASE_SCRIPT) -c beta -b chromium -f
	rm -rf dist/chromium

release_edge: deps
	$(WEBPACK) --mode production --env browser_target=edge
	$(RELEASE_SCRIPT) -c stable -b edge -f
	rm -rf dist/edge

# Target to build the extension for webext lint in the Zuul Check Pipeline.
build_test_extension: deps
	$(WEBPACK) --mode production --env browser_target=chromium
	$(RELEASE_SCRIPT) -c stable -b chromium -f

clean_releases:
	rm -rf out

clean: clean_deps clean_dist clean_releases
