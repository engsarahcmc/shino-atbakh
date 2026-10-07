const {
  getAllCategories,
} = require("../models/categoryModel");

const getCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();

    res.json({
      categories,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getCategories,
};