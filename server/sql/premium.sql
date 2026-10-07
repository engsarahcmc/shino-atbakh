-- جداول اشتراك Premium وحد استخدام مرام
-- السيرفر ينشئها وحده عند التشغيل، وهذا الملف للتوثيق أو للتشغيل اليدوي.

ALTER TABLE users ADD COLUMN IF NOT EXISTS premium_plan VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS premium_until TIMESTAMP;

-- كل عملية اشتراك (الدفع تجريبي)
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan VARCHAR(20) NOT NULL,          -- monthly | yearly
  method VARCHAR(30) NOT NULL,        -- zaincash | qicard | fastpay
  amount INTEGER NOT NULL,            -- بالدينار العراقي
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- active | cancelled
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
);

-- عدد مرات استخدام مرام باليوم (user:ID أو ip:ADDRESS)
CREATE TABLE IF NOT EXISTS ai_usage (
  usage_key VARCHAR(80) NOT NULL,
  day DATE NOT NULL DEFAULT CURRENT_DATE,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (usage_key, day)
);
