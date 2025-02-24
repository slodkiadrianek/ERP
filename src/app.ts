import express from "express";
import { AuthRoutes } from "./api/v1/routes/auth.routes.js";
import { Logger } from "./utils/logger.js";

import cors from "cors";
import helmet from "helmet";
import { createClient } from "redis";
import { AuthController } from "./api/v1/controllers/auth.controller.js";
import { AuthService } from "./services/auth.service.js";
import { Authentication } from "./middleware/auth.middleware.js";
import { RedisCacheService } from "./types/common.types.js";
import { ManagerService } from "./services/manager.service.js";
import { ManagerController } from "./api/v1/controllers/manager.controller.js";
import { ManagerRoutes } from "./api/v1/routes/manager.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { WarehouseService } from "./services/warehouse.service.js";
import { WarehouseController } from "./api/v1/controllers/warehouse.controller.js";
import { WarehouseRoutes } from "./api/v1/routes/warehouse.routes.js";
export let caching: unknown;
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

const auth = new Authentication(
  process.env.JWT_SECRET || "",
  logger,
  caching as RedisCacheService,
);
const authService = new AuthService(logger, auth, caching as RedisCacheService);
const authController = new AuthController(logger, authService);
const employeeRoutes = new AuthRoutes(authController, auth);
//manager
const managerService = new ManagerService(logger, caching as RedisCacheService);
const managerController = new ManagerController(logger, managerService);
const managerRoutes = new ManagerRoutes(auth, managerController);
// warehouse
const warehouseService = new WarehouseService(
  logger,
  caching as RedisCacheService,
);
const warehouseController = new WarehouseController(logger, warehouseService);
const warehouseRoutes = new WarehouseRoutes(auth, warehouseController);
app.use(employeeRoutes.router);
app.use(managerRoutes.router);
app.use(warehouseRoutes.router);
app.use(errorHandler);
