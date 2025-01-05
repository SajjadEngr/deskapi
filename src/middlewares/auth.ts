import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Request type
export interface AuthenticatedRequest extends Request {
  user?: any;
}

// Middleware jwt request
const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).json({ message: "access denied" });
    return;
  }

  jwt.verify(token, process.env.SECRET_KEY!, (err, user) => {
    if (err) {
      res.status(403).json({ message: "invalid token" });
      return;
    }
    req.user = user;
    next();
  });
};

export default authenticateToken;
