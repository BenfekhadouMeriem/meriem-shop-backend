import express from 'express';
import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';
import { isValidObjectId } from 'mongoose';

const router = express.Router();

// Create a product
router.post('/', asyncHandler(async (req, res) => {
  const { name, description, purchasePrice, price, offerPrice, category, shop, variants, images, featured } = req.body;

  if (!name || !description || !purchasePrice || !price || !category || !shop) {
    res.status(400);
    throw new Error('All required fields must be provided');
  }

  if (!isValidObjectId(category) || !isValidObjectId(shop)) {
    res.status(400);
    throw new Error('Invalid category or shop ID');
  }

  const product = new Product({
    name,
    description,
    purchasePrice,
    price,
    offerPrice,
    category,
    shop,
    variants,
    images,
    featured,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
}));

// Get all products
router.get('/', asyncHandler(async (req, res) => {
  const products = await Product.find().populate('category shop');
  res.json(products);
}));

// Update a product
router.put('/:id', asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid product ID');
  }

  const { name, description, purchasePrice, price, offerPrice, category, shop, variants, images, featured } = req.body;

  if (!name || !description || !purchasePrice || !price || !category || !shop) {
    res.status(400);
    throw new Error('All required fields must be provided');
  }

  if (!isValidObjectId(category) || !isValidObjectId(shop)) {
    res.status(400);
    throw new Error('Invalid category or shop ID');
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.name = name;
  product.description = description;
  product.purchasePrice = purchasePrice;
  product.price = price;
  product.offerPrice = offerPrice;
  product.category = category;
  product.shop = shop;
  product.variants = variants || [];
  product.images = images || [];
  product.featured = featured ?? false;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
}));

// Delete a product
router.delete('/:id', asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid product ID');
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  res.json({ message: 'Product removed' });
}));

export default router;
