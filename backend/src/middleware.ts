import { NextFunction, Response } from 'express';
import { authAdmin, db } from './firebase.js';
import { AuthedRequest, AuthedUser } from './types.js';

export const requireAuth = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.replace('Bearer ', '') : null;
    if (!token) {
      return res.status(401).json({ message: 'Missing Authorization header' });
    }
    const decoded = await authAdmin.verifyIdToken(token);
    const userDoc = await db.collection('users').doc(decoded.uid).get();
    const role = userDoc.exists ? userDoc.data()?.role : 'user';
    const user: AuthedUser = { uid: decoded.uid, email: decoded.email, role };
    req.user = user;
    return next();
  } catch (err) {
    console.error('Auth error', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireRole = (role: string) => {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });
    if (req.user.role !== role) return res.status(403).json({ message: 'Insufficient role' });
    return next();
  };
};
