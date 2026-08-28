# 🛠️ Tooling Programático en Node.js (Guía y Referencia)

El proyecto incluye una solución a medida desarrollada en Node.js, ubicada en el directorio `stack/tooling/`. Este _tooling_ actúa como un panel de control interactivo mediante línea de comandos (CLI) que se comunica directamente con la API de tu motor Docker (vía `dockerode`).

Su propósito es abstraer comandos complejos de Docker y presentarte un resumen claro sobre el estado, salud (health checks) y administración de todo el ecosistema local.

---

## 🚀 Instalación y Preparación

**Se ha configurado el archivo `package.json` de la raíz del repositorio como proxy.** Esto significa que puedes (y debes) ejecutar todos los comandos de instalación y de scripts desde la **raíz del proyecto**.

Ejecuta el siguiente comando para instalar las dependencias necesarias:

```bash
pnpm install
```

_(Esto instalará los módulos como `chalk`, `cli-table3`, `dockerode` y `dotenv` de manera automática para potenciar las utilidades)._

---

## 🖥️ Comandos Globales

Estos comandos actúan sobre **todo el stack en simultáneo**.

| Comando            | Propósito                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| `pnpm run status`  | Imprime una tabla visual con el estado actual de cada contenedor y sus puertos.                              |
| `pnpm run health`  | Interroga el Healthcheck nativo de Docker de cada servicio para confirmar operatividad.                      |
| `pnpm run logs`    | Extrae de forma paralela los últimos logs emitidos por toda la infraestructura.                              |
| `pnpm run start`   | Envía la señal de encendido a todos los contenedores apagados.                                               |
| `pnpm run stop`    | Envía la señal de apagado a todos los contenedores encendidos. Solicita confirmación antes de ejecutarse.    |
| `pnpm run restart` | Reinicia de forma secuencial todo el stack. Solicita confirmación antes de ejecutarse.                       |
| `pnpm run remove`  | Elimina forzosamente todos los contenedores. Solicita confirmación antes de ejecutarse (acción destructiva). |
| `pnpm run enter`   | Requiere especificar un contenedor. Permite el acceso interactivo (shell) a un servicio.                     |

---

## 🎯 Comandos Específicos por Contenedor

Cada uno de los comandos globales que alteran estado tiene atajos preconfigurados para operar sobre un contenedor individual sin necesidad de escribir su nombre.

---

### 🏥 Health Check (Salud)

Verifica el estado de salud nativo de Docker y el log de salida de un contenedor específico. A diferencia del comando global, este proporciona un reporte detallado con la salida textual completa del último diagnóstico.

| Comando                    | Contenedor objetivo                                 |
| -------------------------- | --------------------------------------------------- |
| `pnpm run health:postgres` | Diagnóstico detallado del contenedor `postgres_db`. |
| `pnpm run health:mysql`    | Diagnóstico detallado del contenedor `mysql_db`.    |
| `pnpm run health:mongo`    | Diagnóstico detallado del contenedor `mongo_db`.    |
| `pnpm run health:pgadmin`  | Diagnóstico detallado del contenedor `pgadmin_ui`.  |
| `pnpm run health:php`      | Diagnóstico detallado del contenedor `php_dev`.     |
| `pnpm run health:java`     | Diagnóstico detallado del contenedor `java_dev`.    |
| `pnpm run health:python`   | Diagnóstico detallado del contenedor `python_dev`.  |
| `pnpm run health:elixir`   | Diagnóstico detallado del contenedor `elixir_dev`.  |

---

### 📝 Logs

Visualiza los últimos logs emitidos por un servicio en particular:

| Comando                  | Contenedor objetivo                                         |
| ------------------------ | ----------------------------------------------------------- |
| `pnpm run logs:postgres` | Muestra los logs del contenedor `postgres_db` (PostgreSQL). |
| `pnpm run logs:mysql`    | Muestra los logs del contenedor `mysql_db` (MySQL).         |
| `pnpm run logs:mongo`    | Muestra los logs del contenedor `mongo_db` (MongoDB).       |
| `pnpm run logs:pgadmin`  | Muestra los logs del contenedor `pgadmin_ui` (pgAdmin).     |
| `pnpm run logs:php`      | Muestra los logs del contenedor `php_dev` (PHP 8.3).        |
| `pnpm run logs:java`     | Muestra los logs del contenedor `java_dev` (Java 21).       |
| `pnpm run logs:python`   | Muestra los logs del contenedor `python_dev` (Python 3.12). |
| `pnpm run logs:elixir`   | Muestra los logs del contenedor `elixir_dev` (Elixir 1.17). |

