import { Router } from "express";
import { Authentication } from "../../../middleware/auth.middleware.js";
import {
  permissionsCheck,
  purchasePermissions,
} from "../../../middleware/access.middleware.js";
import { ValidationMiddleware } from "../../../middleware/validation.middleware.js";
import { addPurchaseOrder } from "../../../schemas/purchase.schemas.js";
export class PurchaseRoutes {
  constructor(
    private auth: Authentication,
    private purchaseController: PurchaseController,
    public router: Router = Router(),
  ) {
    this.initializeRoutes();
  }
  protected initializeRoutes() {
    this.router.post(
      "/api/v1/purchase",
      this.auth.verify,
      permissionsCheck(purchasePermissions),
      ValidationMiddleware.validate(addPurchaseOrder),
    );
  }
}
