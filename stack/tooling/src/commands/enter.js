import { spawn, execSync } from "node:child_process";
import chalk from "chalk";
import { stackConfig } from "../config/index.js";
import { findContainer, STACK_CONTAINERS } from "../utils/constants.js";
import { isContainerRunning } from "../utils/prompt.js";
import { containerExists } from "../services/container.service.js";
import { isDockerAvailable } from "../infrastructure/docker-client.js";
import { logger } from "../utils/logger.js";

const targetContainer = process.argv[2];

if (!targetContainer) {
  logger.error("Debes especificar el contenedor al que deseas ingresar.");
  logger.info("Ejemplo: pnpm run enter:postgres");
  logger.info(
    `Disponibles: ${Object.values(STACK_CONTAINERS)
      .map((c) => c.name)
      .join(", ")}`,
  );
  process.exit(1);
}

if (!(await isDockerAvailable())) {
  logger.error("No se pudo conectar con Docker.");
  logger.info("Verifica que Docker Desktop esté en ejecución.");
  process.exit(1);
}

const container = findContainer(targetContainer);
if (!container) {
  logger.error(
    `Contenedor '${targetContainer}' no encontrado en la configuración.`,
  );
  logger.info(
    `Disponibles: ${Object.values(STACK_CONTAINERS)
      .map((c) => c.name)
      .join(", ")}`,
  );
  process.exit(1);
}

if (!stackConfig.adminUser) {
  logger.error("Falta la variable ADMIN_USER en el archivo .env.");
  logger.info(
    "Define ADMIN_USER en tu archivo .env para poder iniciar sesión.",
  );
  process.exit(1);
}

if (!(await containerExists(container.name))) {
  logger.warn(
    `El contenedor ${container.displayName} (${container.name}) no existe. Creándolo con docker compose...`,
  );
  try {
    execSync(`docker compose up -d ${container.service}`, {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    logger.success(`${container.displayName} creado e iniciado.`);
  } catch (error) {
    logger.error(`Error al crear ${container.displayName}: ${error.message}`);
    process.exit(1);
  }
}

const running = await isContainerRunning(container.name);
if (!running) {
  const key = Object.keys(STACK_CONTAINERS).find(
    (k) => STACK_CONTAINERS[k].name === container.name,
  );
  logger.error(
    `El contenedor ${container.displayName} (${container.name}) no está encendido.`,
  );
  logger.info(
    `Inicia el contenedor primero con: pnpm run start:${key || container.name}`,
  );
  process.exit(1);
}

console.log(chalk.blue(`🚀 Iniciando sesión en ${container.displayName}...`));

let command = "docker";
let args = ["exec", "-it", container.name];
let env = { ...process.env };

switch (container.name) {
  case "postgres_db":
    args.push("psql", "-U", stackConfig.adminUser, "-d", "postgres");
    if (stackConfig.adminPassword) {
      env.PGPASSWORD = stackConfig.adminPassword;
    }
    break;

  case "mysql_db":
    args.push("mysql", "-u", stackConfig.adminUser);
    if (stackConfig.adminPassword) {
      env.MYSQL_PWD = stackConfig.adminPassword;
    } else {
      args.push("-p");
    }
    break;

  case "mongo_db":
    args.push("mongosh", "-u", stackConfig.adminUser);
    if (stackConfig.adminPassword) {
      args.push("-p", stackConfig.adminPassword);
    } else {
      args.push("-p");
    }
    args.push("--authenticationDatabase", "admin");
    break;

  case "redis_db":
    args.push(
      "redis-cli",
      "--user",
      stackConfig.adminUser,
      "-a",
      stackConfig.adminPassword,
      "--no-auth-warning",
    );
    break;

  case "ubuntu_dev":
  case "kali_dev":
  case "php_dev":
  case "java_dev":
  case "python_dev":
  case "elixir_dev":
    args.push("su", "-", stackConfig.adminUser);
    break;

  default:
    logger.error(
      `Entrada interactiva no soportada para ${container.displayName} (${container.name}).`,
    );
    process.exit(1);
}

const child = spawn(command, args, {
  stdio: "inherit",
  env,
});

child.on("error", (err) => {
  logger.error(`Error al ejecutar el comando de Docker: ${err.message}`);
});

child.on("exit", (code) => {
  if (code !== 0) {
    logger.warn(`La sesión finalizó con código ${code}.`);
  }
});
