# Writter

Aplicación tipo Twitter/X ligera: **Laravel 12**, **Inertia 3**, **React 19**, **Tailwind CSS 4**, base de datos **MySQL 8**.

## Prerrequisitos (exactos)

| Herramienta | Versión |
|-------------|---------|
| Docker Engine | **24+** |
| Docker Compose (plugin `compose` v2) | **2.20+** |
| Git | **2.x** |

Opcional para desarrollo **sin** Docker en el host: PHP **8.2+**, Composer **2.x**, Node.js **20 LTS**, MySQL **8.x** y extensiones PHP `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`, `fileinfo`.

## Un solo comando (Docker)

Desde la raíz del proyecto (con Docker instalado y el daemon en ejecución):

```bash
docker compose up --build
```

- **App**: [http://localhost:8000](http://localhost:8000)
- **Vite (HMR)** expuesto en el host: [http://localhost:5173](http://localhost:5173) (el front se sirve vía Laravel; 5173 es el dev server de Vite)

La primera ejecución instala dependencias PHP/JS dentro del contenedor, espera a MySQL, ejecuta migraciones y arranca Vite + `php artisan serve`.

Para detener: `Ctrl+C` o `docker compose down`.

## Variables de entorno

Copia el ejemplo y ajusta si trabajas fuera de Docker:

```bash
cp .env.example .env
php artisan key:generate
```

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `APP_NAME` | Nombre mostrado en la app | `Writter` |
| `APP_ENV` | Entorno | `local` |
| `APP_KEY` | Clave de cifrado (generar con `key:generate`) | `base64:...` |
| `APP_DEBUG` | Depuración | `true` / `false` |
| `APP_URL` | URL pública de la app | `http://localhost:8000` |
| `DB_CONNECTION` | Driver DB | `mysql` |
| `DB_HOST` | Host MySQL (en Docker Compose: servicio `mysql`) | `mysql` o `127.0.0.1` |
| `DB_PORT` | Puerto | `3306` |
| `DB_DATABASE` | Base de datos | `writter` |
| `DB_USERNAME` | Usuario | `writter` |
| `DB_PASSWORD` | Contraseña | `writter_secret` |
| `SESSION_DRIVER` | Sesiones | `database` |
| `QUEUE_CONNECTION` | Colas | `database` |
| `VITE_APP_NAME` | Nombre en assets Vite | `${APP_NAME}` |
| `VITE_DEV_SERVER_URL` | URL del servidor Vite en desarrollo | `http://localhost:5173` |

En **Docker**, `compose.yaml` define `DB_*` y `VITE_*` para el servicio `app`; tienen prioridad sobre el archivo `.env` del proyecto.

Credenciales de ejemplo del servicio MySQL en Compose: usuario `writter`, contraseña `writter_secret`, base `writter`, root `writter_root` (solo desarrollo).

## Instalación manual (sin Docker)

1. Clonar el repositorio.
2. `cp .env.example .env` y configurar `DB_*` hacia tu MySQL local (crear base `writter` y usuario con permisos).
3. `composer install`
4. `php artisan key:generate`
5. `php artisan migrate`
6. `npm ci`
7. En una terminal: `npm run dev`  
   En otra: `php artisan serve`  
   (o `composer dev` si quieres cola, logs y Vite juntos).

## Seed de datos

Cuando exista el seeder del proyecto:

```bash
php artisan db:seed
```

(En Docker, ejecutar dentro del contenedor: `docker compose exec app php artisan db:seed`.)

## Modo desarrollo (resumen)

| Entorno | Comando principal |
|---------|-------------------|
| Docker | `docker compose up --build` |
| Host | `composer dev` **o** `npm run dev` + `php artisan serve` |

## Tests

```bash
composer test
# o
php artisan test
```

La suite usa SQLite en memoria (`phpunit.xml`), sin depender de MySQL.

## Estructura relevante

- `compose.yaml` — MySQL + app PHP/Node
- `Dockerfile` — imagen de la app (PHP CLI + Composer + Node 20)
- `docker/entrypoint.sh` — dependencias, espera a MySQL, migraciones, Vite + servidor HTTP

## Licencia

MIT (igual que Laravel).
