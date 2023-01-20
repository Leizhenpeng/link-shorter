package main

import (
	"flag"
	"fmt"
	"github.com/iris-contrib/gateway"
	"github.com/iris-contrib/middleware/cors"
	"github.com/kataras/iris/v12"
	"github.com/spf13/viper"
	"leizhenpeng/link-shorter-api/controller"
	"leizhenpeng/link-shorter-api/model"
	"leizhenpeng/link-shorter-api/service"
)

var db *model.ShorterDB

var (
	port = flag.Int("port", -1, "specify a port")
)

func main() {
	flag.Parse()
	readEnv()
	app := iris.New()
	crs := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
	})
	app.UseRouter(crs)
	db = model.InitDb(
		viper.GetString("dbName"),
		viper.GetString("bucketName"),
	)
	iris.RegisterOnInterrupt(
		func() {
			db.Close()
		})
	addCors(app)
	initApp(app, db)

	if *port != -1 {
		portNow := fmt.Sprintf(":%d", *port)
		app.Listen(portNow)
		return
	}

	runner, configurator := gateway.New(gateway.Options{
		URLPathParameter:   "path",
		URLMethodParameter: "method",
	})
	app.Run(runner, configurator)
	//app.Listen(":" + viper.GetString("port"))
}

func addCors(app *iris.Application) {

}

func readEnv() {
	viper.SetConfigFile("config.yaml")
	err := viper.ReadInConfig()
	if err != nil {
		panic(err)
	}
}

func initApp(app *iris.Application, db *model.ShorterDB) {
	ss := service.ShorterService{
		DB: db,
	}
	cc := controller.ShorterCtl{Service: &ss}
	cc.Register(app)

}
