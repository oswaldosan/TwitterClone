#!/bin/sh
set -e
cd /var/www/html

export COMPOSER_ALLOW_SUPERUSER=1

PORT="${PORT:-8080}"

chmod -R ug+rwx storage bootstrap/cache 2>/dev/null || true

if [ "${RUN_MIGRATIONS_ON_START:-true}" != "false" ]; then
    php artisan migrate --force
fi

php artisan package:discover --ansi || true

echo "Linking public/storage..."
php artisan storage:link --force

php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

exec php artisan serve --host=0.0.0.0 --port="$PORT"
