import { Router } from "express";
import { RateLimitRequestHandler } from "express-rate-limit";
import { rateLimit } from "express-rate-limit";
import { AuthController } from "../controllers/auth.controller.js";
import { ValidationMiddleware } from "../../../middleware/validation.middleware.js";
import {
  loginEmployee,
  registerEmployee,
} from "../../../schemas/employee.schema.js";
import { Authentication } from "../../../middleware/auth.middleware.js";
export class AuthRoutes {
  public router: Router;
  private authController: AuthController;
  private auth: Authentication;
  private readonly loginRateLimit: RateLimitRequestHandler = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 3,
  });

  constructor(authController: AuthController, auth: Authentication) {
    this.router = Router();
    this.authController = authController;
    this.auth = auth;
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.post(
      "/api/v1/auth/register",
      this.loginRateLimit,
      ValidationMiddleware.validate(registerEmployee, "body"),
      this.authController.registerEmployee,
    );
    this.router.post(
      "/api/v1/auth/login",
      this.loginRateLimit,
      ValidationMiddleware.validate(loginEmployee, "body"),
      this.authController.loginEmployee,
    );
    this.router.post("/api/v1/auth/refresh-token", this.auth.verify);

    this.router.post("/api/v1/auth/logout", this.auth.verify);
    this.router.post("/api/v1/auth/reset-password", this.auth.verify);
  }
}
