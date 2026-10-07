const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getPlans, getStatus, subscribe, cancel } = require("../controllers/premiumController");

const router = express.Router();

router.get("/plans", getPlans);
router.get("/status", authMiddleware, getStatus);
router.post("/subscribe", authMiddleware, subscribe);
router.post("/cancel", authMiddleware, cancel);

module.exports = router;
