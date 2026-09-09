import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/auth/register', registerUser);
router.post('/auth/login', authUser);
router.get('/auth/me', protect, getUserProfile);

// User routes as requested
router.route('/users/me')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/users')
  .get(protect, admin, getUsers);

export default router;
