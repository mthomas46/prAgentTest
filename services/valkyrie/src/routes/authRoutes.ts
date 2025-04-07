import express from 'express';
import { login, verifyToken } from '../middleware/auth';

const router = express.Router();

// Authentication routes - all public
router.post('/login', login);
router.post('/verify', verifyToken);

export default router; 