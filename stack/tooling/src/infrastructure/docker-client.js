import Docker from 'dockerode';
import { platform } from 'node:os';

let instance = null;

export function getDockerClient() {
  if (!instance) {
    const options =
      platform() === 'win32'
        ? { socketPath: '//./pipe/docker_engine' }
        : { socketPath: '/var/run/docker.sock' };

    instance = new Docker(options);
  }

  return instance;
}


export async function isDockerAvailable() {
  try {
    const docker = getDockerClient();
    await docker.ping();
    return true;
  } catch {
    return false;
  }
}
