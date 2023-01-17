package main

import (
	"github.com/kataras/iris/v12"
	"github.com/spf13/viper"
	"leizhenpeng/link-shorter-api/controller"
	"leizhenpeng/link-shorter-api/model"
	"leizhenpeng/link-shorter-api/service"
)

var db *model.ShorterDB

func main() {
	readEnv()
	app := iris.Default() // ...
	db = model.InitDb(
		viper.GetString("dbName"),
		viper.GetString("bucketName"),
	)
	iris.RegisterOnInterrupt(
		func() {
			db.Close()
		})
	initApp(app, db)
	app.Listen(":" + viper.GetString("port"))
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
