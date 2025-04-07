import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Ensure JWT_SECRET is provided through environment variables
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('JWT_SECRET environment variable is required');
  // In production, you might want to exit the process
  // process.exit(1);
}

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login and authentication
    await user.update({
      lastLogin: new Date(),
      lastAuthenticated: new Date(),
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { userid: user.userid, username: user.username, usertype: user.usertype },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error during login' });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await User.findByPk(decoded.userid, {
      attributes: { exclude: ['password'] },
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Update last authentication
    await user.update({
      lastAuthenticated: new Date(),
    });
    
    res.json({
      userid: user.userid,
      username: user.username,
      usertype: user.usertype,
      lastLogin: user.lastLogin,
      lastAuthenticated: user.lastAuthenticated,
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}; 