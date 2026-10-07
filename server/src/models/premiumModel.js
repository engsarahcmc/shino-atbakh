const pool = require("../config/db");
const { PLANS } = require("../config/premium");

// يفعّل الاشتراك: يسجل العملية ويمدد تاريخ الانتهاء
const activate = async (userId, plan, method) => {
  const { price, days } = PLANS[plan];
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // إذا عنده اشتراك شغال، نضيف المدة على نهايته
    const current = await client.query(
      "SELECT premium_until FROM users WHERE id = $1 FOR UPDATE",
      [userId]
    );
    const until = current.rows[0]?.premium_until;
    const start = until && new Date(until) > new Date() ? new Date(until) : new Date();
    const expires = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);

    const sub = await client.query(
      `INSERT INTO subscriptions (user_id, plan, method, amount, expires_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, plan, method, amount, status, started_at, expires_at`,
      [userId, plan, method, price, expires]
    );

    await client.query(
      "UPDATE users SET premium_plan = $1, premium_until = $2 WHERE id = $3",
      [plan, expires, userId]
    );

    await client.query("COMMIT");
    return sub.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// إلغاء الاشتراك (بالنسخة التجريبية ينتهي فوراً)
const cancel = async (userId) => {
  await pool.query(
    "UPDATE subscriptions SET status = 'cancelled' WHERE user_id = $1 AND status = 'active'",
    [userId]
  );
  await pool.query(
    "UPDATE users SET premium_plan = NULL, premium_until = NULL WHERE id = $1",
    [userId]
  );
};

const history = async (userId) => {
  const result = await pool.query(
    `SELECT id, plan, method, amount, status, started_at, expires_at
     FROM subscriptions WHERE user_id = $1
     ORDER BY started_at DESC LIMIT 10`,
    [userId]
  );
  return result.rows;
};

// ---------- حد استخدام مرام ----------
const getUsage = async (key) => {
  const result = await pool.query(
    "SELECT count FROM ai_usage WHERE usage_key = $1 AND day = CURRENT_DATE",
    [key]
  );
  return Number(result.rows[0]?.count || 0);
};

const addUsage = async (key) => {
  const result = await pool.query(
    `INSERT INTO ai_usage (usage_key, day, count) VALUES ($1, CURRENT_DATE, 1)
     ON CONFLICT (usage_key, day) DO UPDATE SET count = ai_usage.count + 1
     RETURNING count`,
    [key]
  );
  return Number(result.rows[0].count);
};

module.exports = { activate, cancel, history, getUsage, addUsage };
