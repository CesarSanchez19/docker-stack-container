import { getDockerClient } from '../infrastructure/docker-client.js';
import { STACK_CONTAINERS } from '../utils/constants.js';

const docker = getDockerClient();

export async function checkContainerHealth(containerDef) {
  try {
    const container = docker.getContainer(containerDef.name);
    const info = await container.inspect();

    if (!info.State.Running) {
      return {
        name: containerDef.displayName,
        status: 'stopped',
        healthy: false,
        nativeStatus: 'none',
        log: 'El contenedor está apagado.',
      };
    }

    const health = info.State.Health;
    if (health) {
      const lastLog = health.Log && health.Log.length > 0 
        ? health.Log[health.Log.length - 1].Output 
        : '';
        
      return {
        name: containerDef.displayName,
        status: 'running',
        healthy: health.Status === 'healthy',
        nativeStatus: health.Status, 
        log: cleanDockerOutput(lastLog) || '(Sin detalles registrados en Docker)',
      };
    } else if (containerDef.healthCmd) {
      const exec = await container.exec({
        Cmd: containerDef.healthCmd,
        AttachStdout: true,
        AttachStderr: true,
      });

      const stream = await exec.start();
      const output = await streamToString(stream);
      const execInfo = await exec.inspect();

      return {
        name: containerDef.displayName,
        status: 'running',
        healthy: execInfo.ExitCode === 0,
        nativeStatus: 'custom',
        log: cleanDockerOutput(output),
      };
    } else {
      return {
        name: containerDef.displayName,
        status: 'running',
        healthy: true,
        nativeStatus: 'none',
        log: 'Sin configuración de healthcheck.',
      };
    }
  } catch (error) {
    return {
      name: containerDef.displayName,
      status: 'not found',
      healthy: false,
      nativeStatus: 'error',
      error: error.message,
    };
  }
}

export async function checkAllHealth() {
  const results = [];

  for (const def of Object.values(STACK_CONTAINERS)) {
    results.push(await checkContainerHealth(def));
  }

  return results;
}

function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    stream.on('error', reject);
  });
}

function cleanDockerOutput(raw) {
  return raw
    .replace(/[\x00-\x08\x0e-\x1f]/g, '')
    .trim()
    .slice(0, 500);
}
