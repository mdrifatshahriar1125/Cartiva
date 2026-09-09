import express from 'express';
import { createProduct, updateProduct, deleteProduct } from '../controllers/adminController.js';
import { getOrders, updateOrderStatus } from '../controllers/orderController.js';
import { getUsers } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Product management
router.route('/products')
  .post(protect, admin, createProduct);
router.route('/products/:id')
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

// Order management
router.route('/orders')
  .get(protect, admin, getOrders);
router.route('/orders/:id/status')
  .put(protect, admin, updateOrderStatus);

// User management
router.route('/users')
  .get(protect, admin, getUsers);

export default router;
