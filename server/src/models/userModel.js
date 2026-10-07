const pool = require("../config/db");

const createUser = async (name, email, password, roleId = 1) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role_id, created_at`,
    [name, email, password, roleId]
  );

  return result.rows[0];
};



const findUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  return result.rows[0];
};


const findUserByGoogleId = async (googleId) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE google_id = $1`,
    [googleId]
  );

  return result.rows[0];
};


const createGoogleUser = async (name, email, googleId, roleId = 1) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, google_id, role_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, google_id, role_id, created_at`,
    [name, email, googleId, roleId]
  );

  return result.rows[0];
};

const getUserById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE id = $1`,
    [id]
  );

  // ما نرجع كلمة السر أبداً
  const user = result.rows[0];
  if (user) delete user.password;
  return user;
};

const updateUser = async (id, name, email) => {
  const result = await pool.query(
    `UPDATE users
     SET name = $1,
         email = $2
     WHERE id = $3
     RETURNING id, name, email, google_id, role_id, created_at`,
    [name, email, id]
  );

  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByGoogleId,
  createGoogleUser,
  getUserById,
  updateUser,
};
