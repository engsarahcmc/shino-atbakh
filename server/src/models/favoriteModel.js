const pool = require("../config/db");

const addFavorite = async (userId, recipeId) => {
  const result = await pool.query(
    `INSERT INTO favorites (user_id, recipe_id)
     VALUES ($1, $2)
     RETURNING id, user_id, recipe_id, created_at`,
    [userId, recipeId]
  );

  return result.rows[0];
};

const getFavoritesByUser = async (userId) => {
  const result = await pool.query(
    `SELECT
       favorites.id,
       favorites.recipe_id,
       recipes.name,
       recipes.description,
       recipes.image_url,
       recipes.category_id,
       favorites.created_at
     FROM favorites
     JOIN recipes
       ON favorites.recipe_id = recipes.id
     WHERE favorites.user_id = $1
     ORDER BY favorites.created_at DESC`,
    [userId]
  );

  return result.rows;
};


const removeFavorite = async (userId, recipeId) => {
  const result = await pool.query(
    `DELETE FROM favorites
     WHERE user_id = $1
       AND recipe_id = $2
     RETURNING id, user_id, recipe_id`,
    [userId, recipeId]
  );

  return result.rows[0];
};


module.exports = {
  addFavorite,
  getFavoritesByUser,
  removeFavorite,
};