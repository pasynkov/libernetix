# Libernetix example service

First of all you have to rename `./apps/libernetix/.env.example` to `./apps/libernetix/.env` and set the environment variables.


## docker compose start

```bash
docker compose up --build --force-create
```
Open http://localhost/ in your browser.

## npm start

```bash
npm i
npm start
```

Open http://localhost:3001/ in your browser.


## monitor and metrics
Provide env MONITOR_PORT (default 3002) in env file.

http://localhost:3002/metrics - Prometheus metrics
http://localhost:3002/healthy - Health check
