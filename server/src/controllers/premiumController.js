const premiumModel = require("../models/premiumModel");
const { getUserById } = require("../models/userModel");
const { PLANS, METHODS, AI_LIMITS, isPremium } = require("../config/premium");

const status = (user) => ({
  isPremium: isPremium(user),
  plan: isPremium(user) ? user.premium_plan : null,
  until: isPremium(user) ? user.premium_until : null,
});

// GET /api/premium/plans
const getPlans = (req, res) => {
  res.json({ plans: PLANS, methods: METHODS, limits: AI_LIMITS, currency: "IQD", demo: true });
};

// GET /api/premium/status
const getStatus = async (req, res) => {
  try {
    const user = await getUserById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ ...status(user), history: await premiumModel.history(user.id) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/premium/subscribe  { plan, method }
// دفع تجريبي: ما ينسحب أي مبلغ، بس نسجل العملية ونفعل الاشتراك
const subscribe = async (req, res) => {
  try {
    const { plan, method } = req.body;

    if (!PLANS[plan]) {
      return res.status(400).json({ message: `plan must be one of: ${Object.keys(PLANS).join(", ")}` });
    }
    if (!METHODS.includes(method)) {
      return res.status(400).json({ message: `method must be one of: ${METHODS.join(", ")}` });
    }

    const subscription = await premiumModel.activate(req.user.userId, plan, method);
    const user = await getUserById(req.user.userId);

    res.status(201).json({
      message: "Premium activated (demo payment)",
      subscription,
      ...status(user),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/premium/cancel
const cancel = async (req, res) => {
  try {
    await premiumModel.cancel(req.user.userId);
    res.json({ message: "Subscription cancelled", isPremium: false, plan: null, until: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getPlans, getStatus, subscribe, cancel };
