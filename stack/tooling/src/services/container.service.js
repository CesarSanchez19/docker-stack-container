import { getDockerClient } from '../infrastructure/docker-client.js';
import { getStackContainerNames } from '../utils/constants.js';

const docker = getDockerClient();

export async function listStackContainers() {
  const allContainers = await docker.listContainers({ all: true });
  const stackNames = getStackContainerNames();

  return allContainers
    .filter((c) =>
      c.Names.some((name) => stackNames.includes(name.replace('/', ''))),
    )
    .map((c) => ({
      name: c.Names[0].replace('/', ''),
      image: c.Image,
      state: c.State,
      status: c.Status,
      ports:
        (c.Ports || [])
          .filter((p) => p.PublicPort)
          .map((p) => `${p.PublicPort}:${p.PrivatePort}`)
          .join(', ') || '—',
    }));
}

export function getContainer(containerName) {
  return docker.getContainer(containerName);
}

export async function containerExists(containerName) {
  try {
    const container = docker.getContainer(containerName);
    await container.inspect();
    return true;
  } catch {
    return false;
  }
}

export async function restartContainer(containerName) {
  const container = docker.getContainer(containerName);
  await container.restart();
  return container.inspect();
}

export async function getContainerLogs(containerName, tail = 50) {
  const container = docker.getContainer(containerName);
  const logs = await container.logs({
    stdout: true,
    stderr: true,
    tail,
    timestamps: true,
  });
  return logs.toString('utf8');
}

export async function startContainer(containerName) {
  const container = docker.getContainer(containerName);
  await container.start();
  return container.inspect();
}

export async function stopContainer(containerName) {
  const container = docker.getContainer(containerName);
  await container.stop();
  return container.inspect();
}

export async function removeContainer(containerName) {
  const container = docker.getContainer(containerName);
  await container.remove({ force: true });
}
