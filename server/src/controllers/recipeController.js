const {
  getRecipesByCategory,
  getPopularRecipes,
  incrementRecipeViews,
  searchRecipes,
} = require("../models/recipeModel");

const getRecipesByCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const recipes = await getRecipesByCategory(categoryId);

    res.json({
      recipes,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getPopularRecipesController = async (req, res) => {
  try {
    const recipes = await getPopularRecipes();

    res.json({
      recipes,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const incrementRecipeViewsController = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const recipe = await incrementRecipeViews(recipeId);

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    res.json({
      message: "Recipe view counted",
      recipe,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const searchRecipesController = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const recipes = await searchRecipes(q.trim());

    res.json({
      recipes,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  getRecipesByCategoryController,
  getPopularRecipesController,
  incrementRecipeViewsController,
  searchRecipesController,
};
