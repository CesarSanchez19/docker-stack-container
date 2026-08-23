import { createInterface } from 'node:readline';
import chalk from 'chalk';
import { getDockerClient } from '../infrastructure/docker-client.js';

export async function confirmAction(message) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      chalk.yellow(`\n⚠ ${message}\n`) +
        chalk.dim('  Escribe "yes" para confirmar o "no" para cancelar: '),
      (answer) => {
        rl.close();
        resolve(answer.trim().toLowerCase() === 'yes');
      },
    );
  });
}

export async function isContainerRunning(containerName) {
  try {
    const docker = getDockerClient();
    const container = docker.getContainer(containerName);
    const info = await container.inspect();
    return info.State.Running === true;
  } catch {
    return false;
  }
}
