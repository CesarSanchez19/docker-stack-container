# 🐳 Docker Dev Stack

> Entorno de desarrollo local multi-servicio orquestado con Docker Compose. Incluye bases de datos (PostgreSQL, MySQL, MongoDB), interfaz de administración (pgAdmin), contenedores de pruebas de OS (Ubuntu LTS, Kali Linux), y un proyecto de tooling en Node.js para gestión programática del stack.

---

## 📋 Descripción

Este proyecto centraliza la infraestructura de desarrollo en contenedores Docker, utilizando un esquema de **credenciales unificadas** (dos variables de entorno) que configura automáticamente todas las cuentas de administración en cada servicio. Incluye un proyecto de tooling nativo en Node.js (gestionado con `pnpm`) para monitorear y operar los contenedores de forma programática. Se implementa hardening de seguridad con health checks, resource limits y user roles.

---

## ⚙️ Requisitos Previos

| Herramienta     | Versión Mínima | Descarga                                |
|-----------------|----------------|-----------------------------------------|
| Docker          | >= 24.x        | https://docs.docker.com/get-docker/     |
| Docker Compose  | >= 2.x         | Incluido con Docker Desktop             |
| Node.js         | >= 20.x        | https://nodejs.org (o vía nvm-windows)  |
| pnpm            | >= 9.x         | https://pnpm.io/installation           |
| Git             | cualquiera     | https://git-scm.com                     |

> **¿Cómo verificar la instalación?**
> ```bash
> docker --version
> docker compose version
> node --version
> pnpm --version
> ```

---

## 📁 Estructura del Proyecto

```
docker-stack-container/
├── docker-compose.yml           # Orquestación de todos los servicios
├── .env                         # Variables de entorno (no versionado)
├── .env.example                 # Plantilla de variables de entorno
├── .gitattributes               # Fuerza LF en scripts .sh y .js
├── .dockerignore                # Evita enviar al contexto build cosas sensibles
├── .gitignore                   # Archivos excluidos del repositorio
├── stack/
│   ├── init-scripts/
│   │   ├── postgres/01-init.sh  # Crea usuario admin BD
│   │   ├── mysql/01-init.sh     # Crea usuario admin BD
│   │   ├── mongo/01-init.js     # Crea usuario admin BD
│   │   ├── ubuntu/01-init.sh    # Crea usuario admin OS con Sudo
│   │   └── kali/01-init.sh      # Crea usuario admin OS con Sudo
│   └── tooling/                 # Proyecto Node.js para gestión del stack
│       ├── package.json
│       ├── pnpm-lock.yaml
│       └── src/
│           ├── config/          # Cargador de variables de entorno (../../../../.env)
│           ├── infrastructure/  # Cliente Docker (dockerode)
│           ├── services/        # Lógica de negocio (containers, health)
│           ├── commands/        # Comandos CLI (status, health, logs, restart)
│           └── utils/           # Logger, constantes
├── backups/                     # Directorio para respaldos de bases de datos
└── README.md
```

---

## 📚 Documentación

Para mantener este documento conciso y proteger la privacidad de los datos operativos, toda la información detallada ha sido separada en nuestra carpeta [`docs/`](./docs/):

- 🧩 **[Servicios y Arquitectura](./docs/services.md):** Detalles sobre cada base de datos (PostgreSQL, MySQL, MongoDB), sistemas operativos y pgAdmin.
- 🔧 **[Comandos Útiles (Docker)](./docs/commands.md):** Guía práctica para arrancar, detener y acceder a los contenedores vía Docker CLI.
- 🛠️ **[Tooling Programático en Node.js](./docs/tooling.md):** Cómo utilizar nuestro gestor CLI propio (`pnpm run status`, `logs`, etc.).

---

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/CesarSanchez19/DockerMigracion.git
cd DockerMigracion
```

### 2. Configurar variables de entorno

Copia la plantilla y edita los valores con tus propias credenciales en la **raíz del proyecto**:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Linux / macOS
cp .env.example .env
```

### 3. Levantar los servicios

```bash
pnpm install
```
Después:
```bash
docker compose up -d
```
O:
```bash
pnpm run start
```

### 4. Verificar que todo funciona

```bash
pnpm status
```
O:
```bash
docker compose ps
```
---

## 🛡️ Seguridad

Este proyecto implementa políticas estrictas de container security:

- **Resource Limits:** Bases de datos (512M) y pgAdmin (256M) están capadas en uso de RAM. Kali (2G) y Ubuntu (1G) tienen espacio de trabajo seguro sin afectar la maquina host.
- **Auto-Discovery .env root:** `.env` cargado vía `env_file` de forma centralizada sin hardcodear información personal (ej. correos de pgAdmin) en repositorios públicos.
- **Log Rotations:** Cada contenedor tiene drivers `json-file` con logs limitados a max 3 archivos x 10MB previniendo ataques de volcado y denegación de servicio.
- **No-new-privileges:** Bloqueado `security_opt: no-new-privileges:true` para BD y SO, evitando escalado de privilegios de forma nativa.
- **Aislamiento en red:** Se mantienen bajo la red local interna de tipo `bridge`.

---

## 📄 Licencia

Este proyecto es privado y no está licenciado para distribución pública.
