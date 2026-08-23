import { spawn } from 'node:child_process';
import chalk from 'chalk';
import { stackConfig } from '../config/index.js';
import { findContainer } from '../utils/constants.js';
import { isContainerRunning } from '../utils/prompt.js';

const targetContainer = process.argv[2];

if (!targetContainer) {
  console.error(chalk.red('✖ Error: Debes especificar el contenedor al que deseas ingresar.'));
  console.error(chalk.dim('  Ejemplo: pnpm run enter:postgres'));
  console.error(chalk.dim('  Disponibles: postgres_db, mysql_db, mongo_db, ubuntu_dev, kali_dev'));
  process.exit(1);
}

const container = findContainer(targetContainer);
if (!container) {
  console.error(chalk.red(`✖ Error: Contenedor '${targetContainer}' no encontrado en la configuración.`));
  process.exit(1);
}

if (!stackConfig.adminUser) {
  console.error(chalk.red(`\n[ERROR] ✖ Falta configuración en el .env:\nDebe existir la variable 'ADMIN_USER' para poder iniciar sesión.\n`));
  process.exit(1);
}

const running = await isContainerRunning(container.name);
if (!running) {
  console.error(chalk.red(`\n✖ Error: El contenedor '${container.displayName}' (${container.name}) no está encendido.`));
  console.error(chalk.yellow(`  Inicia el contenedor primero con: pnpm run start ${container.name}`));
  process.exit(1);
}

console.log(chalk.blue(`🚀 Iniciando sesión en ${container.displayName}...`));

let command = 'docker';
let args = ['exec', '-it', container.name];
let env = { ...process.env };

switch (container.name) {
  case 'postgres_db':
    args.push('psql', '-U', stackConfig.adminUser);
    if (stackConfig.adminPassword) {
      env.PGPASSWORD = stackConfig.adminPassword;
    }
    break;

  case 'mysql_db':
    args.push('mysql', '-u', stackConfig.adminUser);
    if (stackConfig.adminPassword) {
      args.push(`-p${stackConfig.adminPassword}`);
    } else {
      args.push('-p');
    }
    break;

  case 'mongo_db':
    args.push('mongosh', '-u', stackConfig.adminUser);
    if (stackConfig.adminPassword) {
      args.push('-p', stackConfig.adminPassword);
    } else {
      args.push('-p');
    }
    args.push('--authenticationDatabase', 'admin');
    break;

  case 'ubuntu_dev':
  case 'kali_dev':
    args.push('su', '-', stackConfig.adminUser);
    break;

  default:
    console.error(chalk.red(`✖ Error: Entrada interactiva no soportada para ${container.name}`));
    process.exit(1);
}

const child = spawn(command, args, {
  stdio: 'inherit',
  env,
});

child.on('error', (err) => {
  console.error(chalk.red(`✖ Error al intentar ejecutar el comando de Docker: ${err.message}`));
});

child.on('exit', (code) => {
  if (code !== 0) {
    console.log(chalk.yellow(`\n⚠ La sesión finalizó con código ${code}.`));
  }
});
