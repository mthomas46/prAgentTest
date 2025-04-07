import express from 'express';
import { login, verifyToken } from '../controllers/authController';

const router = express.Router();

// Authentication routes
router.post('/login', login);
router.post('/verify', verifyToken);

export default router; 