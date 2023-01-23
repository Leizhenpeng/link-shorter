package main

import (
	"github.com/kataras/iris/v12/httptest"
	"regexp"
	"testing"
)

var commonSchema = `{
			"type": "object",
			"properties": {
				"code":  {"type": "number"},
				"msg":   {"type": "string"},
				"data":  {"type": ["object","string"]}
			},
			"required": ["code", "msg", "data"]
		}`

func TestCommonApi(t *testing.T) {
	app := NewApp()
	e := httptest.New(t, app)
	{
		e.GET("/ping").Expect().Status(httptest.StatusOK).Body().Equal(
			"pong")
	}
	{
		rawLink := map[string]string{
			"link": "https://www.bilibili.com/video/BV1sD4y1p7nQ/?spm_id_from=333.999.0.0&vd_source=b0d768d2069abef2adf99c1a4c244b9e",
		}
		e.GET("/short").Expect().Status(httptest.StatusNotFound)
		r := e.POST("/short").WithJSON(rawLink).Expect().Status(
			httptest.StatusOK).JSON().Schema(commonSchema)
		r.Object().Value("code").Number().Equal(200)
		r.Object().Value("msg").String().Equal("success")
		shortKey := r.Object().Value("data").String().Raw()
		reg := `^[a-zA-Z0-9-_]{6}$`
		if !regexp.MustCompile(reg).MatchString(shortKey) {
			t.Errorf("shortKey not match %s", shortKey)
		}
	}
}

func TestAdminApi(t *testing.T) {
	app := NewApp()
	e := httptest.New(t, app)
	e.GET("/admin/all").Expect().Status(httptest.StatusUnauthorized)

	re := e.POST("/login").WithJSON(map[string]string{
		"username": "admin",
		"password": "2023",
	}).Expect().Status(httptest.StatusOK).JSON().Schema(
		commonSchema)

	data := re.Object().Value("data").Object().Raw()
	token := data["token"].(string)

	e.GET("/admin/all").WithHeader("Authorization",
		"Bearer "+token).Expect().Status(httptest.StatusOK).JSON().
		Schema(commonSchema)

}
