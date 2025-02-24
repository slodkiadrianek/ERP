import { Authentication } from "../../../middleware/auth.middleware.js";
import { inventoryController } from "../controllers/inventory.controller.js";
import { Router } from "express";
import {
  warehousesPermissions,
  permissionsCheck,
} from "../../../middleware/access.middleware.js";
export class invetoryRoutes {
  constructor(
    private auth: Authentication,
    private invenController: inventoryController,
    public router: Router = Router(),
  ) {
    this.initializeRoutes();
  }
  protected initializeRoutes() {
    this.router.post(
      "/api/v1/warehouses",
      this.auth.verify,
      permissionsCheck(warehousesPermissions),
    );
  }
}
