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

echo "Waiting for MySQL at ${DB_HOST:-mysql}..."
i=0
while [ "$i" -lt 60 ]; do
    if php -r "
        try {
            \$host = getenv('DB_HOST') ?: 'mysql';
            \$port = getenv('DB_PORT') ?: '3306';
            \$user = getenv('DB_USERNAME') ?: 'writter';
            \$pass = getenv('DB_PASSWORD') ?: '';
            new PDO('mysql:host='.\$host.';port='.\$port, \$user, \$pass);
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

php artisan migrate --force

echo "Starting Vite and Laravel (Vite :5173, app :8000)..."
npm run dev -- --host 0.0.0.0 --port 5173 &
VITE_PID=$!

trap 'kill "$VITE_PID" 2>/dev/null; exit 0' INT TERM EXIT

php artisan serve --host=0.0.0.0 --port=8000
