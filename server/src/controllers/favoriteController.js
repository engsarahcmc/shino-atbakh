const {
  addFavorite,
  getFavoritesByUser,
  removeFavorite,
} = require("../models/favoriteModel");

const addToFavorites = async (req, res) => {
  try {
    const { recipeId } = req.body;

    if (!recipeId) {
      return res.status(400).json({
        message: "Recipe ID is required",
      });
    }

    const favorite = await addFavorite(
      req.user.userId,
      recipeId
    );

    res.status(201).json({
      message: "Recipe added to favorites",
      favorite,
    });

  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Recipe already exists in favorites",
      });
    }

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getFavorites = async (req, res) => {
  try {
    const favorites = await getFavoritesByUser(
      req.user.userId
    );

    res.json({
      favorites,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const removeFromFavorites = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const favorite = await removeFavorite(
      req.user.userId,
      recipeId
    );

    if (!favorite) {
      return res.status(404).json({
        message: "Favorite not found",
      });
    }

    res.json({
      message: "Recipe removed from favorites",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  addToFavorites,
  getFavorites,
  removeFromFavorites,
};