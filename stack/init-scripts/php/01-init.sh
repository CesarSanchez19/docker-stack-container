set -e

if [ -f /var/lib/.init-done ]; then
  exec "$@"
fi

apt-get update && apt-get install -y --no-install-recommends \
  sudo \
  git \
  unzip \
  curl \
  libpq-dev \
  libzip-dev \
  libpng-dev \
  libjpeg-dev \
  libfreetype6-dev \
  libonig-dev \
  libxml2-dev \
  libicu-dev \
  libcurl4-openssl-dev \
  libssl-dev \
  && rm -rf /var/lib/apt/lists/*

docker-php-ext-configure gd --with-freetype --with-jpeg
docker-php-ext-install -j"$(nproc)" \
  pdo_pgsql \
  pdo_mysql \
  zip \
  curl \
  mbstring \
  gd \
  intl \
  bcmath \
  xml \
  opcache

pecl install mongodb && docker-php-ext-enable mongodb

curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

if ! id "$ADMIN_USER" &>/dev/null; then
  useradd -m -s /bin/bash "$ADMIN_USER"
  echo "${ADMIN_USER}:${ADMIN_PASSWORD}" | chpasswd
  usermod -aG sudo "$ADMIN_USER"
  echo "✔ PHP: usuario '${ADMIN_USER}' creado con acceso sudo."
fi

su - "$ADMIN_USER" -c "composer global require phpunit/phpunit --no-interaction --quiet 2>/dev/null || true"

touch /var/lib/.init-done
echo "✔ PHP 8.3: Configuración inicial completada."
echo "  ├─ Extensiones: pdo_pgsql, pdo_mysql, mongodb, zip, curl, mbstring, gd, intl, bcmath, xml, opcache"
echo "  ├─ Composer: $(composer --version 2>/dev/null | head -1)"
echo "  └─ PHPUnit: disponible via composer global"

exec "$@"
