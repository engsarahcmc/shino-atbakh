const {
  addWeeklyMeal,
  getWeeklyMealsByUser,
  deleteWeeklyMeal,
  updateWeeklyMeal,
} = require("../models/weeklyMealModel");

const addWeeklyMealController = async (req, res) => {
  try {
    const {
      recipeId,
      day,
      mealType,
      servings,
    } = req.body;

    if (!recipeId || !day || !mealType || !servings) {
      return res.status(400).json({
        message: "Recipe ID, day, meal type and servings are required",
      });
    }

    const weeklyMeal = await addWeeklyMeal(
      req.user.userId,
      recipeId,
      day,
      mealType,
      servings
    );

    res.status(201).json({
      message: "Weekly meal added successfully",
      weeklyMeal,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getWeeklyMealsController = async (req, res) => {
  try {
    const weeklyMeals = await getWeeklyMealsByUser(
      req.user.userId
    );

    res.json({
      weeklyMeals,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteWeeklyMealController = async (req, res) => {
  try {
    const { weeklyMealId } = req.params;

    const deletedMeal = await deleteWeeklyMeal(
      req.user.userId,
      weeklyMealId
    );

    if (!deletedMeal) {
      return res.status(404).json({
        message: "Weekly meal not found",
      });
    }

    res.json({
      message: "Weekly meal deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateWeeklyMealController = async (req, res) => {
  try {
    const { weeklyMealId } = req.params;

    const {
      recipeId,
      day,
      mealType,
      servings,
    } = req.body;

    if (!recipeId || !day || !mealType || !servings) {
      return res.status(400).json({
        message: "Recipe ID, day, meal type and servings are required",
      });
    }

    const updatedMeal = await updateWeeklyMeal(
      req.user.userId,
      weeklyMealId,
      recipeId,
      day,
      mealType,
      servings
    );

    if (!updatedMeal) {
      return res.status(404).json({
        message: "Weekly meal not found",
      });
    }

    res.json({
      message: "Weekly meal updated successfully",
      weeklyMeal: updatedMeal,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  addWeeklyMealController,
    getWeeklyMealsController,
    deleteWeeklyMealController,
    updateWeeklyMealController,

};