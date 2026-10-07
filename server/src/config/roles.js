const pool = require("./db");

// أرقام الأدوار. نبدأ بالقيم الافتراضية (1 مستخدم، 2 مدير)،
// وعند تشغيل السيرفر نقرأ الأرقام الحقيقية من جدول roles حسب الاسم،
// حتى ما نحتاج نعرف الرقم مسبقاً.
const ids = {
  user: Number(process.env.USER_ROLE_ID || 1),
  admin: Number(process.env.ADMIN_ROLE_ID || 2),
};

const loadRoleIds = async () => {
  try {
    const result = await pool.query("SELECT id, name FROM roles");
    for (const row of result.rows) {
      const name = String(row.name).toLowerCase();
      if (name === "admin" && !process.env.ADMIN_ROLE_ID) ids.admin = Number(row.id);
      if (name === "user" && !process.env.USER_ROLE_ID) ids.user = Number(row.id);
    }
    console.log(`Roles: user = ${ids.user}, admin = ${ids.admin}`);
  } catch (error) {
    console.warn("Could not read roles table, using defaults:", error.message);
  }
};

const isAdmin = (user) => Number(user?.role_id ?? user?.roleId) === ids.admin;

module.exports = { ids, loadRoleIds, isAdmin };
