import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', createUser);
router.post('/login', loginUser);

// Protected routes
router.get('/:userid', authenticateToken, getUser);
router.put('/:userid', authenticateToken, updateUser);
router.delete('/:userid', authenticateToken, deleteUser);

// User management routes
router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router; 