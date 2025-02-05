import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: JwtPayload | string;
}

const authMiddleware = (roles: string[] = []) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
  
      try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
        req.user = decoded;
  
        // Check role
        if (roles.length > 0 && typeof decoded === 'object' && !roles.includes(decoded.role)) {
          res.status(403).json({ message: 'Forbidden' });
          return;
        }
  
        next();
      } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
      }
    };
  };

export default authMiddleware;



  