# 🔧 Comandos Útiles de Docker (Guía How-to)

Esta guía te muestra paso a paso cómo gestionar el stack utilizando comandos nativos de Docker y Docker Compose. Está orientada a resolver tareas operativas del día a día, como detener la infraestructura o acceder interactivamente a una base de datos específica.

---

## Gestión de la Infraestructura (Docker Compose)

El ciclo de vida completo de los contenedores se maneja utilizando la CLI de `docker compose`. Debes ejecutar estos comandos siempre desde la **raíz del proyecto** (donde se encuentra el archivo `docker-compose.yml`).

### Iniciar el entorno

Levanta todos los servicios configurados y los manda a segundo plano (`-d`, detached mode).

```bash
docker compose up -d
```

### Detener el entorno

Apaga los contenedores activos de forma segura sin borrar la persistencia (volúmenes).

```bash
docker compose down
```

### Detener y destruir el entorno (Peligro)

Apaga los contenedores y, además, elimina permanentemente todos los volúmenes de datos (`-v`). Utilízalo solo si deseas comenzar con bases de datos completamente en blanco.

```bash
docker compose down -v
```

### Monitoreo en tiempo real

Muestra el streaming de logs de todos los contenedores al unísono.

```bash
docker compose logs -f
```

> [!TIP]
> Si solo quieres ver los logs de un contenedor en particular, añade el nombre del servicio al final: `docker compose logs -f postgres`.

---

## Acceso Interactivo a Contenedores (Docker Exec)

Si necesitas operar dentro de los contenedores (ej. correr queries, revisar procesos del sistema o testear una herramienta), puedes usar `docker exec`.

> [!NOTE]
> En los siguientes ejemplos, recuerda sustituir `<tu_usuario_admin>` por el valor que configuraste para `ADMIN_USER` en tu archivo `.env`.

> [!TIP]
> **Atajos de Node.js:** En lugar de recordar todos estos comandos nativos largos, puedes utilizar los scripts interactivos de `pnpm` desde la raíz de tu proyecto, los cuales inyectan tu usuario y contraseña del `.env` automáticamente:
>
> - `pnpm run enter:postgres`
> - `pnpm run enter:mysql`
> - `pnpm run enter:mongo`
> - `pnpm run enter:redis`
> - `pnpm run enter:ubuntu`
> - `pnpm run enter:kali`
> - `pnpm run enter:php`
> - `pnpm run enter:java`
> - `pnpm run enter:python`
> - `pnpm run enter:elixir`

### Acceder a Bases de Datos

Conéctate de forma interactiva (`-it`) directamente al cliente de base de datos integrado en los contenedores.

**PostgreSQL (psql):**

```bash
docker exec -it postgres_db psql -U <tu_usuario_admin>
```

**MySQL (mysql-client):**

```bash
docker exec -it mysql_db mysql -u <tu_usuario_admin> -p
```

_(Pedirá tu contraseña. Ingresa la que configuraste como `ADMIN_PASSWORD`)_

**MongoDB (mongosh):**

```bash
docker exec -it mongo_db mongosh -u <tu_usuario_admin> -p --authenticationDatabase admin
```

**Redis (redis-cli):**

```bash
docker exec -it redis_db redis-cli --user <tu_usuario_admin> -a <tu_contraseña_admin> --no-auth-warning
```

### Acceder a los Sistemas Linux (OS)

Conéctate a las terminales (shells) de las máquinas Linux como el administrador configurado por el stack.

**Ubuntu LTS:**

```bash
docker exec -it ubuntu_dev su - <tu_usuario_admin>
```

**Kali Linux:**

```bash
docker exec -it kali_dev su - <tu_usuario_admin>
```

### Acceder a Compiladores / Lenguajes de Programación

Conéctate a las terminales (shells) de los contenedores de lenguajes para compilar y ejecutar tu código. El directorio definido en `HOST_WORKSPACE` (por defecto tu carpeta de usuario en Windows) estará montado en `/workspace`.

**PHP 8.3:**

```bash
docker exec -it php_dev su - <tu_usuario_admin>
```

**Java 21:**

```bash
docker exec -it java_dev su - <tu_usuario_admin>
```

**Python 3.12:**

```bash
docker exec -it python_dev su - <tu_usuario_admin>
```

**Elixir 1.17:**

```bash
docker exec -it elixir_dev su - <tu_usuario_admin>
```
