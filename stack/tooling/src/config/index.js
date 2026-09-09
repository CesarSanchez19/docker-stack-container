import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", "..", "..", "..", ".env");

if (!existsSync(envPath)) {
  console.error(`✖ No se encontró el archivo .env en: ${envPath}`);
  console.error(
    "  Copia .env.example a .env en la raíz del proyecto y configura tus credenciales.",
  );
  process.exit(1);
}

config({ path: envPath });

const required = ["ADMIN_USER", "ADMIN_PASSWORD"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`✖ Variables de entorno faltantes: ${missing.join(", ")}`);
  console.error("  Revisa el archivo stack/.env");
  process.exit(1);
}

export const stackConfig = Object.freeze({
  adminUser: process.env.ADMIN_USER,
  adminPassword: process.env.ADMIN_PASSWORD,
  postgresDb: process.env.POSTGRES_DB || "postgres",
  postgresPort: parseInt(process.env.POSTGRES_PORT || "5444", 10),
  mysqlPort: parseInt(process.env.MYSQL_PORT || "3318", 10),
  mongoPort: parseInt(process.env.MONGO_PORT || "27029", 10),
  pgadminPort: parseInt(process.env.PGADMIN_PORT || "8093", 10),
  redisPort: parseInt(process.env.REDIS_PORT || "6391", 10),
});
