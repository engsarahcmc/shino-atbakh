const pool = require("../config/db");

const getRecipesByCategory = async (categoryId) => {
  const result = await pool.query(
    `SELECT
       id,
       name,
       description,
       instructions,
       prep_time,
       servings,
       image_url,
       category_id,
       views_count,
       created_at
     FROM recipes
     WHERE category_id = $1
     ORDER BY created_at DESC`,
    [categoryId]
  );

  return result.rows;
};

const getPopularRecipes = async () => {
  const result = await pool.query(
    `SELECT
       id,
       name,
       description,
       instructions,
       prep_time,
       servings,
       image_url,
       category_id,
       views_count,
       created_at
     FROM recipes
     ORDER BY views_count DESC
     LIMIT 10`
  );

  return result.rows;
};

const incrementRecipeViews = async (recipeId) => {
  const result = await pool.query(
    `UPDATE recipes
     SET views_count = views_count + 1
     WHERE id = $1
     RETURNING id, views_count`,
    [recipeId]
  );

  return result.rows[0];
};

const searchRecipes = async (searchQuery) => {
  const result = await pool.query(
    `SELECT
       id,
       name,
       description,
       instructions,
       prep_time,
       servings,
       image_url,
       category_id,
       views_count,
       created_at
     FROM recipes
     WHERE name ILIKE $1
     ORDER BY views_count DESC
     LIMIT 20`,
    [`%${searchQuery}%`]
  );

  return result.rows;
};

module.exports = {
  getRecipesByCategory,
  getPopularRecipes,
  incrementRecipeViews,
  searchRecipes,
};