import { Authentication } from "../../../middleware/auth.middleware.js";
import { InventoryController } from "../controllers/inventory.controller.js";
import { Router } from "express";
import {
  permissionsCheck,
  productsPermissions,
} from "../../../middleware/access.middleware.js";
import { ValidationMiddleware } from "../../../middleware/validation.middleware.js";
import { addProduct, productId } from "../../../schemas/inventory.schemas.js";
export class InventoryRoutes {
  constructor(
    private auth: Authentication,
    private inventoryController: InventoryController,
    public router: Router = Router(),
  ) {
    this.initializeRoutes();
  }
  protected initializeRoutes() {
    this.router.post(
      "/api/v1/inventory",
      this.auth.verify,
      permissionsCheck(productsPermissions),
      ValidationMiddleware.validate(addProduct),
      this.inventoryController.createProduct,
    );
    this.router.get(
      "/api/v1/inventory",
      this.auth.verify,
      permissionsCheck(productsPermissions),
      this.inventoryController.getAllProducts,
    );
    this.router.get(
      "/api/v1/inventory/:id",
      this.auth.verify,
      ValidationMiddleware.validate(productId, "params"),
      this.inventoryController.getProductById,
    );
    this.router.put(
      "/api/v1/inventory/:id",
      this.auth.verify,
      ValidationMiddleware.validate(productId, "params"),
      ValidationMiddleware.validate(addProduct),
      this.inventoryController.updateProduct,
    );
    this.router.delete(
      "/api/v1/inventory/:id",
      this.auth.verify,
      ValidationMiddleware.validate(productId, "params"),
      this.inventoryController.deleteProduct,
    );
  }
}
