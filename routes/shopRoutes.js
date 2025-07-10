import express from "express";
import {
  createShop,
  getShops,
  getShopById,
  updateShop,
  deleteShop,
  getShopStats,
} from "../controllers/shopController.js";

const router = express.Router();

router.route("/").post(createShop).get(getShops);
router.route("/:id").get(getShopById).put(updateShop).delete(deleteShop);
router.get("/:id/stats", getShopStats);

export default router;
