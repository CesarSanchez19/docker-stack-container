set -e

if [ -f /var/lib/.init-done ]; then
  exec "$@"
fi

if ! command -v sudo &>/dev/null; then
  apt-get update && apt-get install -y sudo
fi

if ! id "$ADMIN_USER" &>/dev/null; then
  useradd -m -s /bin/bash "$ADMIN_USER"
  echo "${ADMIN_USER}:${ADMIN_PASSWORD}" | chpasswd
  usermod -aG sudo "$ADMIN_USER"
  echo "✔ Kali Linux: usuario '${ADMIN_USER}' creado con acceso sudo."
fi

touch /var/lib/.init-done
echo "✔ Kali Linux: Configuración inicial completada."

exec "$@"
