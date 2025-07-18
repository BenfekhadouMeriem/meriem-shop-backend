import express from 'express';
import Category from '../models/categoryModel.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();

// Create a category
router.post('/', asyncHandler(async (req, res) => {
  const { name, slug, image } = req.body;

  if (!name || !slug) {
    res.status(400);
    throw new Error('Name and slug are required');
  }

  const category = new Category({ name, slug, image });
  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
}));

// Get all categories
router.get('/', asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
}));

export default router;
