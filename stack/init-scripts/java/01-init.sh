set -e

if [ -f /var/lib/.init-done ]; then
  exec "$@"
fi

apt-get update && apt-get install -y --no-install-recommends \
  sudo \
  git \
  unzip \
  wget \
  curl \
  maven \
  gradle \
  && rm -rf /var/lib/apt/lists/*

if ! id "$ADMIN_USER" &>/dev/null; then
  useradd -m -s /bin/bash "$ADMIN_USER"
  echo "${ADMIN_USER}:${ADMIN_PASSWORD}" | chpasswd
  usermod -aG sudo "$ADMIN_USER"
  echo "✔ Java: usuario '${ADMIN_USER}' creado con acceso sudo."
fi

mkdir -p /home/$ADMIN_USER/.m2
chown -R $ADMIN_USER:$ADMIN_USER /home/$ADMIN_USER/.m2

touch /var/lib/.init-done
echo "✔ Java 21 (JDK): Configuración inicial completada."
echo "  ├─ Maven: $(mvn --version | head -1)"
echo "  └─ Gradle: $(gradle --version | grep Gradle | xargs)"

exec "$@"

