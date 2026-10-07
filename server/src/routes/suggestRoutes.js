const express = require("express");
const { suggestRecipes, getRecipeDetails } = require("../controllers/suggestController");

const optionalAuth = require("../middleware/optionalAuth");
const aiLimit = require("../middleware/aiLimit");

const router = express.Router();

// POST /api/suggest  →  وصفات من مرام حسب المكونات
// الزائر والمستخدم المجاني عندهم حد يومي، والبريميوم بلا حدود
router.post("/", optionalAuth, aiLimit, suggestRecipes);

// POST /api/suggest/recipe  →  المكونات بالكميات وطريقة التحضير لوصفة وحدة
router.post("/recipe", getRecipeDetails);

module.exports = router;
