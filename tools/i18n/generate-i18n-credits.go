package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"gopkg.in/yaml.v2"
)

const blockFileName = "blocked-users.txt"
const crowdinConfigFileName = "crowdin.yml"
const projectId = "191707"
const checkAttempts = 5
const checkWaitTime = 2 * time.Second
const baseApiURL = "https://api.crowdin.com/api/v2/"
const i18nCreditsFile = "../../src/json/i18n-credits.json"

// Contributors who have sent translations before the Crowdin instance
// was set up:
var additionalContributors = []Contributor{
	Contributor{
		Name: "Alexander Simkin",
		Languages: []Language{
			Language{
				Id:   "ru",
				Name: "Russian",
			}},
	}}

type User struct {
	Id        string `json:"id"`
	Username  string `json:"username"`
	FullName  string `json:"fullName"`
	AvatarUrl string `json:"avatarUrl"`
}

type Language struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

type TopUser struct {
	User          User       `json:"user"`
	Languages     []Language `json:"languages"`
	Translated    int        `json:"translated"`
	Target        int        `json:"target"`
	Approved      int        `json:"approved"`
	Voted         int        `json:"voted"`
	PositiveVotes int        `json:"positiveVotes"`
	NegativeVotes int        `json:"negativeVotes"`
	Winning       int        `json:"winning"`
}

type DateRange struct {
	from string `json:"from"`
	to   string `json:"to"`
}

type Report struct {
	Name      string    `json:"name"`
	Url       string    `json:"url"`
	Unit      string    `json:"unit"`
	DateRange DateRange `json:"dateRange"`
	Language  string    `json:"language"`
	TopUsers  []TopUser `json:"data"`
}

type Contributor struct {
	Name      string     `json:"name"`
	Languages []Language `json:"languages"`
}

func isBlocked(blockedUsers []string, user string) bool {
	for _, u := range blockedUsers {
		if user == u {
			return true
		}
	}
	return false
}

func getBlockedUsers() []string {
	blockFile, err := os.Open(blockFileName)
	if err != nil {
		log.Fatalf("Couldn't open blockfile, error: %v", err)
	}
	defer blockFile.Close()

	blocked := make([]string, 0)

	scanner := bufio.NewScanner(blockFile)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if len(line) == 0 || line[0] == '#' {
			continue
		}
		blocked = append(blocked, line)
	}

	return blocked
}

func getJSONFromResponseBody(body *io.ReadCloser) (map[string]interface{}, error) {
	var responseJSON map[string]interface{}

	responseRawBody, err := ioutil.ReadAll(*body)
	if err != nil {
		return responseJSON, err
	}
	if err := json.Unmarshal(responseRawBody, &responseJSON); err != nil {
		return responseJSON, err
	}

	return responseJSON, nil
}

func getTokenFromCrowdinConfig(fileName string) (string, error) {
	crowdinFile, err := os.Open(fileName)
	if err != nil {
		return "", err
	}
	defer crowdinFile.Close()

	configRaw, err := ioutil.ReadAll(crowdinFile)
	if err != nil {
		return "", err
	}

	var configYaml map[interface{}]interface{}
	if err := yaml.Unmarshal([]byte(configRaw), &configYaml); err != nil {
		return "", err
	}

	if val, ok := configYaml["api_token"]; ok {
		return val.(string), nil
	}

	return "", fmt.Errorf("api_token value isn't set")
}

func apiCall(path string, method string, body string) (*http.Response, error) {
	token, isTokenSet := os.LookupEnv("GTRANSLATE_CROWDIN_API_KEY")
	if !isTokenSet {
		var err error
		token, err = getTokenFromCrowdinConfig(crowdinConfigFileName)
		if err != nil {
			return nil, fmt.Errorf("Environmental variable GTRANSLATE_CROWDIN_API_KEY is not set and couldn't find the API key in %s (%v).", crowdinConfigFileName, err)
		}
	}

	if body == "" {
		body = "{}"
	}

	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	url := baseApiURL + path
	bodyReader := strings.NewReader(body)
	request, err := http.NewRequest(method, url, bodyReader)
	if err != nil {
		return nil, err
	}

	request.Header.Add("Authorization", "Bearer "+token)
	request.Header.Add("Content-Type", "application/json")

	return client.Do(request)
}

