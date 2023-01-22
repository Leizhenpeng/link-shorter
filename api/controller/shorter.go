package controller

import (
	"github.com/iris-contrib/middleware/jwt"
	"github.com/kataras/iris/v12"
	"leizhenpeng/link-shorter-api/service"
	"time"
)

type ShorterRequest struct {
	Link string `json:"link"`
}

type DelRequest struct {
	Key string `json:"key"`
}

type AdminLoginRequest struct {
	Username string `json:"username" xml:"Username"`
	Password string `json:"password" xml:"Password"`
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

	jwtMiddle := jwt.New(jwt.Config{
		ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
			return []byte("secret"), nil
		},
		SigningMethod: jwt.SigningMethodHS256,
	})

	app.Get("/ping", s.Ping)

	app.Post("/short", s.ShortLink)
	app.Get("/u/{key}", s.GetRaw)

	app.Post("/login", s.Login)
	admin := app.Party("/admin")
	{
		admin.UseRouter(jwtMiddle.Serve)
		admin.Post("/flush", s.Flush)
		admin.Get("/all", s.All)
		admin.Post("/del", s.DelOne)
	}
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

func (s ShorterCtl) Login(ctx iris.Context) {
	var req AdminLoginRequest
	err := ctx.ReadJSON(&req)
	if err != nil {
		return
	}
	if req.Username != "admin" || req.Password != "2023" {
		CommonResponse{}.Fail().SetData("invalid username or password").Send(ctx)
		return
	}
	token := jwt.NewTokenWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": req.Username,
		"admin":    true,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	})
	tokenString, err := token.SignedString([]byte("secret"))
	if err != nil {
		CommonResponse{}.Fail().SetData(err.Error()).Send(ctx)
		return
	}
	CommonResponse{}.Success().SetData(iris.Map{
		"token": tokenString,
		"exp":   token.Claims.(jwt.MapClaims)["exp"],
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
