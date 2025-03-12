import { SupplierController } from "../controllers/supplier.controller.js";
import { Authentication } from "../../../middleware/auth.middleware.js";
import { Router } from "express";
import {
  permissionsCheck,
  purchasePermissions,
} from "../../../middleware/access.middleware.js";
import { addSupplier, supplierId } from "../../../schemas/purchase.schemas.js";
import { ValidationMiddleware } from "../../../middleware/validation.middleware.js";
export class SupplierRoutes {
  constructor(
    private auth: Authentication,
    private supplierController: SupplierController,
    public router: Router = Router()
  ) {
    this.initializeRoutes();
  }

  protected initializeRoutes() {
    this.router.post(
      "/api/v1/suppliers",
      this.auth.verify,
      permissionsCheck(purchasePermissions),
      ValidationMiddleware.validate(addSupplier, "body"),
      this.supplierController.addSupplier
    );
    this.router.get(
      "/api/v1/suppliers",
      this.auth.verify,
      permissionsCheck(purchasePermissions),
      this.supplierController.getAllSupplier
    );
    this.router.get(
      "/api/v1/suppliers/:id",
      this.auth.verify,
      permissionsCheck(purchasePermissions),
      ValidationMiddleware.validate(supplierId, "params"),
      this.supplierController.getSupplierById
    );
    this.router.patch(
      "/api/v1/suppliers/:id",
      this.auth.verify,
      permissionsCheck(purchasePermissions),
      ValidationMiddleware.validate(supplierId, "params"),
      ValidationMiddleware.validate(addSupplier, "body"),
      this.supplierController.addSupplier
    );
    // this.router.post(
    //   "/api/v1/suppliers",
    //   this.auth.verify,
    //   permissionsCheck(purchasePermissions),
    //   ValidationMiddleware.validate(addSupplier, "body"),
    //   this.supplierController.addSupplier
    // );
  }
}
