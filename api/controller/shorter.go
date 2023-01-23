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
}

type ShorterCtlCore interface {
	Ping(ctx iris.Context)
	Login(ctx iris.Context)
	Register(app *iris.Application)
	ShortLink(ctx iris.Context, ss *service.ShorterService)
	GetRaw(ctx iris.Context, ss *service.ShorterService)
	DelOne(ctx iris.Context, ss *service.ShorterService)
	Flush(ctx iris.Context, ss *service.ShorterService)
	All(ctx iris.Context, ss *service.ShorterService)
}

var _ ShorterCtlCore = (*ShorterCtl)(nil)

func NewShorterCtl() *ShorterCtl {
	return &ShorterCtl{}
}

func (s ShorterCtl) DelOne(ctx iris.Context, ss *service.ShorterService) {
	var req DelRequest
	err := ctx.ReadJSON(&req)
	if err != nil {
		return
	}
	err = ss.DelOne(req.Key)
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
	app.Post("/login", s.Login)

	app.ConfigureContainer(func(api *iris.APIContainer) {
		api.Post("/short", s.ShortLink)
		api.Get("/u/{key}", s.GetRaw)
	})

	admin := app.Party("/admin")
	{
		admin.UseRouter(jwtMiddle.Serve)
		admin.ConfigureContainer(func(api *iris.APIContainer) {
			api.Post("/flush", s.Flush)
			api.Get("/all", s.All)
			api.Post("/del", s.DelOne)
		})
	}
}

func (s ShorterCtl) ShortLink(ctx iris.Context, ss *service.ShorterService) {
	var req ShorterRequest
	err := ctx.ReadJSON(&req)
	if err != nil {
		return
	}
	if !ss.ValidLink(req.Link) {
		CommonResponse{}.Fail().SetData("invalid link").Send(ctx)
		return
	}
	shorter, err := ss.GetShorter(req.Link)
	if err != nil {
		CommonResponse{}.Fail().SetData(err.Error()).Send(ctx)
		return
	}
	CommonResponse{}.Success().SetData(shorter).Send(ctx)
	return

}
func (s ShorterCtl) GetRaw(ctx iris.Context, ss *service.ShorterService) {
	key := ctx.Params().Get("key")
	link, err := ss.GetRaw(key)
	if err != nil {
		CommonResponse{}.Fail().SetData(err.Error()).Send(ctx)
		return
	}
	ctx.Redirect(link, iris.StatusMovedPermanently)
	return
}

func (s ShorterCtl) Flush(ctx iris.Context, ss *service.ShorterService) {
	err := ss.ClearAll()
	if err != nil {
		CommonResponse{}.Fail().SetData(err.Error()).Send(ctx)
		return
	}
	CommonResponse{}.Success().Send(ctx)
}

func (s ShorterCtl) All(ctx iris.Context, ss *service.ShorterService) {
	all, err := ss.ShowAll()
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
