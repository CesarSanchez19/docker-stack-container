import { stackConfig } from '../config/index.js';

export const STACK_CONTAINERS = {
  postgres: {
    name: 'postgres_db',
    displayName: 'PostgreSQL',
    port: stackConfig.postgresPort,
    healthCmd: ['pg_isready', '-U', 'postgres'],
  },
  mysql: {
    name: 'mysql_db',
    displayName: 'MySQL',
    port: stackConfig.mysqlPort,
    healthCmd: ['mysqladmin', 'ping', '-u', 'root', '--silent'],
  },
  mongo: {
    name: 'mongo_db',
    displayName: 'MongoDB',
    port: stackConfig.mongoPort,
    healthCmd: ['mongosh', '--quiet', '--eval', 'db.runCommand({ping:1})'],
  },
  pgadmin: {
    name: 'pgadmin_ui',
    displayName: 'pgAdmin',
    port: stackConfig.pgadminPort,
    healthCmd: null,
  },
  ubuntu: {
    name: 'ubuntu_dev',
    displayName: 'Ubuntu LTS',
    port: null,
    healthCmd: ['id'],
  },
  kali: {
    name: 'kali_dev',
    displayName: 'Kali Linux',
    port: null,
    healthCmd: ['id'],
  },
};

export function getStackContainerNames() {
  return Object.values(STACK_CONTAINERS).map((c) => c.name);
}


export function findContainer(identifier) {
  return Object.values(STACK_CONTAINERS).find(
    (c) =>
      c.name === identifier ||
      c.displayName.toLowerCase() === identifier.toLowerCase(),
  );
}
