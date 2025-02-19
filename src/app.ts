import express from "express";
import { AuthRoutes } from "./api/v1/routes/auth.routes.js";
import { Logger } from "./utils/logger.js";

import cors from "cors";
import helmet from "helmet";
import { createClient } from "redis";
import { AuthController } from "./api/v1/controllers/auth.controller.js";
import { AuthService } from "./services/auth.service.js";
import { Authentication } from "./middleware/auth.middleware.js";
export let caching: ReturnType<typeof createClient>;
if (process.env.CACHE_LINK) {
  caching = await createClient({
    url: process.env.CACHE_LINK,
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
} else {
  console.error(`No cache link provided`);
  process.exit(1);
}

export const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const logger = new Logger();
const auth = new Authentication(process.env.JWT_SECRET || "", logger);
const authService = new AuthService(logger, auth);
const authController = new AuthController(logger, authService);
const userRoutes = new AuthRoutes(authController);
app.use(userRoutes.router);
