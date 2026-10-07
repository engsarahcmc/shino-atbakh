const express = require("express");

const {
  addWeeklyMealController,
  getWeeklyMealsController,
  deleteWeeklyMealController,
  updateWeeklyMealController,
} = require("../controllers/weeklyMealController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, addWeeklyMealController);

router.get("/", authMiddleware, getWeeklyMealsController);

router.put(
  "/:weeklyMealId",
  authMiddleware,
  updateWeeklyMealController
);

router.delete(
  "/:weeklyMealId",
  authMiddleware,
  deleteWeeklyMealController
);

module.exports = router;