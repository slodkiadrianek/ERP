import jwt, { JwtPayload } from "jsonwebtoken";
import { IEmployee } from "../models/employee.model.js";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../models/error.model.js";
import { Logger } from "../utils/logger.js";
import { caching } from "../app.js";
export class Authentication {
  jwt: string;
  jwtSecret: string;
  logger: Logger;
  constructor(jwt: string, logger: Logger) {
    this.jwt = jwt;
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }
    this.jwtSecret = process.env.JWT_SECRET;
    this.logger = logger;
  }

  sign = (employee: IEmployee): string => {
    const token = jwt.sign(
      { employee, iat: Math.floor(Date.now() / 1000) - 60 },
      this.jwtSecret,
      {
        expiresIn: "1h",
      },
    );
    return token;
  };
  verify = async (
    res: Response,
    req: Request,
    next: NextFunction,
  ): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      this.logger.error(
        `Token is missing during verification of request ${req.baseUrl} with data: ${req.body}`,
      );
      res.status(401).json({ message: "Token is missing" });
      return;
    }
    try {
      const isBlacklisted = await caching.get(`blacklist:${token}`);
      if (isBlacklisted) {
        this.logger.error(
          `Token is blacklisted  of request ${req.baseUrl} with data: ${req.body}`,
        );
        throw new AppError(401, "Authorization", "Token is blacklisted.");
      }
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as JwtPayload;

      (req as Request & { user?: unknown }).user = {
        id: decoded.id,
        email: decoded.email,
        iat: decoded.iat,
      };
      this.logger.info(`User succssefully authorized`);
      return next();
    } catch (error) {
      this.logger.error(
        `Token is invalid of request ${req.baseUrl} with data: ${req.body}`,
      );
      res.status(401).json({ message: "Invalid token", error });
      return;
    }
  };
  async blacklist(token: string, req: Request): Promise<void> {
    const decoded = jwt.decode(token) as { exp: number };
    if (!decoded || !decoded.exp) {
      this.logger.error(
        `Token is invalid of request ${req.baseUrl} with data: ${req.body}`,
      );
      throw new Error("Invalid token.");
    }
    const expiration = decoded.exp - Math.floor(Date.now() / 1000);
    await caching.set(`blacklist:${token}`, "true", {
      EX: expiration,
    });
    this.logger.info(
      `Token has been blacklisted  of request ${req.baseUrl} with data: ${req.body}`,
    );
  }
}
