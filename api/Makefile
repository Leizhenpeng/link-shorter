build:
	go build -o ./functions/link-shorter-api
	chmod +x ./functions/link-shorter-api
	 zip -r ./functions/link-shorter-api.zip ./functions/link-shorter-api config.yaml

dev:
	go run main.go --port 8081
