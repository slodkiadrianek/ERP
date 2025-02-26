import { Authentication } from "../../../middleware/auth.middleware.js";
import { WarehouseController } from "../controllers/warehouse.controller.js";
import { Router } from "express";
import {
  warehousesPermissions,
  permissionsCheck,
} from "../../../middleware/access.middleware.js";
import { ValidationMiddleware } from "../../../middleware/validation.middleware.js";
import {
  newWarehouseSchema,
  warehouseId,
} from "../../../schemas/warehouse.schema.js";
export class WarehouseRoutes {
  constructor(
    private auth: Authentication,
    private warehouseController: WarehouseController,
    public router: Router = Router(),
  ) {
    this.initializeRoutes();
  }
  protected initializeRoutes() {
    this.router.post(
      "/api/v1/warehouses",
      this.auth.verify,
      permissionsCheck(warehousesPermissions),
      ValidationMiddleware.validate(newWarehouseSchema, "body"),
      this.warehouseController.createNewWarehouse,
    );
    this.router.get(
      "/api/v1/warehouses",
      this.auth.verify,
      this.warehouseController.getAllWarehouses,
    );
    this.router.get(
      "/api/v1/warehouses/:id",
      this.auth.verify,
      ValidationMiddleware.validate(warehouseId, "params"),
      this.warehouseController.getWarehouseById,
    );
    this.router.put(
      "/api/v1/warehouses/:id",
      this.auth.verify,
      permissionsCheck(warehousesPermissions),
      ValidationMiddleware.validate(warehouseId, "params"),
      ValidationMiddleware.validate(newWarehouseSchema, "body"),
      this.warehouseController.updateWarehouse,
    );
    this.router.delete(
      "/api/v1/warehouses/:id",
      this.auth.verify,
      permissionsCheck(warehousesPermissions),
      ValidationMiddleware.validate(warehouseId, "params"),
      this.warehouseController.deleteWarehouse,
    );
  }
}
