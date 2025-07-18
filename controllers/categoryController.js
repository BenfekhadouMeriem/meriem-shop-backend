import Category from "../models/categoryModel.js";
import asyncHandler from "express-async-handler";

export const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, image } = req.body;

  if (!name || !slug) {
    res.status(400);
    throw new Error("Name and slug are required");
  }

  const category = await Category.create({ name, slug, image });
  res.status(201).json(category);
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});
