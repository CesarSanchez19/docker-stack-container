set -e

run_sql() {
  if type docker_process_sql &>/dev/null; then
    docker_process_sql
  else
    mysql -u root -p"${MYSQL_ROOT_PASSWORD}"
  fi
}

run_sql <<EOSQL

-- Crear usuario administrador accesible desde cualquier host
CREATE USER '${ADMIN_USER}'@'%' IDENTIFIED BY '${ADMIN_PASSWORD}';

-- Otorgar todos los privilegios globales con capacidad de delegar
GRANT ALL PRIVILEGES ON *.* TO '${ADMIN_USER}'@'%' WITH GRANT OPTION;

-- Crear base de datos de prueba
CREATE DATABASE IF NOT EXISTS desarrollo;

FLUSH PRIVILEGES;

EOSQL

echo "✔ MySQL: usuario '${ADMIN_USER}' creado con ALL PRIVILEGES."
echo "✔ MySQL: base de datos 'desarrollo' creada."
