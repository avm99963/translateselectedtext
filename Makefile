.PHONY: all i18n-credits chromium-stable chromium-beta

all: chromium-stable chromium-beta

i18n-credits:
	bash generatei18nCredits.bash

chromium-stable: i18n-credits
	bash release.bash -c stable -b chromium -f

chromium-beta: i18n-credits
	bash release.bash -c beta -b chromium -f

clean:
	rm -rf out
