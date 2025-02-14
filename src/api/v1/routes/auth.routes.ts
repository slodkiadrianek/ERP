import { Router, Request, Response, NextFunction } from "express";
import { rateLimit } from "express-rate-limit";

export class AuthRoutes {
  public router: Router;
  //  privete authController : AuthController;
  private readonly loginRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 3,
  });

  constructor() {
    this.router = Router();
    // this.authController = new AuthController(authService, userService, logger);
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.post("/api/v1/auth/login");
    this.router.post(
      "/api/v1/auth/login",
      (req: Request, res: Response, next: NextFunction) => {
        console.log(`Hello world`);
      }
    );
    this.router.post("/api/v1/auth/refresh-token", this.loginRateLimit);

    this.router.post("/api/v1/auth/logout");
    this.router.post("/api/v1/auth/reset-password", this.loginRateLimit);
  }
}
