import '../config/index.js';
import { listStackContainers } from '../services/container.service.js';
import { isDockerAvailable } from '../infrastructure/docker-client.js';
import { logger } from '../utils/logger.js';
import Table from 'cli-table3';

async function main() {
  logger.title('📦 Estado del Stack Docker');

  // Verificar que Docker esté accesible
  if (!(await isDockerAvailable())) {
    logger.error('No se pudo conectar con Docker.');
    logger.info('Verifica que Docker Desktop esté en ejecución.');
    process.exit(1);
  }

  try {
    const containers = await listStackContainers();

    if (containers.length === 0) {
      logger.warn('No se encontraron contenedores del stack.');
      logger.info('Ejecuta "docker compose up -d" desde stack/ para iniciar.');
      return;
    }

    const table = new Table({
      head: ['Contenedor', 'Imagen', 'Estado', 'Puertos'],
      style: { head: ['cyan'] },
      colWidths: [20, 28, 22, 16],
    });

    for (const c of containers) {
      const stateIcon = c.state === 'running' ? '🟢' : '🔴';
      table.push([
        `${stateIcon} ${c.name}`,
        c.image,
        c.status,
        c.ports,
      ]);
    }

    console.log(table.toString());

    const running = containers.filter((c) => c.state === 'running').length;
    const total = containers.length;

    logger.blank();
    if (running === total) {
      logger.success(`Todos los contenedores activos (${running}/${total}).`);
    } else {
      logger.warn(`${running}/${total} contenedores activos.`);
    }
  } catch (error) {
    logger.error(`Error al consultar Docker: ${error.message}`);
    process.exit(1);
  }
}

main();
