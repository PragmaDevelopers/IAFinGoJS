package auth

import (
	"encoding/json"
	// "errors"
	"net/http"
	"net/url"
	"strings"
	"io"
)

// RecaptchaResponse is the structure for the response from Google's ReCAPTCHA verification API.
type RecaptchaResponse struct {
	Success     bool     `json:"success"`
	Score       float64  `json:"score"`
	Action      string   `json:"action"`
	ChallengeTs string   `json:"challenge_ts"`
	Hostname    string   `json:"hostname"`
	ErrorCodes  []string `json:"error-codes"`
}

// VerifyRecaptchaToken verifies the provided ReCAPTCHA token with Google's API and returns the RecaptchaResponse.
func VerifyRecaptchaToken(token, secret string) (*RecaptchaResponse, error) {
	verifyURL := "https://www.google.com/recaptcha/api/siteverify"
	data := url.Values{}
	data.Set("secret", secret)
	data.Set("response", token)

	resp, err := http.Post(verifyURL, "application/x-www-form-urlencoded", strings.NewReader(data.Encode()))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var recaptchaResp RecaptchaResponse
	if err := json.Unmarshal(body, &recaptchaResp); err != nil {
		return nil, err
	}

	// if !recaptchaResp.Success {
	// 	return &recaptchaResp, errors.New("recaptcha verification failed")
	// }

	return &recaptchaResp, nil
}