const pool = require("../config/db");

const getAllCategories = async () => {
  const result = await pool.query(
    `SELECT id, name, description
     FROM categories
     ORDER BY name ASC`
  );

  return result.rows;
};



module.exports = {
  getAllCategories,
};