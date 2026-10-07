const pool = require("../config/db");

const addWeeklyMeal = async (
  userId,
  recipeId,
  day,
  mealType,
  servings
) => {
  const result = await pool.query(
    `INSERT INTO weekly_meals
      (user_id, recipe_id, day, meal_type, servings)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, user_id, recipe_id, day, meal_type, servings, created_at`,
    [userId, recipeId, day, mealType, servings]
  );

  return result.rows[0];
};


const getWeeklyMealsByUser = async (userId) => {
  const result = await pool.query(
    `SELECT
       weekly_meals.id,
       weekly_meals.recipe_id,
       recipes.name,
       recipes.description,
       recipes.image_url,
       weekly_meals.day,
       weekly_meals.meal_type,
       weekly_meals.servings,
       weekly_meals.created_at
     FROM weekly_meals
     JOIN recipes
       ON weekly_meals.recipe_id = recipes.id
     WHERE weekly_meals.user_id = $1
     ORDER BY
       weekly_meals.day ASC,
       weekly_meals.meal_type ASC`,
    [userId]
  );

  return result.rows;
};

const deleteWeeklyMeal = async (userId, weeklyMealId) => {
  const result = await pool.query(
    `DELETE FROM weekly_meals
     WHERE id = $1
       AND user_id = $2
     RETURNING id`,
    [weeklyMealId, userId]
  );

  return result.rows[0];
};

const updateWeeklyMeal = async (
  userId,
  weeklyMealId,
  recipeId,
  day,
  mealType,
  servings
) => {
  const result = await pool.query(
    `UPDATE weekly_meals
     SET recipe_id = $1,
         day = $2,
         meal_type = $3,
         servings = $4
     WHERE id = $5
       AND user_id = $6
     RETURNING id, user_id, recipe_id, day, meal_type, servings, created_at`,
    [recipeId, day, mealType, servings, weeklyMealId, userId]
  );

  return result.rows[0];
};

module.exports = {
  addWeeklyMeal,
  getWeeklyMealsByUser,
  deleteWeeklyMeal,
  updateWeeklyMeal
};