import express from 'express';
import { createShop, getShops, getShopById, updateShop, deleteShop, getShopStats } from '../controllers/shopController.js';

const router = express.Router();

router.post('/', createShop);
router.get('/', getShops);
router.get('/:id', getShopById);
router.put('/:id', updateShop);
router.delete('/:id', deleteShop);
router.get('/:id/stats', getShopStats);

export default router;
