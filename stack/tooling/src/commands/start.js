import '../config/index.js';
import { startContainer } from '../services/container.service.js';
import { STACK_CONTAINERS, findContainer } from '../utils/constants.js';
import { isDockerAvailable } from '../infrastructure/docker-client.js';
import { isContainerRunning } from '../utils/prompt.js';
import { logger } from '../utils/logger.js';

async function main() {
  const targetName = process.argv[2];

  if (!(await isDockerAvailable())) {
    logger.error('No se pudo conectar con Docker.');
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

    if (await isContainerRunning(def.name)) {
      logger.info(`El contenedor ${def.displayName} ya se encuentra encendido.`);
      process.exit(0);
    }

    logger.title(`🚀 Iniciando ${def.displayName}`);

    try {
      await startContainer(def.name);
      logger.success(`${def.displayName} iniciado correctamente.`);
    } catch (error) {
      logger.error(`Error al iniciar ${def.displayName}: ${error.message}`);
      process.exit(1);
    }
  } else {
    logger.title('🚀 Iniciando Todo el Stack');

    let failed = 0;
    let startedCount = 0;
    let skippedCount = 0;

    for (const def of Object.values(STACK_CONTAINERS)) {
      if (await isContainerRunning(def.name)) {
        skippedCount++;
        continue;
      }

      try {
        logger.info(`Iniciando ${def.displayName}...`);
        await startContainer(def.name);
        logger.success(`${def.displayName} iniciado.`);
        startedCount++;
      } catch (error) {
        logger.error(
          `Error al iniciar ${def.displayName}: ${error.message}`,
        );
        failed++;
      }
    }

    logger.blank();
    if (startedCount === 0 && failed === 0) {
      logger.info('Todos los contenedores ya se encuentran encendidos. No hay acciones a realizar.');
    } else if (failed === 0) {
      logger.success(`Stack iniciado correctamente (${startedCount} nuevos, ${skippedCount} ya estaban encendidos).`);
    } else {
      logger.warn(
        `Proceso finalizado con ${failed} error(es). Revisa los logs. Nota: Si el contenedor nunca fue creado, usa 'docker compose up -d'.`,
      );
    }
  }
}

main();
