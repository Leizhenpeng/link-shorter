package controller

import (
	"fmt"
	"github.com/kataras/iris/v12"
	"leizhenpeng/link-shorter-api/service"
)

type ShorterRequest struct {
	Link string `json:"link"`
}

type DelRequest struct {
	Key string `json:"key"`
}

type ShorterCtl struct {
	Service *service.ShorterService
}

func (s ShorterCtl) DelOne(ctx iris.Context) {
	var req DelRequest
	err := ctx.ReadJSON(&req)
	if err != nil {
		return
	}
	err = s.Service.DelOne(req.Key)
	if err != nil {
		CommonResponse{}.Fail().SetData(err.Error()).Send(ctx)
		return
	}
	CommonResponse{}.Success().Send(ctx)

}

func (s ShorterCtl) Ping(ctx iris.Context) {
	ctx.WriteString("pong")
}

func (s ShorterCtl) Register(app *iris.Application) {
	app.Get("/ping", s.Ping)

	app.Post("/short", s.ShortLink)
	app.Get("/u/{key}", s.GetRaw)

	admin := app.Party("/admin")
	admin.Post("/flush", s.Flush)
	admin.Get("/all", s.All)
	admin.Post("/del", s.DelOne)
}

func (s ShorterCtl) ShortLink(ctx iris.Context) {
	var req ShorterRequest
	err := ctx.ReadJSON(&req)
	if err != nil {
		return
	}
	if !s.Service.ValidLink(req.Link) {
		CommonResponse{}.Fail().SetData("invalid link").Send(ctx)
		return
	}
	shorter, err := s.Service.GetShorter(req.Link)
	if err != nil {
		CommonResponse{}.Fail().SetData(err.Error()).Send(ctx)
		return
	}
	CommonResponse{}.Success().SetData(shorter).Send(ctx)
	return

}
func (s ShorterCtl) GetRaw(ctx iris.Context) {
	key := ctx.Params().Get("key")
	link, err := s.Service.GetRaw(key)
	fmt.Println(link)
	fmt.Println(key)
	if err != nil {
		CommonResponse{}.Fail().SetData(err.Error()).Send(ctx)
		return
	}
	ctx.Redirect(link, iris.StatusMovedPermanently)
	return
}

func (s ShorterCtl) Flush(ctx iris.Context) {
	err := s.Service.ClearAll()
	if err != nil {
		CommonResponse{}.Fail().SetData(err.Error()).Send(ctx)
		return
	}
	CommonResponse{}.Success().Send(ctx)
}

func (s ShorterCtl) All(ctx iris.Context) {
	all, err := s.Service.ShowAll()
	if err != nil {
		CommonResponse{}.Fail().SetData(err.Error()).Send(ctx)
		return
	}
	CommonResponse{}.Success().SetData(iris.Map{
		"all": all,
	}).Send(ctx)
}

type ShorterCtlCore interface {
	ShortLink(ctx iris.Context)
	GetRaw(ctx iris.Context)
	DelOne(ctx iris.Context)
	Flush(ctx iris.Context)
	All(ctx iris.Context)
	Ping(ctx iris.Context)
	Register(app *iris.Application)
}

var _ ShorterCtlCore = (*ShorterCtl)(nil)
