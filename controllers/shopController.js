import Shop from "../models/shopModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";
import { isValidObjectId } from "mongoose";

// Create a new shop
export const createShop = asyncHandler(async (req, res) => {
  const { name, description, logo, owner, address, contact, categories } = req.body;

  if (!name || !description || !logo?.url || !owner || !address?.city || !address?.state || !address?.country) {
    res.status(400);
    throw new Error("All required fields must be provided");
  }

  if (!isValidObjectId(owner)) {
    res.status(400);
    throw new Error("Invalid owner ID");
  }

  if (categories && categories.length > 0) {
    for (const categoryId of categories) {
      if (!isValidObjectId(categoryId)) {
        res.status(400);
        throw new Error("Invalid category ID");
      }
    }
  }

  const shop = new Shop({
    name,
    description,
    logo,
    owner,
    address,
    contact,
    categories,
  });

  const createdShop = await shop.save();
  res.status(201).json(createdShop);
});

// Get all shops
export const getShops = asyncHandler(async (req, res) => {
  const shops = await Shop.find({ owner: { $ne: null } }).populate('owner categories');
  res.json({ data: shops });
});

// Get a single shop by ID
export const getShopById = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid shop ID");
  }

  const shop = await Shop.findById(req.params.id).populate('owner categories');

  if (!shop) {
    res.status(404);
    throw new Error("Shop not found");
  }

  res.json(shop);
});

// Update a shop
export const updateShop = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid shop ID");
  }

  const { name, description, logo, owner, address, contact, categories } = req.body;

  if (!name || !description || !logo?.url || !owner || !address?.city || !address?.state || !address?.country) {
    res.status(400);
    throw new Error("All required fields must be provided");
  }

  if (!isValidObjectId(owner)) {
    res.status(400);
    throw new Error("Invalid owner ID");
  }

  if (categories && categories.length > 0) {
    for (const categoryId of categories) {
      if (!isValidObjectId(categoryId)) {
        res.status(400);
        throw new Error("Invalid category ID");
      }
    }
  }

  const shop = await Shop.findById(req.params.id);

  if (!shop) {
    res.status(404);
    throw new Error("Shop not found");
  }

  shop.name = name;
  shop.description = description;
  shop.logo = logo;
  shop.owner = owner;
  shop.address = address;
  shop.contact = contact;
  shop.categories = categories || [];

  const updatedShop = await shop.save();
  res.json(updatedShop);
});

// Delete a shop
export const deleteShop = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid shop ID");
  }

  const shop = await Shop.findById(req.params.id);

  if (!shop) {
    res.status(404);
    throw new Error("Shop not found");
  }

  await Product.deleteMany({ shop: req.params.id });
  await shop.deleteOne();
  res.json({ message: "Shop removed" });
});

// Get shop statistics
export const getShopStats = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid shop ID");
  }

  const shop = await Shop.findById(req.params.id);

  if (!shop) {
    res.status(404);
    throw new Error("Shop not found");
  }

  const productCount = await Product.countDocuments({ shop: req.params.id });
  const activeProducts = await Product.countDocuments({ shop: req.params.id, status: "active" });
  const totalOrders = await Order.countDocuments({ shop: req.params.id });
  const pendingOrders = await Order.countDocuments({ shop: req.params.id, status: "pending" });

  res.json({
    productCount,
    activeProducts,
    totalOrders,
    pendingOrders,
  });
});
