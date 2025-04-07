import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', createUser);

// Protected routes - all routes below this point require authentication
router.use(verifyToken);

// User management routes
router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

export default router; 