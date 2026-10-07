const express = require("express");

const {
  getCategories,
} = require("../controllers/categoryController");

const {
  getRecipesByCategoryController,
  getPopularRecipesController,
  incrementRecipeViewsController,
  searchRecipesController,
} = require("../controllers/recipeController");

const router = express.Router();

router.get("/search", searchRecipesController);
router.get("/", getCategories);

router.get("/:categoryId/recipes", getRecipesByCategoryController);

router.get("/popular", getPopularRecipesController);
router.patch(
  "/recipes/:recipeId/views",
  incrementRecipeViewsController
);

module.exports = router;