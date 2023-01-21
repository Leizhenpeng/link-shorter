build:
	GO111MODULE=on GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o target/main main.go
	cp config.yaml target/config.yaml
dev:
	go run main.go --port 8081


