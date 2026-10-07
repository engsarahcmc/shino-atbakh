const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getStats,
  getUsers,
  updateRole,
  updateStatus,
  removeUser,
} = require("../controllers/adminController");

const router = express.Router();

// كل روابط المدير تحتاج تسجيل دخول + صلاحية مدير
router.use(authMiddleware, adminMiddleware);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.patch("/users/:id/role", updateRole);
router.patch("/users/:id/status", updateStatus);
router.delete("/users/:id", removeUser);

module.exports = router;
