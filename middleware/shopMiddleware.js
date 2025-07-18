import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";
import Shop from "../models/shopModel.js";
import User from "../models/userModel.js";

export const validateShopData = asyncHandler(async (req, res, next) => {
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
  next();
});

export const isShopOwner = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User not authenticated");
  }
  const shop = await Shop.findById(req.params.id);
  if (!shop) {
    res.status(404);
    throw new Error("Shop not found");
  }
  if (shop.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to access this shop");
  }
  next();
});

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }
});
