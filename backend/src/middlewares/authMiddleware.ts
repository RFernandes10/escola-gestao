// verifica JWT
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  console.log('Auth header received:', header);
  
  if (!header || !header.startsWith('Bearer ')) {
    console.log('Auth failed: no token provided');
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const token = header.split(' ')[1];
  try {
    const payload = verifyToken(token);
    req.userId = payload.sub;
    req.userRole = payload.role;
    console.log('Auth success for user:', payload.sub);
    next();
  } catch (err) {
    console.log('Auth failed: invalid token', err);
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};