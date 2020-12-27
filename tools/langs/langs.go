package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
)

const isoLangsFileName = "isoLangs.json"

type Language struct {
	CodeName   string `json:"-"`
	Name       string `json:"name"`
	NativeName string `json:"nativeName"`
}

func getLanguage(isoLangs map[string]Language, lang string) (Language, error) {
	for currLangCode, currLang := range isoLangs {
		if currLangCode == lang {
			currLang.CodeName = lang

			// Only consider the first entry of the list (e.g. "a, b, c" --> "a")
			if index := strings.Index(currLang.NativeName, ","); index > 0 {
				currLang.NativeName = currLang.NativeName[:index]
			}

			return currLang, nil
		}
	}

	return Language{}, fmt.Errorf("Didn't find language '%v' in isoLangs", lang)
}

func main() {
	log.SetPrefix("[langs] ")
	log.SetFlags(0)

	isoLangsFile, err := os.Open(isoLangsFileName)
	if err != nil {
		log.Fatalf("Couldn't open file %v, error: %v", isoLangsFileName, err)
	}
	defer isoLangsFile.Close()

	isoLangsRawData, err := ioutil.ReadAll(isoLangsFile)
	if err != nil {
		log.Fatalf("Couldn't read file %v, error: %v", isoLangsFileName, err)
	}

	var isoLangs map[string]Language
	if err := json.Unmarshal(isoLangsRawData, &isoLangs); err != nil {
		log.Fatalf("Couldn't unmarshal JSON file %v, error: %v", isoLangsFileName, err)
	}

	resp, err := http.Get("http://translate.google.com/translate_a/l?client=chrome")
	if err != nil {
		log.Fatalf("Couldn't get current Google Translate languages from server, error: %v", err)
	}
	defer resp.Body.Close()

	gTranslateRawData, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalf("Couldn't read body data from Google Translate languages request, error: %v", err)
	}

	var gTranslateJson map[string]interface{}
	if err := json.Unmarshal(gTranslateRawData, &gTranslateJson); err != nil {
		log.Fatalf("Couldn't unmarshal JSON data from the Google Translate languages request, error: %v", err)
	}

	gTranslateLangs := gTranslateJson["tl"].(map[string]interface{})
	langs := make(map[string]Language, len(gTranslateLangs))

	for langCode, name := range gTranslateLangs {
		isoLang, err := getLanguage(isoLangs, langCode)
		if err != nil {
			log.Fatalf("Didn't find language '%v' in isoLangs, error: %v", langCode, err)
		}
		isoLang.Name = name.(string)
		langs[langCode] = isoLang
	}

	result, err := json.MarshalIndent(langs, "", "  ")
	if err != nil {
		log.Fatal("Couldn't marshal the final JSON, error: %v", err)
	}

	fmt.Printf("%v", string(result))
}
