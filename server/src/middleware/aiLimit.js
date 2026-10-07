const { getUserById } = require("../models/userModel");
const { getUsage, addUsage } = require("../models/premiumModel");
const { AI_LIMITS, isPremium } = require("../config/premium");

// يحدد كم مرة يگدر المستخدم يسأل مرام باليوم:
// زائر 3، مستخدم مجاني 5، بريميوم بلا حدود.
// المحاولة تنحسب بس إذا مرام ردت بنجاح.
const aiLimit = async (req, res, next) => {
  try {
    const user = req.user?.userId ? await getUserById(req.user.userId) : null;

    if (user && isPremium(user)) {
      req.aiUsage = { unlimited: true };
      return next();
    }

    const key = user ? `user:${user.id}` : `ip:${req.ip}`;
    const limit = user ? AI_LIMITS.free : AI_LIMITS.guest;
    const used = await getUsage(key);

    if (used >= limit) {
      return res.status(429).json({
        code: "DAILY_LIMIT",
        message: "Daily limit reached. Upgrade to Premium for unlimited suggestions.",
        usage: { used, limit, remaining: 0, guest: !user },
      });
    }

    // نلف res.json حتى نحسب المحاولة ونضيف عدد الباقي للرد
    const send = res.json.bind(res);
    res.json = async (body) => {
      if (res.statusCode < 400) {
        try {
          const count = await addUsage(key);
          body = { ...body, usage: { used: count, limit, remaining: Math.max(limit - count, 0), guest: !user } };
        } catch (error) {
          console.error("AI usage:", error.message);
        }
      }
      return send(body);
    };

    next();
  } catch (error) {
    // إذا صار خلل بالعداد ما نوقف مرام
    console.error("AI limit:", error.message);
    next();
  }
};

module.exports = aiLimit;
