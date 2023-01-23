package main

import (
	"flag"
	"fmt"
	"github.com/iris-contrib/middleware/cors"
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/middleware/accesslog"
	"github.com/spf13/viper"
	"leizhenpeng/link-shorter-api/controller"
	"leizhenpeng/link-shorter-api/model"
	"leizhenpeng/link-shorter-api/service"
)

var db *model.ShorterDB

var (
	mode = flag.String("mode", "dev", "mode to run")
)

func main() {
	app := NewApp()
	portNow := fmt.Sprintf(":%s", viper.GetString("port"))
	app.Listen(portNow)
	return
}

func NewApp() *iris.Application {
	flag.Parse()
	ac := makeAccessLog()
	readEnv()
	app := iris.New()
	app.UseRouter(ac.Handler)
	corsApp(app)

	db = model.InitDb(
		viper.GetString("dbName"),
		viper.GetString("bucketName"),
	)

	iris.RegisterOnInterrupt(func() {
		db.Close()
		ac.Close()
	})

	initApp(app, db)
	return app

}

func corsApp(app *iris.Application) {
	crs := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
	})
	app.UseRouter(crs)
}
func readEnv() {
	viper.SetConfigFile("config.yaml")
	err := viper.ReadInConfig()
	if err != nil {
		panic(err)
	}
}
func initApp(app *iris.Application, db *model.ShorterDB) {
	shortService := service.NewShorterService(db)
	app.RegisterDependency(shortService)
	controller.NewShorterCtl().Register(app)
}

func makeAccessLog() *accesslog.AccessLog {
	ac := accesslog.File("./access.log")
	ac.SetFormatter(&accesslog.JSON{
		Indent:    "  ",
		HumanTime: true,
	})
	return ac
}
