#!/bin/sh
set -e

ACL_FILE="/tmp/users.acl"

# Generar archivo ACL con las variables de entorno
cat > "$ACL_FILE" <<EOF
user default on >${ADMIN_PASSWORD} ~* &* +@all
user ${ADMIN_USER} on >${ADMIN_PASSWORD} ~* &* +@all
EOF

echo "✔ Redis: archivo ACL generado con usuario '${ADMIN_USER}'."

# Iniciar Redis con la configuración completa
exec redis-server \
  --requirepass "${ADMIN_PASSWORD}" \
  --aclfile "$ACL_FILE" \
  --appendonly yes \
  --maxmemory 400mb \
  --maxmemory-policy allkeys-lru

