#!/bin/sh
set -e
cd /var/www/html

export COMPOSER_ALLOW_SUPERUSER=1

if [ ! -f .env ]; then
    cp .env.example .env
fi

if ! grep -q '^APP_KEY=base64:' .env 2>/dev/null; then
    php artisan key:generate --force
fi

if [ ! -d vendor ]; then
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

if [ ! -d node_modules ]; then
    npm ci
fi

# Read DB connection values directly from .env so this script is self-contained.
_db_host=$(grep '^DB_HOST=' .env | head -1 | cut -d'=' -f2-)
_db_port=$(grep '^DB_PORT=' .env | head -1 | cut -d'=' -f2-)
_db_user=$(grep '^DB_USERNAME=' .env | head -1 | cut -d'=' -f2-)
_db_pass=$(grep '^DB_PASSWORD=' .env | head -1 | cut -d'=' -f2-)
_db_host=${_db_host:-mysql}
_db_port=${_db_port:-3306}
_db_user=${_db_user:-writter}
_db_pass=${_db_pass:-}

echo "Waiting for MySQL at ${_db_host}:${_db_port}..."
i=0
while [ "$i" -lt 60 ]; do
    if php -r "
        try {
            new PDO('mysql:host=${_db_host};port=${_db_port}', '${_db_user}', '${_db_pass}');
            exit(0);
        } catch (Exception \$e) {
            exit(1);
        }
    " 2>/dev/null; then
        echo "MySQL is reachable."
        break
    fi
    i=$((i + 1))
    sleep 2
done

php artisan config:clear
echo "Linking public/storage..."
php artisan storage:link --force
php artisan migrate --force

echo "Starting Vite and Laravel (Vite :5173, app :8000)..."
npm run dev -- --host 0.0.0.0 --port 5173 &
VITE_PID=$!

trap 'kill "$VITE_PID" 2>/dev/null; exit 0' INT TERM EXIT

php artisan serve --host=0.0.0.0 --port=8000
