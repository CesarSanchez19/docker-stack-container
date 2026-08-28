import '../config/index.js';
import { execSync } from 'node:child_process';
import { restartContainer, containerExists } from '../services/container.service.js';
import { STACK_CONTAINERS, findContainer } from '../utils/constants.js';
import { isDockerAvailable } from '../infrastructure/docker-client.js';
import { confirmAction } from '../utils/prompt.js';
import { logger } from '../utils/logger.js';

function composeUp(serviceName) {
  execSync(`docker compose up -d ${serviceName}`, {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
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

    if (!(await containerExists(def.name))) {
      logger.warn(`El contenedor ${def.displayName} (${def.name}) no existe. Creándolo con docker compose...`);
      try {
        composeUp(def.service);
        logger.success(`${def.displayName} creado e iniciado correctamente.`);
        process.exit(0);
      } catch (error) {
        logger.error(`Error al crear ${def.displayName}: ${error.message}`);
        process.exit(1);
      }
    }

    const confirmed = await confirmAction(
      `¿Deseas REINICIAR el contenedor ${def.displayName} (${def.name})?`,
    );

    if (!confirmed) {
      logger.info('Operación cancelada por el usuario.');
      process.exit(0);
    }

    logger.title(`🔄 Reiniciando ${def.displayName}`);

    try {
      await restartContainer(def.name);
      logger.success(`${def.displayName} reiniciado correctamente.`);
    } catch (error) {
      logger.error(`Error al reiniciar ${def.displayName}: ${error.message}`);
      process.exit(1);
    }
  } else {
    const confirmed = await confirmAction(
      `¿Deseas REINICIAR TODOS los contenedores del stack?`,
    );

    if (!confirmed) {
      logger.info('Operación cancelada por el usuario.');
      process.exit(0);
    }

    logger.title('🔄 Reiniciando Todo el Stack');

    let failed = 0;

    for (const def of Object.values(STACK_CONTAINERS)) {
      if (!(await containerExists(def.name))) {
        logger.warn(`${def.displayName} no existe, omitiendo.`);
        continue;
      }

      try {
        logger.info(`Reiniciando ${def.displayName}...`);
        await restartContainer(def.name);
        logger.success(`${def.displayName} reiniciado.`);
      } catch (error) {
        logger.error(`Error al reiniciar ${def.displayName}: ${error.message}`);
        failed++;
      }
    }

    logger.blank();
    if (failed === 0) {
      logger.success('Stack reiniciado completamente.');
    } else {
      logger.warn(`Stack reiniciado con ${failed} error(es). Revisa los logs.`);
    }
  }
}

main();
