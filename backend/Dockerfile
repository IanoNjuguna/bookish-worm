# Multi-stage Dockerfile for Go API Gateway
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Download Go module dependencies
COPY go.mod go.sum* ./
RUN go mod download

# Copy source files & embedded static assets
COPY . .

# Build static binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o gateway main.go

# Production stage
FROM alpine:3.19
RUN apk add --no-cache ca-certificates

WORKDIR /app
COPY --from=builder /app/gateway /app/gateway

ENV PORT=8080
EXPOSE 8080

CMD ["/app/gateway"]
