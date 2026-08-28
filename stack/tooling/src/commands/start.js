import '../config/index.js';
import { execSync } from 'node:child_process';
import { startContainer, containerExists } from '../services/container.service.js';
import { STACK_CONTAINERS, findContainer } from '../utils/constants.js';
import { isDockerAvailable } from '../infrastructure/docker-client.js';
import { isContainerRunning } from '../utils/prompt.js';
import { logger } from '../utils/logger.js';

function composeUp(serviceName) {
  execSync(`docker compose up -d ${serviceName}`, {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
}

async function startSingle(def) {
  if (await isContainerRunning(def.name)) {
    logger.info(`El contenedor ${def.displayName} ya se encuentra encendido.`);
    return 'skipped';
  }

  if (!(await containerExists(def.name))) {
    logger.info(`El contenedor ${def.displayName} no existe. Creándolo con docker compose...`);
    try {
      composeUp(def.service);
      logger.success(`${def.displayName} creado e iniciado correctamente.`);
      return 'started';
    } catch (error) {
      logger.error(`Error al crear ${def.displayName}: ${error.message}`);
      return 'failed';
    }
  }

  try {
    await startContainer(def.name);
    logger.success(`${def.displayName} iniciado correctamente.`);
    return 'started';
  } catch (error) {
    logger.error(`Error al iniciar ${def.displayName}: ${error.message}`);
    return 'failed';
  }
}

async function main() {
  const targetName = process.argv[2];

  if (!(await isDockerAvailable())) {
    logger.error('No se pudo conectar con Docker.');
    logger.info('Verifica que Docker Desktop esté en ejecución.');
    process.exit(1);
  }

  if (targetName) {
    const def = findContainer(targetName);

    if (!def) {
      logger.error(`Contenedor "${targetName}" no encontrado en el stack.`);
      logger.info(
        `Disponibles: ${Object.values(STACK_CONTAINERS).map((c) => c.name).join(', ')}`,
      );
      process.exit(1);
    }

    logger.title(`🚀 Iniciando ${def.displayName}`);

    const result = await startSingle(def);
    if (result === 'failed') {
      process.exit(1);
    }
  } else {
    logger.title('🚀 Iniciando Todo el Stack');

    let failed = 0;
    let startedCount = 0;
    let skippedCount = 0;

    for (const def of Object.values(STACK_CONTAINERS)) {
      const result = await startSingle(def);
      if (result === 'started') startedCount++;
      else if (result === 'skipped') skippedCount++;
      else failed++;
    }

    logger.blank();
    if (startedCount === 0 && failed === 0) {
      logger.success('Todos los contenedores ya se encuentran encendidos.');
    } else if (failed === 0) {
      logger.success(`Stack iniciado correctamente (${startedCount} iniciados, ${skippedCount} ya estaban encendidos).`);
    } else {
      logger.warn(`Proceso finalizado con ${failed} error(es). Revisa los logs.`);
    }
  }
}

main();