---

### ▶️ Iniciar (Start)

Enciende un contenedor que se encuentre apagado:

| Comando                   | Contenedor objetivo                              |
| ------------------------- | ------------------------------------------------ |
| `pnpm run start:postgres` | Inicia el contenedor `postgres_db` (PostgreSQL). |
| `pnpm run start:mysql`    | Inicia el contenedor `mysql_db` (MySQL).         |
| `pnpm run start:mongo`    | Inicia el contenedor `mongo_db` (MongoDB).       |
| `pnpm run start:pgadmin`  | Inicia el contenedor `pgadmin_ui` (pgAdmin).     |
| `pnpm run start:ubuntu`   | Inicia el contenedor `ubuntu_dev` (Ubuntu LTS).  |
| `pnpm run start:kali`     | Inicia el contenedor `kali_dev` (Kali Linux).    |
| `pnpm run start:php`      | Inicia el contenedor `php_dev` (PHP 8.3).        |
| `pnpm run start:java`     | Inicia el contenedor `java_dev` (Java 21).       |
| `pnpm run start:python`   | Inicia el contenedor `python_dev` (Python 3.12). |
| `pnpm run start:elixir`   | Inicia el contenedor `elixir_dev` (Elixir 1.17). |

---

### ⏹️ Detener (Stop)

Detiene un contenedor activo de forma segura. **Solicita confirmación** antes de ejecutarse para prevenir apagados accidentales:

| Comando                  | Contenedor objetivo                               |
| ------------------------ | ------------------------------------------------- |
| `pnpm run stop:postgres` | Detiene el contenedor `postgres_db` (PostgreSQL). |
| `pnpm run stop:mysql`    | Detiene el contenedor `mysql_db` (MySQL).         |
| `pnpm run stop:mongo`    | Detiene el contenedor `mongo_db` (MongoDB).       |
| `pnpm run stop:pgadmin`  | Detiene el contenedor `pgadmin_ui` (pgAdmin).     |
| `pnpm run stop:ubuntu`   | Detiene el contenedor `ubuntu_dev` (Ubuntu LTS).  |
| `pnpm run stop:kali`     | Detiene el contenedor `kali_dev` (Kali Linux).    |
| `pnpm run stop:php`      | Detiene el contenedor `php_dev` (PHP 8.3).        |
| `pnpm run stop:java`     | Detiene el contenedor `java_dev` (Java 21).       |
| `pnpm run stop:python`   | Detiene el contenedor `python_dev` (Python 3.12). |
| `pnpm run stop:elixir`   | Detiene el contenedor `elixir_dev` (Elixir 1.17). |

---

### 🔄 Reiniciar (Restart)

Reinicia un contenedor específico (lo detiene y lo vuelve a encender). **Solicita confirmación** antes de ejecutarse:

| Comando                     | Contenedor objetivo                                |
| --------------------------- | -------------------------------------------------- |
| `pnpm run restart:postgres` | Reinicia el contenedor `postgres_db` (PostgreSQL). |
| `pnpm run restart:mysql`    | Reinicia el contenedor `mysql_db` (MySQL).         |
| `pnpm run restart:mongo`    | Reinicia el contenedor `mongo_db` (MongoDB).       |
| `pnpm run restart:pgadmin`  | Reinicia el contenedor `pgadmin_ui` (pgAdmin).     |
| `pnpm run restart:ubuntu`   | Reinicia el contenedor `ubuntu_dev` (Ubuntu LTS).  |
| `pnpm run restart:kali`     | Reinicia el contenedor `kali_dev` (Kali Linux).    |
| `pnpm run restart:php`      | Reinicia el contenedor `php_dev` (PHP 8.3).        |
| `pnpm run restart:java`     | Reinicia el contenedor `java_dev` (Java 21).       |
| `pnpm run restart:python`   | Reinicia el contenedor `python_dev` (Python 3.12). |
| `pnpm run restart:elixir`   | Reinicia el contenedor `elixir_dev` (Elixir 1.17). |

---

### 🗑️ Eliminar (Remove)

Elimina permanentemente un contenedor del sistema Docker. **Solicita confirmación obligatoria** (escribe `yes` para proceder). Esta acción es destructiva y borrará toda la información almacenada en el contenedor:

