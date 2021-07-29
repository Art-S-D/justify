# Justify
![CI](https://github.com/Art-S-D/justify/workflows/CI/badge.svg)


A node server to justify text.

# Setup

```bash
yarn install
yarn dev # to start development server
yarn start # to start a production server
```

# API

| Endpoint | Body | Headers | response |
| -------- | ---- | ------- | -------- |
| /api/token | {"email":\<your email\>} | Content-Type: application/json| {"token":\<your token\>}|
| /api/justify | \<any text\> | "Content-Type: text/plain" and "Bearer: \<token\>" | plain, justified text|

# Limitations

The /api/token endpoint has a limit of 80.000 cals per email per day.
The header X-RateLimit-Left tells you how many requests are left.
Once the limit has been reached, a status 402 will be sent back.