const pool = require("../config/db");

const countRows = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return Number(result.rows[0].count);
};

// أرقام لوحة التحكم
const getStats = async (adminRoleId) => {
  const [users, admins, newThisWeek, inactive, recipes, favorites] = await Promise.all([
    countRows("SELECT COUNT(*) FROM users"),
    countRows("SELECT COUNT(*) FROM users WHERE role_id = $1", [adminRoleId]),
    countRows("SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '7 days'"),
    countRows("SELECT COUNT(*) FROM users WHERE is_active = false"),
    countRows("SELECT COUNT(*) FROM recipes"),
    countRows("SELECT COUNT(*) FROM favorites"),
  ]);

  // أرقام الاشتراك (تشتغل حتى لو الجداول بعدها ما انخلقت)
  const safe = (promise) => promise.catch(() => 0);
  const [premiumUsers, revenue, aiToday] = await Promise.all([
    safe(countRows("SELECT COUNT(*) FROM users WHERE premium_until > NOW()")),
    safe(pool.query("SELECT COALESCE(SUM(amount), 0) AS total FROM subscriptions").then((r) => Number(r.rows[0].total))),
    safe(pool.query("SELECT COALESCE(SUM(count), 0) AS total FROM ai_usage WHERE day = CURRENT_DATE").then((r) => Number(r.rows[0].total))),
  ]);

  return { users, admins, newThisWeek, inactive, recipes, favorites, premiumUsers, revenue, aiToday };
};

// قائمة المستخدمين مع بحث بالاسم أو الإيميل
const listUsers = async ({ search = "", limit = 50, offset = 0 }) => {
  const term = `%${search.trim()}%`;
  const result = await pool.query(
    `SELECT id, name, email, role_id, is_active, created_at,
            (google_id IS NOT NULL) AS google_account
     FROM users
     WHERE name ILIKE $1 OR email ILIKE $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [term, limit, offset]
  );
  const total = await countRows(
    "SELECT COUNT(*) FROM users WHERE name ILIKE $1 OR email ILIKE $1",
    [term]
  );
  return { users: result.rows, total };
};

const setRole = async (id, roleId) => {
  const result = await pool.query(
    `UPDATE users SET role_id = $1 WHERE id = $2
     RETURNING id, name, email, role_id, is_active, created_at`,
    [roleId, id]
  );
  return result.rows[0];
};

const setActive = async (id, isActive) => {
  const result = await pool.query(
    `UPDATE users SET is_active = $1 WHERE id = $2
     RETURNING id, name, email, role_id, is_active, created_at`,
    [isActive, id]
  );
  return result.rows[0];
};

// نحذف بيانات المستخدم المرتبطة أول، بعدين المستخدم نفسه
const deleteUser = async (id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM favorites WHERE user_id = $1", [id]);
    await client.query("DELETE FROM weekly_meals WHERE user_id = $1", [id]);
    const result = await client.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { getStats, listUsers, setRole, setActive, deleteUser };
