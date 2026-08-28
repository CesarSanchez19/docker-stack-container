set -e

if [ -f /var/lib/.init-done ]; then
  exec "$@"
fi

apt-get update && apt-get install -y --no-install-recommends \
  sudo \
  git \
  curl \
  build-essential \
  libpq-dev \
  default-libmysqlclient-dev \
  pkg-config \
  && rm -rf /var/lib/apt/lists/*

if ! id "$ADMIN_USER" &>/dev/null; then
  useradd -m -s /bin/bash "$ADMIN_USER"
  echo "${ADMIN_USER}:${ADMIN_PASSWORD}" | chpasswd
  usermod -aG sudo "$ADMIN_USER"
  echo "✔ Python: usuario '${ADMIN_USER}' creado con acceso sudo."
fi

pip install --upgrade pip
pip install poetry pipenv pytest flake8 black psycopg2-binary mysqlclient pymongo requests

touch /var/lib/.init-done
echo "✔ Python 3.12: Configuración inicial completada."
echo "  ├─ Manejadores: Poetry, Pipenv, pip"
echo "  ├─ Testing & Linting: pytest, flake8, black"
echo "  └─ DB Connectors: psycopg2, mysqlclient, pymongo"

exec "$@"

