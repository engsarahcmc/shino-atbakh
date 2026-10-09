const { Pool } = require("pg");
require("dotenv").config();

// أونلاين (Neon / Render): نستخدم DATABASE_URL ويا SSL
// على الجهاز: نستخدم DB_USER و DB_HOST ... مثل قبل
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

module.exports = pool;
