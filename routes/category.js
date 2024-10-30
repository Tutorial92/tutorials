const express = require("express");
const Category = require("../models/Category");
const router = express.Router();
// const auth = require("../middleware/auth");

// Add a new product (Admin)
router.post("/", async (req, res) => {
  try {
    const existingCategory = await Category.findOne({
      category_name: req.body.category_name,
    });

    if (existingCategory) {
      return res.status(400).json({ error: "Category name already exists" });
    }

    const category = new Category({
      category_name: req.body.category_name,
    });

    const newCategory = await category.save();
    res.status(201).json({
      status: true,
      message: "Category successfully created",
      data: newCategory,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Request failed",
      error: err.message,
    });
  }
});
// Get all products
router.get("/", async (req, res) => {
  try {
    const category = await Category.find();
    res.json({
      status: true,
      message: "Categories fetched successfully",
      data: category,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Request failed",
      error: err.message,
    });
  }
});

//delete a category
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the category by ID
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });
    }

    res.status(200).json({
      status: true,
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "An error occurred",
      error: err.message,
    });
  }
});

//update category
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { category_name } = req.body; // Extract category name from request body

  try {
    // Find the category by ID and update it
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { category_name }, // Fields to update
      { new: true, runValidators: true } // Options: return the updated document and validate
    );

    if (!updatedCategory) {
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });
    }

    res.status(200).json({
      status: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "An error occurred",
      error: err.message,
    });
  }
});

module.exports = router;
