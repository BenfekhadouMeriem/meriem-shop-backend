import Shop from "../models/Shop.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import asyncHandler from "express-async-handler";
import { isValidObjectId } from "mongoose";


export const createShop = asyncHandler(async (req, res) => {
  const { name, description, logo, banner, owner, address, contact, categories } = req.body;

  if (!name || !description || !address?.city || !address?.state || !logo?.url || !owner) {
    res.status(400);
    throw new Error("Missing required fields: name, description, city, state, logo URL, or owner");
  }

  if (!isValidObjectId(owner)) {
    res.status(400);
    throw new Error("Invalid owner ID");
  }

  const shop = await Shop.create({
    name,
    description,
    logo,
    banner,
    owner,
    address,
    contact,
    categories,
  });

  res.status(201).json(shop);
});


export const getShops = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 12, 1);
  const skip = (page - 1) * limit;
  const search = req.query.search ? String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";

  let query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const shops = await Shop.find(query)
    .populate("owner", "username email")
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  const total = await Shop.countDocuments(query);

  res.json({ data: shops, total });
});


export const getShopById = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid shop ID");
  }

  const shop = await Shop.findById(req.params.id)
    .populate("owner", "username email")
    .populate("categories", "name slug");

  if (!shop) {
    res.status(404);
    throw new Error("Shop not found");
  }

  res.json(shop);
});


export const updateShop = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid shop ID");
  }

  const shop = await Shop.findById(req.params.id);

  if (!shop) {
    res.status(404);
    throw new Error("Shop not found");
  }

  const updatedShop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json(updatedShop);
});


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
  await shop.remove();
  res.json({ message: "Shop removed" });
});


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

  const stats = {
    productCount: await Product.countDocuments({ shop: req.params.id }),
    activeProducts: await Product.countDocuments({
      shop: req.params.id,
      "variants.stock": { $gt: 0 },
    }),
    totalOrders: await Order.countDocuments({ shop: req.params.id }),
    pendingOrders: await Order.countDocuments({
      shop: req.params.id,
      status: "pending",
    }),
  };

  res.json(stats);
});
