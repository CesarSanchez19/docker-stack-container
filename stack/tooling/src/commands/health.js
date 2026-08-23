import '../config/index.js';
import { checkAllHealth, checkContainerHealth } from '../services/health.service.js';
import { isDockerAvailable } from '../infrastructure/docker-client.js';
import { STACK_CONTAINERS, findContainer } from '../utils/constants.js';
import { logger } from '../utils/logger.js';
import Table from 'cli-table3';
import chalk from 'chalk';

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
      logger.info(`Disponibles: ${Object.values(STACK_CONTAINERS).map((c) => c.name).join(', ')}`);
      process.exit(1);
    }

    logger.title(`🏥 Diagnóstico de Salud: ${def.displayName}`);

    try {
      const result = await checkContainerHealth(def);

      console.log(chalk.bold('Estado General:    ') + (result.status === 'running' ? chalk.green('RUNNING') : chalk.red(result.status.toUpperCase())));
      
      let healthColor = chalk.gray;
      if (result.nativeStatus === 'healthy') healthColor = chalk.green;
      else if (result.nativeStatus === 'unhealthy') healthColor = chalk.red;
      else if (result.nativeStatus === 'starting') healthColor = chalk.yellow;
      
      console.log(chalk.bold('Salud Nativa:      ') + healthColor(result.nativeStatus.toUpperCase()));
      
      console.log(chalk.bold('\nÚltimo reporte (Salida del comando):'));
      console.log(chalk.dim('─'.repeat(50)));
      if (result.error) {
        console.log(chalk.red(result.error));
      } else if (result.log) {
        console.log(result.log);
      } else {
        console.log(chalk.gray('(Sin información adicional)'));
      }
      console.log(chalk.dim('─'.repeat(50)));

      if (!result.healthy && result.status === 'running') {
        logger.warn('El contenedor está encendido pero el healthcheck está fallando. Revisa los logs anteriores.');
        process.exit(1);
      } else if (!result.healthy) {
        process.exit(1);
      }
    } catch (error) {
      logger.error(`Error durante el health check: ${error.message}`);
      process.exit(1);
    }
  } else {
    logger.title('🏥 Health Check del Stack');

    try {
      const results = await checkAllHealth();

      const table = new Table({
        head: ['Servicio', 'Estado', 'Salud', 'Status Nativo', 'Detalle'],
        style: { head: ['cyan'] },
        colWidths: [16, 12, 8, 16, 40],
      });

      for (const r of results) {
        const healthIcon = r.healthy ? '✅' : '❌';
        table.push([
          r.name,
          r.status,
          healthIcon,
          r.nativeStatus,
          (r.log || r.error || '—').replace(/\n/g, ' ').substring(0, 35) + '...',
        ]);
      }

      console.log(table.toString());

      const healthy = results.filter((r) => r.healthy).length;
      const total = results.length;

      logger.blank();
      if (healthy === total) {
        logger.success(`Todos los servicios saludables (${healthy}/${total}).`);
      } else {
        logger.warn(`${healthy}/${total} servicios saludables.`);
      }
    } catch (error) {
      logger.error(`Error durante el health check genérico: ${error.message}`);
      process.exit(1);
    }
  }
}

main();
