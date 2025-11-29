import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract user ID from Authorization header (Bearer token would contain user ID or token)
    // For this implementation, we expect userId in header for simplicity
    // In production, use JWT or session-based auth
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid user credentials' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication error' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};