func generateReport(projectId string) (string, error) {
	response, err := apiCall("projects/"+projectId+"/reports", "POST", `
    {
      "name": "top-members",
      "schema": {
        "unit": "words",
        "format": "json"
      }
    }
  `)
	if err != nil {
		return "", fmt.Errorf("Error while requesting top users report: %v", err)
	}

	if response.StatusCode != 201 {
		return "", fmt.Errorf("Error while requesting top users report (status code %d)", response.StatusCode)
	}

	responseJSON, err := getJSONFromResponseBody(&response.Body)
	if err != nil {
		return "", err
	}

	data := responseJSON["data"].(map[string]interface{})
	return data["identifier"].(string), nil
}

func isReportGenerated(projectId string, reportId string) (bool, error) {
	response, err := apiCall("projects/"+projectId+"/reports/"+reportId, "GET", "{}")
	if err != nil {
		return false, fmt.Errorf("Error while checking report generation: %v", err)
	}

	if response.StatusCode != 200 {
		return false, fmt.Errorf("Error while checking report generation (status code %d)", response.StatusCode)
	}

	responseJSON, err := getJSONFromResponseBody(&response.Body)
	if err != nil {
		return false, err
	}

	data := responseJSON["data"].(map[string]interface{})
	return data["status"].(string) == "finished", nil
}

func getReportUrl(projectId string, reportId string) (string, error) {
	response, err := apiCall("projects/"+projectId+"/reports/"+reportId+"/download", "GET", "{}")
	if err != nil {
		return "", fmt.Errorf("Error while retrieving top users report download URL: %v", err)
	}

	if response.StatusCode != 200 {
		return "", fmt.Errorf("Error while retrieving top users report download URL (status code %d)", response.StatusCode)
	}

	responseJSON, err := getJSONFromResponseBody(&response.Body)
	if err != nil {
		return "", err
	}

	data := responseJSON["data"].(map[string]interface{})
	return data["url"].(string), nil
}

func getReport(projectId string, reportId string) (Report, error) {
	reportUrl, err := getReportUrl(projectId, reportId)
	if err != nil {
		return Report{}, err
	}

	response, err := http.Get(reportUrl)
	if err != nil {
		return Report{}, fmt.Errorf("An error occurred while downloading the report: %v", err)
	}

	var report Report

	responseRawBody, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return Report{}, err
	}
	if err := json.Unmarshal(responseRawBody, &report); err != nil {
		return Report{}, err
	}

	return report, nil
}

func getContributorsFromReport(report Report) []Contributor {
	blockedUsers := getBlockedUsers()

	contributors := make([]Contributor, 0)
	for _, c := range additionalContributors {
		contributors = append(contributors, c)
	}
	for _, u := range report.TopUsers {
		if u.Translated <= 0 || isBlocked(blockedUsers, u.User.Username) {
			continue
		}
		contributors = append(contributors, Contributor{
			Name:      u.User.FullName,
			Languages: u.Languages,
		})
	}
	return contributors
}

func GetContributors(projectId string) ([]Contributor, error) {
	id, err := generateReport(projectId)
	if err != nil {
		return nil, err
	}

	log.Printf("Top users report requested successfully (assigned id: %v)", id)

	reportGenerated := false
	for i := 0; i < checkAttempts; i++ {
		currReportGenerated, err := isReportGenerated(projectId, id)
		if err != nil {
			log.Printf("[Try %d] Couldn't check whether the top users report has been generated, error: %v", i+1, err)
		} else if currReportGenerated {
			log.Printf("[Try %d] The top users report has been generated.", i+1)
			reportGenerated = true
			break
		} else {
			log.Printf("[Try %d] Top users report hasn't still been generated.", i+1)
		}
		time.Sleep(checkWaitTime)
	}

	if !reportGenerated {
		return nil, fmt.Errorf("After %d checks, the top users report hasn't still been generated. Aborting.", checkAttempts)
	}

	report, err := getReport(projectId, id)
	if err != nil {
		return nil, fmt.Errorf("Couldn't retrieve top users report, error: %v", err)
	}

	return getContributorsFromReport(report), nil
}

func main() {
	log.SetPrefix("[generate-i18n-credits] ")
	log.SetFlags(0)

	log.Println("Starting to generate i18n credits")

	contributors, err := GetContributors(projectId)
	if err != nil {
		log.Fatalf("%v", err)
	}

	creditsFile, err := os.Create(i18nCreditsFile)
	if err != nil {
		log.Fatalf("Couldn't create i18n credits file, error: %v", err)
	}
	defer creditsFile.Close()

	JSONBytes, err := json.MarshalIndent(contributors, "", "  ")
	if err != nil {
		log.Fatalf("Couldn't marshal Contributors interface, error: %v", err)
	}

	if _, err := creditsFile.Write(JSONBytes); err != nil {
		log.Fatalf("Couldn't write to i18n credits file, error: %v", err)
	}

	log.Println("Done!")
}
