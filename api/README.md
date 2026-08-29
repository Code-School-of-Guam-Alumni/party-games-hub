# Party Games Hub API

Rails API for the Code School of Guam alumni internship project.

## Run locally

```bash
bundle install
bin/rails db:prepare
bin/dev
```

Override the default bind address or port with `PARTY_GAMES_DEV_API_HOST` and
`PARTY_GAMES_DEV_API_PORT`.

Health check: `http://127.0.0.1:43201/up`

Starter game catalog: `http://127.0.0.1:43201/api/v1/games`
