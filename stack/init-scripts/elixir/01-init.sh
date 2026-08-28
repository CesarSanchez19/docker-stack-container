set -e

if [ -f /var/lib/.init-done ]; then
  exec "$@"
fi

apt-get update && apt-get install -y --no-install-recommends \
  sudo \
  git \
  curl \
  inotify-tools \
  build-essential \
  && rm -rf /var/lib/apt/lists/*

if ! id "$ADMIN_USER" &>/dev/null; then
  useradd -m -s /bin/bash "$ADMIN_USER"
  echo "${ADMIN_USER}:${ADMIN_PASSWORD}" | chpasswd
  usermod -aG sudo "$ADMIN_USER"
  echo "✔ Elixir: usuario '${ADMIN_USER}' creado con acceso sudo."
fi

su - "$ADMIN_USER" -c "mix local.hex --force && mix local.rebar --force"

touch /var/lib/.init-done
echo "✔ Elixir 1.17: Configuración inicial completada."
echo "  ├─ Herramientas: Hex, Rebar3, inotify-tools (Phoenix LiveReload)"
echo "  └─ Entorno Mix: configurado para el usuario ${ADMIN_USER}"

exec "$@"

