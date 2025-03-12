import { Request, Response, NextFunction } from "express";
import { SupplierService } from "../../../services/supplier.service.js";
import { Logger } from "../../../utils/logger.js";
import { ISupplier } from "../../../models/purchase.model.js";

export class SupplierController {
  constructor(
    private logger: Logger,
    private supplierService: SupplierService
  ) {}
  addSupplier = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = req.body as Omit<ISupplier, "_id">;
      this.logger.info("Attempting to add supplier", { data });
      const result: ISupplier = await this.supplierService.addSupplier(data);
      this.logger.info(`Added new Supplier`, { title: result.name });
      res.status(200).json({
        success: true,
        data: {
          supplier: result,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
  getAllSupplier = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      this.logger.info("Attempting to get all suppliers");
      const result: ISupplier[] = await this.supplierService.getAllSupliers();
      this.logger.info(`Got all suppliers`, { result });
      res.status(200).json({
        success: true,
        data: {
          supplier: result,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
  getSupplierById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      this.logger.info("Attempting to get the supplier");

      const result: ISupplier = await this.supplierService.getSupplierById(id);
      this.logger.info(`Got supplier`, { result });
      res.status(200).json({
        success: true,
        data: {
          supplier: result,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
  updateSupplier = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const data = req.body as Omit<ISupplier, "_id">;
      this.logger.info("Attempting to update the  supplier");
      const result: ISupplier = await this.supplierService.updateSupplier(
        id,
        data
      );
      this.logger.info(`Supplier have updated`, { result });
      res.status(200).json({
        success: true,
        data: {
          supplier: result,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
}
