build:
	go build -o ./functions/link-shorter-api-main
	chmod +x ./functions/link-shorter-api-main
	zip -r ./functions/link-shorter-api.zip ./functions/link-shorter-api-main config.yaml
	rm ./functions/link-shorter-api-main

dev:
	go run main.go --port 8081
