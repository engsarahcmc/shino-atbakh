const express = require("express");

const {
  addToFavorites,
  getFavorites,
  removeFromFavorites,
} = require("../controllers/favoriteController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, addToFavorites);

router.get("/", authMiddleware, getFavorites);

router.delete("/:recipeId", authMiddleware, removeFromFavorites);

module.exports = router;