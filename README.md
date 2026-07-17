# 🔌 NestHaven API

Backend for **[NestHaven](../nesthaven)** — the UK student accommodation platform.
An Express + MySQL service that powers property search, direct landlord listings,
the property chatbot, and the UK student-life AI agent.

> Node.js + Express · MySQL (TiDB Cloud) · Uniplaces API · Groq / Llama 3.3

---

## 🚀 Run

```bash
cp .env.example .env     # fill in your credentials
npm install
npm start                # http://localhost:3004
```

Expose it publicly (optional):

```bash
npm run tunnel           # ngrok tunnel to :3004
```

---

## 🔑 Environment (`.env`)

| Key | Purpose |
|---|---|
| `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` | TiDB Cloud (MySQL) |
| `DB_SSL_CA` | Path to the SSL cert bundled in the repo (e.g. `ca1.pem`) |
| `UNIPLACES_API_KEY` | Uniplaces partner feed |
| `BaseURL` | Uniplaces API base URL |
| `GROQ_API_KEY` | UK Student Guide AI ([free key](https://console.groq.com)) — optional; falls back to curated answers |
| `GROQ_MODEL` | Optional model override (default `llama-3.3-70b-versatile`) |
| `CronJob` | node-cron schedule for the Uniplaces sync |

> `.env`, `ca.pem`, and `ca1.pem` are git-ignored — never commit real credentials.

---

## 📡 Endpoints

| Method | Route | Description |
|---|---|---|
| `GET`  | `/` | Service status + endpoint list |
| `GET`  | `/api/rentals?title=` | Search Uniplaces rentals by city / area |
| `GET`  | `/api/rentals/offerid?offerid=` | Single rental by offer id |
| `GET`  | `/api/rentals/cities` | Cities available in the dataset |
| `POST` | `/api/calculate-pricing` | Uniplaces booking price for dates + guests |
| `POST` | `/api/chat/property` | Property chatbot — homes near a university |
| `POST` | `/api/agent/visa` | UK student-life AI agent (T4 visa, NHS, banking…) |
| `GET`  | `/api/direct/listings?title=` | Direct landlord listings |
| `POST` | `/api/direct/listings` | Create a direct landlord listing |
| `GET`  | `/api/direct/listings/:id` | Single direct listing |

---

## 🗂️ Files

```
server.js            # app + DB pool, Uniplaces sync (cron), rentals endpoints
nesthaven-ai.js      # /api/chat/property + /api/agent/visa (Groq w/ fallback)
nesthaven-direct.js  # direct landlord listings (auto-creates its table)
ngrok-tunnel.js      # optional public tunnel to :3004
ca.pem / ca1.pem     # TiDB SSL certs (git-ignored)
```

---

## 🧩 Data sources

- **Uniplaces** partner API — synced into MySQL every 8h via `node-cron`
- **Direct landlords** — submitted through NestHaven's *List your property* form
- **Groq (Llama 3.3)** — generates the student-guide answers

---

## 🗄️ Stack

Node.js · Express · mysql2 · axios · node-cron · dotenv · cors — **6 runtime deps, API-only.**

---

_The frontend lives in the sibling [`nesthaven`](../nesthaven) Angular project._
