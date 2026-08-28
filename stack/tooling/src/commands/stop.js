import '../config/index.js';
import { stopContainer, containerExists } from '../services/container.service.js';
import { STACK_CONTAINERS, findContainer } from '../utils/constants.js';
import { isDockerAvailable } from '../infrastructure/docker-client.js';
import { isContainerRunning, confirmAction } from '../utils/prompt.js';
import { logger } from '../utils/logger.js';

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

    if (!(await containerExists(def.name))) {
      logger.error(`El contenedor ${def.displayName} (${def.name}) no existe.`);
      logger.info(`Créalo primero con: pnpm run start:${Object.keys(STACK_CONTAINERS).find((k) => STACK_CONTAINERS[k].name === def.name) || def.name}`);
      process.exit(1);
    }

    if (!(await isContainerRunning(def.name))) {
      logger.info(`El contenedor ${def.displayName} ya se encuentra detenido.`);
      process.exit(0);
    }

    const confirmed = await confirmAction(
      `¿Deseas DETENER el contenedor ${def.displayName} (${def.name})?`,
    );

    if (!confirmed) {
      logger.info('Operación cancelada por el usuario.');
      process.exit(0);
    }

    logger.title(`🛑 Deteniendo ${def.displayName}`);

    try {
      await stopContainer(def.name);
      logger.success(`${def.displayName} detenido correctamente.`);
    } catch (error) {
      logger.error(`Error al detener ${def.displayName}: ${error.message}`);
      process.exit(1);
    }
  } else {
    const confirmed = await confirmAction(
      `¿Deseas DETENER TODOS los contenedores del stack?`,
    );

    if (!confirmed) {
      logger.info('Operación cancelada por el usuario.');
      process.exit(0);
    }

    logger.title('🛑 Deteniendo Todo el Stack');

    let failed = 0;
    let stopped = 0;

    for (const def of Object.values(STACK_CONTAINERS)) {
      if (!(await containerExists(def.name))) continue;
      if (!(await isContainerRunning(def.name))) continue;

      try {
        logger.info(`Deteniendo ${def.displayName}...`);
        await stopContainer(def.name);
        logger.success(`${def.displayName} detenido.`);
        stopped++;
      } catch (error) {
        logger.error(`Error al detener ${def.displayName}: ${error.message}`);
        failed++;
      }
    }

    logger.blank();
    if (failed === 0) {
      logger.success(`Stack detenido completamente (${stopped} contenedores).`);
    } else {
      logger.warn(`Stack detenido con ${failed} error(es). Revisa los logs.`);
    }
  }
}

main();
