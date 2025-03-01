import { Logger } from "../../../utils/logger.js";
import { PurchaseService } from "../../../services/purchases.service.js";
import { NextFunction, Request, Response } from "express";
import { IPurchaseOrder } from "../../../models/purchase.model.js";

export class PurchaseController {
  constructor(
    private logger: Logger,
    private purchasesService: PurchaseService,
  ) {}
  addPurchase = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data: Omit<IPurchaseOrder, "_id"> = req.body;
      this.logger.info(`Adding purchase order`);
      const result: IPurchaseOrder =
        await this.purchasesService.addPurchase(data);
      this.logger.info(`Purchase order added successfully`);
      res.status(201).json({
        success: true,
        data: {
          purchase: result,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
  getPurchases = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      this.logger.info(`Getting all purchases`);
      const result: IPurchaseOrder[] =
        await this.purchasesService.getPurchases();
      this.logger.info(`Purchases retrieved successfully`);
      res.status(200).json({
        success: true,
        data: {
          purchases: result,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
  getPurchaseById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      this.logger.info(`Getting purchase with id ${id}`);
      const result: IPurchaseOrder =
        await this.purchasesService.getPurchaseById(id);
      this.logger.info(`Purchase retrieved successfully`);
      res.status(200).json({
        success: true,
        data: {
          purchase: result,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
  updatePurchase = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const data: Omit<IPurchaseOrder, "_id"> = req.body;
      this.logger.info(`Updating purchase with id ${id}`);
      const result: IPurchaseOrder = await this.purchasesService.updatePurchase(
        id,
        data,
      );
      this.logger.info(`Purchase updated successfully`);
      res.status(200).json({
        success: true,
        data: {
          purchase: result,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
  updatePurchaseStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id, status } = req.params as { id: string; status: string };
      this.logger.info(`Updating purchase status with id ${id}`);
      const result: IPurchaseOrder =
        await this.purchasesService.updatePurchaseStatus(id, status);
      this.logger.info(`Purchase status updated successfully`);
      res.status(200).json({
        success: true,
        data: {
          purchase: result,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
  updatePurchasePaymentStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id, paymentStatus } = req.params as {
        id: string;
        paymentStatus: string;
      };
      this.logger.info(`Updating purchase payment status with id ${id}`);
      const result: IPurchaseOrder =
        await this.purchasesService.updatePurchasePaymentStatus(
          id,
          paymentStatus,
        );
      this.logger.info(`Purchase payment status updated successfully`);
      res.status(200).json({
        success: true,
        data: {
          purchase: result,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
}
