import { stackConfig } from '../config/index.js';

export const STACK_CONTAINERS = {
  postgres: {
    name: 'postgres_db',
    displayName: 'PostgreSQL',
    service: 'postgres',
    port: stackConfig.postgresPort,
    healthCmd: ['pg_isready', '-U', 'postgres'],
  },
  mysql: {
    name: 'mysql_db',
    displayName: 'MySQL',
    service: 'mysql',
    port: stackConfig.mysqlPort,
    healthCmd: ['mysqladmin', 'ping', '-u', 'root', '--silent'],
  },
  mongo: {
    name: 'mongo_db',
    displayName: 'MongoDB',
    service: 'mongo',
    port: stackConfig.mongoPort,
    healthCmd: ['mongosh', '--quiet', '--eval', 'db.runCommand({ping:1})'],
  },
  pgadmin: {
    name: 'pgadmin_ui',
    displayName: 'pgAdmin',
    service: 'pgadmin',
    port: stackConfig.pgadminPort,
    healthCmd: null,
  },
  ubuntu: {
    name: 'ubuntu_dev',
    displayName: 'Ubuntu LTS',
    service: 'ubuntu',
    port: null,
    healthCmd: ['id'],
  },
  kali: {
    name: 'kali_dev',
    displayName: 'Kali Linux',
    service: 'kali',
    port: null,
    healthCmd: ['id'],
  },
  php: {
    name: 'php_dev',
    displayName: 'PHP 8.3',
    service: 'php',
    port: null,
    healthCmd: ['php', '-v'],
  },
  java: {
    name: 'java_dev',
    displayName: 'Java 21 (JDK)',
    service: 'java',
    port: null,
    healthCmd: ['java', '-version'],
  },
  python: {
    name: 'python_dev',
    displayName: 'Python 3.12',
    service: 'python',
    port: null,
    healthCmd: ['python3', '--version'],
  },
  elixir: {
    name: 'elixir_dev',
    displayName: 'Elixir 1.17',
    service: 'elixir',
    port: null,
    healthCmd: ['elixir', '--version'],
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