| Comando                    | Contenedor objetivo                               |
| -------------------------- | ------------------------------------------------- |
| `pnpm run remove:postgres` | Elimina el contenedor `postgres_db` (PostgreSQL). |
| `pnpm run remove:mysql`    | Elimina el contenedor `mysql_db` (MySQL).         |
| `pnpm run remove:mongo`    | Elimina el contenedor `mongo_db` (MongoDB).       |
| `pnpm run remove:pgadmin`  | Elimina el contenedor `pgadmin_ui` (pgAdmin).     |
| `pnpm run remove:ubuntu`   | Elimina el contenedor `ubuntu_dev` (Ubuntu LTS).  |
| `pnpm run remove:kali`     | Elimina el contenedor `kali_dev` (Kali Linux).    |
| `pnpm run remove:php`      | Elimina el contenedor `php_dev` (PHP 8.3).        |
| `pnpm run remove:java`     | Elimina el contenedor `java_dev` (Java 21).       |
| `pnpm run remove:python`   | Elimina el contenedor `python_dev` (Python 3.12). |
| `pnpm run remove:elixir`   | Elimina el contenedor `elixir_dev` (Elixir 1.17). |

> [!CAUTION]
> Al ejecutar `remove`, toda la información almacenada en el contenedor se pierde de forma **irreversible**. Los volúmenes persistidos (ej. datos de bases de datos) no se eliminan automáticamente; solo el contenedor en sí es borrado. Para recrearlo, debes ejecutar `docker compose up -d`.

---

### 🔑 Acceso Interactivo (Enter)

Inicia una sesión interactiva (shell/consola de base de datos) dentro de un contenedor. Delega la autenticación de forma segura usando las credenciales del `.env`:

| Comando                   | Contenedor objetivo                  | Herramienta usada internamente |
| ------------------------- | ------------------------------------ | ------------------------------ |
| `pnpm run enter:postgres` | Ingresa al contenedor `postgres_db`. | `psql -U <tu_usuario>`         |
| `pnpm run enter:mysql`    | Ingresa al contenedor `mysql_db`.    | `mysql -u <tu_usuario>`        |
| `pnpm run enter:mongo`    | Ingresa al contenedor `mongo_db`.    | `mongosh -u <tu_usuario>`      |
| `pnpm run enter:ubuntu`   | Ingresa al contenedor `ubuntu_dev`.  | `su - <tu_usuario>`            |
| `pnpm run enter:kali`     | Ingresa al contenedor `kali_dev`.    | `su - <tu_usuario>`            |
| `pnpm run enter:php`      | Ingresa al contenedor `php_dev`.     | `su - <tu_usuario>`            |
| `pnpm run enter:java`     | Ingresa al contenedor `java_dev`.    | `su - <tu_usuario>`            |
| `pnpm run enter:python`   | Ingresa al contenedor `python_dev`.  | `su - <tu_usuario>`            |
| `pnpm run enter:elixir`   | Ingresa al contenedor `elixir_dev`.  | `su - <tu_usuario>`            |

_(Nota: pgAdmin no tiene soporte para `enter:` debido a que es una interfaz web)._

> [!IMPORTANT]
> **Requisitos para usar `enter:`:**
>
> - El contenedor **debe estar encendido**. Si no lo está, el script mostrará un error y te indicará el comando exacto para encenderlo.
> - La variable `ADMIN_USER` **debe existir** en tu archivo `.env`. Si no está definida, el script abortará con un mensaje de error claro.
> - Si `ADMIN_PASSWORD` está definida en el `.env`, la autenticación será automática (no te pedirá la clave). Si no la definiste, la herramienta nativa del contenedor (psql, mysql, mongosh) te solicitará la contraseña de forma interactiva.

---

## 🛠️ Parámetros Dinámicos Manuales

Si necesitas aplicar un comando a un contenedor que no tiene un atajo directo preconfigurado, puedes pasarle el nombre exacto del contenedor como argumento al script general.

Nombres de contenedores disponibles: `postgres_db`, `mysql_db`, `mongo_db`, `pgadmin_ui`, `ubuntu_dev`, `kali_dev`, `php_dev`, `java_dev`, `python_dev`, `elixir_dev`.

**Ejemplos:**

```bash
pnpm run start ubuntu_dev
pnpm run stop postgres_db
pnpm run remove mysql_db
pnpm run enter mongo_db
```

> [!NOTE]
> Todos los comandos de esta herramienta consultan dinámicamente tu archivo `.env` mediante `config/index.js` para asegurar que las referencias siempre sean consistentes y exactas con respecto al estado actual del entorno.
