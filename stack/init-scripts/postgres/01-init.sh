set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<EOSQL

-- Crear usuario administrador personalizado con permisos de superusuario
CREATE USER ${ADMIN_USER} WITH SUPERUSER PASSWORD '${ADMIN_PASSWORD}';

-- Crear base de datos de prueba asignada al nuevo usuario
CREATE DATABASE desarrollo OWNER ${ADMIN_USER};

-- Otorgar todos los privilegios sobre la base de datos de prueba
GRANT ALL PRIVILEGES ON DATABASE desarrollo TO ${ADMIN_USER};

EOSQL

echo "✔ PostgreSQL: usuario '${ADMIN_USER}' creado con rol SUPERUSER."
echo "✔ PostgreSQL: base de datos 'desarrollo' creada."
