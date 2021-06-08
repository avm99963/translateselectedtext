.PHONY: all chromium-stable chromium-beta

all: chromium-stable chromium-beta

chromium-stable:
	bash release.bash -c stable -b chromium -f

chromium-beta:
	bash release.bash -c beta -b chromium -f

clean:
	rm -rf out
