import '../config/index.js';
import { getContainerLogs } from '../services/container.service.js';
import { STACK_CONTAINERS, findContainer } from '../utils/constants.js';
import { isDockerAvailable } from '../infrastructure/docker-client.js';
import { logger } from '../utils/logger.js';
import chalk from 'chalk';

async function main() {
  const targetName = process.argv[2];
  const tail = parseInt(process.argv[3], 10) || 30;

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

    logger.title(`📋 Logs de ${def.displayName} (últimas ${tail} líneas)`);

    try {
      const logs = await getContainerLogs(def.name, tail);
      console.log(logs || '  (sin logs)');
    } catch (error) {
      logger.error(`No se pudieron obtener los logs: ${error.message}`);
      process.exit(1);
    }
  } else {
    logger.title('📋 Logs Recientes del Stack');

    for (const def of Object.values(STACK_CONTAINERS)) {
      console.log(
        chalk.bold.yellow(`\n── ${def.displayName} (${def.name}) ──`),
      );

      try {
        const logs = await getContainerLogs(def.name, 10);
        console.log(logs || '  (sin logs)');
      } catch {
        logger.warn(`  No se pudieron obtener logs de ${def.name}`);
      }
    }
  }
}

main();
