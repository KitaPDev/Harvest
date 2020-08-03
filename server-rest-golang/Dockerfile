FROM golang:latest
LABEL maintainer="Modern Farms <themodernfarms@gmail.com>"
WORKDIR /app
EXPOSE 9090
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o main .
CMD ["go", "run", "server.go"]