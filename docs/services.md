# 🧩 Servicios y Arquitectura (Referencia)

Este documento detalla los servicios y contenedores que componen el entorno de desarrollo local. Está estructurado como una referencia rápida para consultar qué imágenes se utilizan y cuál es el propósito de cada una dentro de la arquitectura del proyecto.

> [!NOTE]
> Todos los puertos indicados como `<tu_puerto_*>` son dinámicos. Esto significa que no están fijos (hardcodeados) en el código, sino que toman su valor del archivo secreto `.env` que configuras localmente. Esto previene colisiones con puertos ya en uso y fortalece la seguridad.

---

## 🗄️ Bases de Datos

El stack provee contenedores robustos para los tres motores de bases de datos más populares. Cada uno arranca con un script de inicialización automático (`/stack/init-scripts/`) que crea la base de datos principal y asegura que las credenciales de administración se configuren de forma centralizada.

| Servicio       | Imagen Oficial | Puerto (Host)          | Propósito Principal                                                                          |
| -------------- | -------------- | ---------------------- | -------------------------------------------------------------------------------------------- |
| **PostgreSQL** | `postgres:18`  | `<tu_puerto_postgres>` | Base de datos relacional orientada a objetos (SQL). Útil para datos estructurados complejos. |
| **MySQL**      | `mysql:8`      | `<tu_puerto_mysql>`    | Base de datos relacional de propósito general (SQL).                                         |
| **MongoDB**    | `mongo:8`      | `<tu_puerto_mongo>`    | Base de datos NoSQL orientada a documentos. Ideal para datos no estructurados o JSON.        |

---

## 💻 Sistemas Operativos de Pruebas

Para realizar pruebas de scripts, compilaciones o auditorías de seguridad en entornos aislados y limpios (sin ensuciar la máquina host), el stack incluye contenedores basados en distribuciones de Linux completas.

Estos contenedores se mantienen encendidos de fondo en modo interactivo (`tty: true`, `stdin_open: true`).

| Servicio       | Imagen Oficial           | Interactivo | Propósito Principal                                                                                                   |
| -------------- | ------------------------ | ----------- | --------------------------------------------------------------------------------------------------------------------- |
| **Ubuntu LTS** | `ubuntu:24.04`           | Sí          | Sistema base estándar y seguro. Se utiliza típicamente para probar la instalación de paquetes o scripts generalistas. |
| **Kali Linux** | `kalilinux/kali-rolling` | Sí          | Sistema orientado a seguridad y pentesting. Inicializa vacío, permitiendo aislar herramientas.                        |

---

## 🎛️ Interfaces de Administración Visual

Además del manejo por línea de comandos (CLI), se provee un gestor web gráfico para simplificar la interacción con la base de datos PostgreSQL.

| Servicio    | Imagen Oficial          | Puerto (Host)         | Propósito Principal                                                                               |
| ----------- | ----------------------- | --------------------- | ------------------------------------------------------------------------------------------------- |
| **pgAdmin** | `dpage/pgadmin4:latest` | `<tu_puerto_pgadmin>` | Interfaz gráfica vía web para administrar visualmente esquemas, usuarios y queries de PostgreSQL. |

> [!TIP]
> Para iniciar sesión en pgAdmin, deberás utilizar el correo electrónico (`<tu_correo_admin>`) y la contraseña (`<tu_contraseña_admin>`) definidos de forma segura en tu archivo local `.env`.

---

## 🔧 Lenguajes de Programación (Compiladores Locales)

Entornos completos instalados listos para compilar proyectos personales montados desde el host.

| Servicio          | Imagen Oficial       | Interactivo | Propósito Principal                                                            |
| ----------------- | -------------------- | ----------- | ------------------------------------------------------------------------------ |
| **PHP 8.3**       | `php:8.3-cli`        | Sí          | Entorno PHP con Composer, pdo_pgsql, pdo_mysql, mongodb y extensiones comunes. |
| **Java 21 (JDK)** | `eclipse-temurin:21` | Sí          | JDK 21 LTS con Maven y Gradle instalados.                                      |
| **Python 3.12**   | `python:3.12-slim`   | Sí          | Entorno Python con pip, poetry, pipenv, pytest y conectores a BD.              |
| **Elixir 1.17**   | `elixir:1.17`        | Sí          | Entorno con Mix, Hex, Rebar3 e inotify-tools para LiveReload.                  |

> [!TIP]
> Estos contenedores montan el directorio definido en `HOST_WORKSPACE` (por defecto `C:\Users`) en la ruta `/workspace`. Puedes acceder a cualquier proyecto de tu computadora navegando desde allí.