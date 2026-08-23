const adminUser = process.env.ADMIN_USER;
const adminPassword = process.env.ADMIN_PASSWORD;

db = db.getSiblingDB('admin');

db.createUser({
  user: adminUser,
  pwd: adminPassword,
  roles: [
    { role: 'root', db: 'admin' }
  ]
});

print(`✔ MongoDB: usuario '${adminUser}' creado con rol root.`);

db = db.getSiblingDB('desarrollo');
db.createCollection('inicial');

print("✔ MongoDB: base de datos 'desarrollo' creada con colección 'inicial'.");