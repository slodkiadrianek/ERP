import { Router } from "express";
import { Authentication } from "../../../middleware/auth.middleware.js";
import {
  permissionsCheck,
  purchasePermissions,
} from "../../../middleware/access.middleware.js";
import { ValidationMiddleware } from "../../../middleware/validation.middleware.js";
import {
  addPurchaseOrder,
  purchaseOrderId,
  purchaseOrderPaymentStatus,
  purchaseOrderStatus,
} from "../../../schemas/purchase.schemas.js";
import { PurchaseController } from "../controllers/purchases.controller.js";
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
      "/api/v1/purchases",
      this.auth.verify,
      permissionsCheck(purchasePermissions),
      ValidationMiddleware.validate(addPurchaseOrder),
      this.purchaseController.addPurchase,
    );
    this.router.get(
      "/api/v1/purchases",
      this.auth.verify,
      permissionsCheck(purchasePermissions),
      this.purchaseController.getPurchases,
    );
    this.router.get(
      "/api/v1/purchases/:id",
      this.auth.verify,
      permissionsCheck(purchasePermissions),
      ValidationMiddleware.validate(purchaseOrderId, "params"),
      this.purchaseController.getPurchaseById,
    );
    this.router.put(
      "/api/v1/purchases/:id",
      this.auth.verify,
      permissionsCheck(purchasePermissions),
      ValidationMiddleware.validate(purchaseOrderId, "params"),
      ValidationMiddleware.validate(addPurchaseOrder),
      this.purchaseController.updatePurchase,
    );
    this.router.patch(
      "/api/v1/purchases/:id/status/:status",
      this.auth.verify,
      permissionsCheck(purchasePermissions),
      ValidationMiddleware.validate(purchaseOrderStatus, "params"),
      this.purchaseController.updatePurchaseStatus,
    );
    this.router.patch(
      "/api/v1/purchases/:id/payment/:paymentStatus",
      this.auth.verify,
      permissionsCheck(purchasePermissions),
      ValidationMiddleware.validate(purchaseOrderPaymentStatus, "params"),
      this.purchaseController.updatePurchasePaymentStatus,
    );
  }
}
