# Writter

Social feed app: **Laravel 12**, **Inertia v2**, **React 18**, **Tailwind**, **MySQL 8**. Timeline with infinite scroll, posts (rich text), images, Klipy stickers, likes, replies, follows, notifications, search.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Docker Engine | 25+ |
| Docker Compose | v2 (`docker compose`) |
| Node.js (only without Docker) | 20 LTS |
| PHP / Composer (only without Docker) | PHP 8.3+, Composer 2 |

---

## Development with one command (recommended: Docker)

From the project root:

```bash
make dev
```

Same as:

```bash
docker compose up --build
```

This starts **MySQL**, the **Laravel** app on **http://localhost:8000**, and **Vite** (HMR) on **http://localhost:5173**. The `app` container runs `docker/entrypoint.sh`: installs Composer/npm if needed, waits for MySQL, `storage:link`, migrations, then `npm run dev` + `php artisan serve`.

**First-time / optional seed:**

```bash
docker compose exec app php artisan db:seed
```

**Logs:** `docker compose logs -f app`  
**Artisan:** `docker compose exec app php artisan <command>`

---

## Development without Docker (host machine)

Requires MySQL reachable with the credentials in `.env` (`DB_HOST`, `DB_PORT`, etc.).

```bash
cp .env.example .env
composer install
npm ci
php artisan key:generate
php artisan migrate
```

**Single command** (Laravel server + Vite only):

```bash
composer dev
```

Optional: queue worker + log stream + Vite + server:

```bash
composer dev:full
```

- App: http://127.0.0.1:8000 (default `php artisan serve`)  
- Set `VITE_DEV_SERVER_URL` in `.env` if the Vite port differs.

---

## Tests

**PHPUnit** (SQLite driver must be available in PHP):

```bash
docker compose exec app php artisan test
```

**Vitest:**

```bash
docker compose exec app npm run test
```

---

## Production: Docker image (Railway & others)

The repo includes **`Dockerfile.production`** (multi-stage: `npm run build` + `composer install --no-dev`) and **`docker/railway-entrypoint.sh`**, which runs migrations (optional), `storage:link`, Laravel caches, then **`php artisan serve`** bound to **`0.0.0.0:$PORT`**.

**Railway**

1. Create a project → **Deploy from repo**.
2. Add a **MySQL** (or Postgres with code changes) plugin and link it so `DATABASE_URL` / `MYSQL*` env vars are set. Map variables to Laravel’s `DB_*` (or use a Railway **Variable Reference** template).
3. **`railway.toml`** points the build to `Dockerfile.production`.
4. Set at minimum: `APP_KEY` (`php artisan key:generate --show`), `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL` (your Railway URL, e.g. `https://your-app.up.railway.app`).
5. Railway sets **`PORT`**; the entrypoint uses it automatically.
6. Trust proxies: the app uses `trustProxies(at: '*')` for HTTPS behind Railway’s edge.

**Build locally:**

```bash
docker build -f Dockerfile.production -t writter:prod .
```

**Skip migrations on boot** (e.g. run them manually): `RUN_MIGRATIONS_ON_START=false`.

**Persistent storage:** uploaded files live under `storage/app/public`. On Railway, attach a **volume** mounted at `/var/www/html/storage` (or sync to S3 in a future iteration).

---

## Environment variables

| Variable | Description |
|----------|-------------|
| `APP_NAME` | Application name |
| `APP_URL` | Public URL (match browser / Railway URL) |
| `APP_KEY` | `php artisan key:generate` |
| `APP_DEBUG` | `true` local / `false` production |
| `DB_*` | MySQL connection (see `.env.example`) |
| `VITE_APP_NAME` | Shown in asset pipeline |
| `VITE_DEV_SERVER_URL` | Vite dev URL (local / Docker host) |
| `KLIPY_API_KEY` | Optional — Klipy stickers API (see note below) |
| `PORT` | Set by Railway; default `8080` in the production image |

**Klipy:** After adding or changing `KLIPY_API_KEY`, run `php artisan config:clear` if you use configuration caching (`config:cache` in deploy scripts); otherwise Laravel may keep serving an old empty value and stickers will not load.

Copy `.env.example` → `.env`. Do not commit `.env`.

---

## Features (summary)

- Auth with unique **username**, **bio**, **avatar**
- **Posts**: rich text (TipTap), **images**, optional **Klipy stickers** (HTTPS URLs from `*.klipy.com`)
- **Timeline**: infinite scroll (Inertia `ScrollProp`), feed from follows + self
- **Likes**, **replies**, **threads**, **follow / unfollow**
- **Notifications**, **user search**, **profiles** with follower lists

---

## Data model (at a glance)

| Model | Role |
|-------|------|
| **User** | Auth + profile (`username`, bio, avatar). Has many **posts** and **likes**. Many-to-many **follows** (self-relation via `follows`: follower ↔ followee). Has many **social_notifications** (inbox). |
| **Post** | Belongs to **user**. Optional **parent** post → **replies** / threads. Optional local **image** (`image_path` → public storage) and optional **sticker_url** (HTTPS URL from Klipy, not stored as binary). Has many **likes**. |
| **Like** | Joins **user** + **post** (unique per pair). |
| **Follow** | Row per edge: `follower_id` → `followee_id`. |
| **SocialNotification** | Belongs to recipient **user** and **actor** user; `type` + JSON `data`; `read_at` for unread badge. |

**Klipy:** stickers are chosen in the UI via the app’s API routes, which call Klipy’s HTTP API with `KLIPY_API_KEY`. Only the chosen asset URL is persisted on `posts.sticker_url`.

---

## Project structure

- `app/Http/Controllers/` — timeline, posts, likes, follows, search, notifications, profile
- `app/Models/` — `User`, `Post`, etc.
- `resources/js/Pages/` — Inertia pages
- `resources/js/Components/Social/` — composer, post card, stickers, etc.
- `Dockerfile` — local dev image used by `compose.yaml`
- `Dockerfile.production` — production image
- `docker/entrypoint.sh` — dev container startup
- `docker/railway-entrypoint.sh` — production container startup

---

## License

MIT (unless otherwise specified).
