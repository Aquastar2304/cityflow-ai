import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "./config";

export type Role = "ops" | "planner" | "admin";

export interface AuthUser {
  sub: string;
  role: Role;
}

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Request {
      user?: AuthUser;
    }
  }
}

export const verifyToken = (roles?: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid authorization header" });
    }
    const token = header.substring("Bearer ".length);
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as AuthUser;
      if (roles && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
};

export const issueDemoToken = (role: Role, sub = "demo-user") => {
  return jwt.sign({ sub, role }, config.jwtSecret, { expiresIn: "7d" });
};

