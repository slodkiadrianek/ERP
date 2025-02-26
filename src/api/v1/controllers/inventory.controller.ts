import { Request, Response, NextFunction } from "express";
import { Logger } from "../../../utils/logger.js";
import { InventoryService } from "../../../services/inventory.service.js";
import { IProduct } from "../../../models/product.model.js";
export class InventoryController {
  constructor(
    private logger: Logger,
    private inventoryService: InventoryService,
  ) {}
  createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data: Omit<IProduct, "_id"> = req.body;
      this.logger.info("Adding new product", { data });
      const result: IProduct = await this.inventoryService.createProduct(data);
      this.logger.info("New product added", { result });
      res.status(200).json({
        success: true,
        data: {
          product: result,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
  getAllProducts = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      this.logger.info("Getting all products");
      const result: IProduct[] = await this.inventoryService.getAllProducts();
      this.logger.info("All products fetched", { result });
      res.status(200).json({
        success: true,
        data: {
          products: result,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
  getProductById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id: string = req.params.id;
      this.logger.info("Getting product by id", { id });
      const result: IProduct = await this.inventoryService.getProductById(id);
      this.logger.info("Product fetched", { result });
      res.status(200).json({
        success: true,
        data: {
          product: result,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
  updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id: string = req.params.id;
      const data: Omit<IProduct, "_id"> = req.body;
      this.logger.info("Updating product", { id, data });
      const result: IProduct = await this.inventoryService.updateProduct(
        id,
        data,
      );
      this.logger.info("Product updated", { result });
      res.status(200).json({
        success: true,
        data: {
          product: result,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
  deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id: string = req.params.id;
      this.logger.info("Deleting product", { id });
      const result: string = await this.inventoryService.deleteProduct(id);
      this.logger.info("Product deleted", { result });
      res.status(200).json({
        success: true,
        data: {
          product: result,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
}
