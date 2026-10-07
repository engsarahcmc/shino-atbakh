const pool = require("./db");

// خطط الاشتراك. الأسعار بالدينار العراقي، والدفع تجريبي (محاكاة) بس.
const PLANS = {
  monthly: { price: 5000, days: 30 },
  yearly: { price: 48000, days: 365 },
};

// طرق الدفع اللي تطلع بصفحة الدفع التجريبية
const METHODS = ["zaincash", "qicard", "fastpay"];

// كم اقتراح من مرام باليوم لكل نوع مستخدم (البريميوم بلا حدود)
const AI_LIMITS = {
  guest: Number(process.env.AI_LIMIT_GUEST || 3),
  free: Number(process.env.AI_LIMIT_FREE || 5),
};

const isPremium = (user) =>
  Boolean(user?.premium_until && new Date(user.premium_until) > new Date());

// ينشئ جداول الاشتراك إذا ما موجودة، حتى ما نحتاج نشغل SQL يدوياً.
// نفس الأوامر موجودة بملف server/sql/premium.sql
const ensurePremiumTables = async () => {
  try {
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS premium_plan VARCHAR(20);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS premium_until TIMESTAMP;

      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        plan VARCHAR(20) NOT NULL,
        method VARCHAR(30) NOT NULL,
        amount INTEGER NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        started_at TIMESTAMP NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMP NOT NULL
      );

      CREATE TABLE IF NOT EXISTS ai_usage (
        usage_key VARCHAR(80) NOT NULL,
        day DATE NOT NULL DEFAULT CURRENT_DATE,
        count INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (usage_key, day)
      );
    `);
    console.log("Premium tables ready");
  } catch (error) {
    console.warn("Could not prepare premium tables:", error.message);
  }
};

module.exports = { PLANS, METHODS, AI_LIMITS, isPremium, ensurePremiumTables };
