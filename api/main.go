package main

import (
	"flag"
	"fmt"
	"github.com/iris-contrib/middleware/cors"
	"github.com/kataras/iris/v12"
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
	initApp(app, db)
	portNow := fmt.Sprintf(":%s", viper.GetString("port"))
	app.Listen(portNow)
	return

}

func readEnv() {
	viper.SetConfigFile("config.yaml")
	err := viper.ReadInConfig()
	if err != nil {
		panic(err)
	}
	//viper.Set("dbName", "shorter.db")
	//viper.Set("bucketName", "link")
}
func initApp(app *iris.Application, db *model.ShorterDB) {
	ss := service.ShorterService{
		DB: db,
	}
	cc := controller.ShorterCtl{Service: &ss}
	cc.Register(app)
}
