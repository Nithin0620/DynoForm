import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';
import { User, IUser } from '../models';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required. Please provide Bearer token.' });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
            
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(401).json({ error: 'Invalid token - user not found' });
            }

            req.user = user;
            next();
        } catch (jwtError) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Authentication error' });
    }
};

export const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};
