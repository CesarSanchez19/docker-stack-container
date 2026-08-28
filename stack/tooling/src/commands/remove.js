import '../config/index.js';
import { removeContainer, containerExists } from '../services/container.service.js';
import { STACK_CONTAINERS, findContainer } from '../utils/constants.js';
import { isDockerAvailable } from '../infrastructure/docker-client.js';
import { confirmAction } from '../utils/prompt.js';
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
      logger.error(`El contenedor ${def.displayName} (${def.name}) no existe. No hay nada que eliminar.`);
      process.exit(1);
    }

    const confirmed = await confirmAction(
      `¿Estás seguro de que deseas ELIMINAR el contenedor ${def.displayName} (${def.name})?\n  Toda la información almacenada en este contenedor se perderá permanentemente.`,
    );

    if (!confirmed) {
      logger.info('Operación cancelada por el usuario.');
      process.exit(0);
    }

    logger.title(`🗑️ Borrando ${def.displayName}`);

    try {
      await removeContainer(def.name);
      logger.success(`${def.displayName} borrado correctamente.`);
    } catch (error) {
      logger.error(`Error al borrar ${def.displayName}: ${error.message}`);
      process.exit(1);
    }
  } else {
    const confirmed = await confirmAction(
      `¿Estás seguro de que deseas ELIMINAR TODOS los contenedores del stack?\n  Toda la información almacenada en cada contenedor se perderá permanentemente.`,
    );

    if (!confirmed) {
      logger.info('Operación cancelada por el usuario.');
      process.exit(0);
    }

    logger.title('🗑️ Borrando Todo el Stack');

    let failed = 0;
    let removed = 0;

    for (const def of Object.values(STACK_CONTAINERS)) {
      if (!(await containerExists(def.name))) {
        logger.info(`${def.displayName} no existe, omitiendo.`);
        continue;
      }

      try {
        logger.info(`Borrando ${def.displayName}...`);
        await removeContainer(def.name);
        logger.success(`${def.displayName} borrado.`);
        removed++;
      } catch (error) {
        logger.error(`Error al borrar ${def.displayName}: ${error.message}`);
        failed++;
      }
    }

    logger.blank();
    if (failed === 0) {
      logger.success(`Stack borrado completamente (${removed} contenedores eliminados).`);
    } else {
      logger.warn(`Stack borrado con ${failed} error(es). Revisa los logs.`);
    }
  }
}

main();
