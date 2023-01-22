<p align='center'>
  <img src='./doc/img.png' alt='Shorten Link' width='1000'/>
</p>

<p align='center'>
缩短网址，让分享更简单
<br>
 Shorten Link, Make Sharing Simpler
</p>

<br>

<p align='center'>
<a href="https://ss-link.netlify.app/">Live Demo</a>
</p>

<br>

<p align='center'>
<b>简体中文</b> | <a href="https://github.com/Leizhenpeng/link-shorter/blob/main/README.md">English</a>
<!-- Contributors: Thanks for getting interested, however we DON'T accept new transitions to the README, thanks. -->
</p>

<br>


## Features

- ⚡️ [qwik](https://qwik.builder.io/) 从源头上加速咱们的SSR应用

- 📦 [iris](https://www.iris-go.com/) 一个高性能、易用且功能强大的Go语言Web框架

- 🔎 [bolt](https://github.com/boltdb/bolt) 一个高效的、嵌入式的、持久化的键值存储数据库, 只是不想用太重的mysql和redis~

- 🎨 [TaliWindCss](https://tailwindcss.com/) 原子类CSS框架的祖师爷

- 😃 [daisyui](https://daisyui.com/) 使用 Tailwind CSS 但少写类名


- ☁️ Deploy on Netlify, zero-config

- 🦾 Golang, of course

- 🦾 TypeScript, of course

<br>

## 功能介绍-qwik部分
- 全局变量管理
- [I18n](https://robisim74.gitbook.io/qwik-speak/)多语言切换


## 功能介绍-iris部分
### 记录请求日志，写入本地文件

```json
{
  "timestamp": "2023-01-21 21:15:03",
  "latency": 405000,
  "code": 200,
  "method": "GET",
  "path": "/ping",
  "ip": "::1",
  "bytes_sent": 4
}

```


### 管理端JWT身份校验

```go
app.Post("/login", s.Login)
admin := app.Party("/admin")
{
    admin.UseRouter(jwtMiddle.Serve)
    admin.Post("/flush", s.Flush)
    admin.Get("/all", s.All)
    admin.Post("/del", s.DelOne)
}
```

### 路由自测，成为一名可爱的后端
```go
var commonSchema = `{
			"type": "object",
			"properties": {
				"code":  {"type": "number"},
				"msg":   {"type": "string"},
				"data":  {"type": ["object","string"]}},
			"required": ["code", "msg", "data"]
		}`
    
func TestAdminApi(t *testing.T) {
	app := NewApp()
	e := httptest.New(t, app)
	e.GET("/admin/all").Expect().Status(httptest.StatusOK).
		JSON().Schema(commonSchema)
}
```


## 相关资料

### golang

- [iris-cors](https://docs.iris-go.com/iris/security/cors#the-cors-configuration)
- [iris-jwt](https://github.com/iris-contrib/middleware/tree/master/jwt)
- [iris-test](https://docs.iris-go.com/iris/contents/testing)

### qwik

- [vite-env](https://cn.vitejs.dev/guide/env-and-mode.html#env-files)
- [qwik-i18n-by-speak](https://github.com/robisim74/qwik-speak)
- [qwik-init-repo](https://qwik.builder.io/docs/getting-started/)
- [qwik-state-management](https://qwik.builder.io/docs/components/state/)
- [qwik-component](https://qwik.builder.io/docs/components/overview/)
- [qwik-lite-component](https://qwik.builder.io/docs/components/lite-components/)
- [svg-to-jsx](https://www.svgviewer.dev/svg-to-react-jsx)



