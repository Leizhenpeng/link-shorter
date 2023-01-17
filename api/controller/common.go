package controller

import "github.com/kataras/iris/v12"

type CommonResponse struct {
	Code int         `json:"code"`
	Msg  string      `json:"msg"`
	Data interface{} `json:"data"`
}

func (c CommonResponse) Success() CommonResponse {
	c.Code = 200
	c.Msg = "success"
	return c
}

func (c CommonResponse) Fail() CommonResponse {
	c.Code = 500
	c.Msg = "fail"
	return c
}

func (c CommonResponse) SetData(data interface{}) CommonResponse {
	c.Data = data
	return c
}

func (c CommonResponse) Send(ctx iris.Context) {
	ctx.JSON(c)
}

type CommonResponseCore interface {
	Success() CommonResponse
	Fail() CommonResponse
	SetData(data interface{}) CommonResponse
	Send(ctx iris.Context)
}

var _ CommonResponseCore = (*CommonResponse)(nil)
