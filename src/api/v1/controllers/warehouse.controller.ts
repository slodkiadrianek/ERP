import { Logger } from "../../../utils/logger.js";
import { Request, Response, NextFunction } from "express";
import { WarehouseService } from "../../../services/warehouse.service.js";
import { IWarehouse } from "../../../models/warehouse.model.js";
export interface newWarehouse {
  name: string;
  location: {
    country: string;
    city: string;
    street: string;
    code: string;
    number: number;
  };
}
export class WarehouseController {
  constructor(
    private logger: Logger,
    private warehouseService: WarehouseService,
  ) {}
  createNewWarehouse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data: Omit<IWarehouse, "_id"> = req.body;
      this.logger.info("Creating new warehouse", { data });
      const result: IWarehouse =
        await this.warehouseService.createNewWarehouse(data);
      this.logger.info("New warehouse created", { result });
      res.status(201).json({
        success: true,
        data: {
          warehouse: {
            name: result?.name,
            location: {
              country: result?.location.country,
              city: result?.location.city,
              street: result?.location.street,
              code: result?.location.code,
              number: result?.location.number,
            },
            capacity: result?.capacity,
          },
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
  getAllWarehouses = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      this.logger.info("Getting all warehouses");
      const result: IWarehouse[] =
        await this.warehouseService.getAllWarehouses();
      this.logger.info("All warehouses retrieved", { result });
      res.status(200).json({
        success: true,
        data: {
          warehouses: result.map((warehouse) => ({
            name: warehouse.name,
            location: {
              country: warehouse.location.country,
              city: warehouse.location.city,
              street: warehouse.location.street,
              code: warehouse.location.code,
              number: warehouse.location.number,
            },
            capacity: warehouse.capacity,
          })),
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
  getWarehouseById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params as {
        id: string;
      };
      this.logger.info("Getting warehouse by id");
      const result: IWarehouse =
        await this.warehouseService.getWarehouseById(id);
      this.logger.info("Warehouse retrieved by id", { result });
      res.status(200).json({
        success: true,
        data: {
          warehouse: {
            name: result.name,
            location: {
              country: result.location.country,
              city: result.location.city,
              srtreet: result.location.street,
              code: result.location.code,
              number: result.location.number,
            },
            capacity: result.capacity,
          },
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
  updateWarehouse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const data: newWarehouse = req.body as newWarehouse;
      this.logger.info("Updating warehouse", { data });
      const result: IWarehouse = await this.warehouseService.updateWarehouse(
        id,
        data,
      );
      this.logger.info("Warehouse updated", { result });
      res.status(200).json({
        success: true,
        data: {
          warehouse: {
            name: result.name,
            location: {
              country: result.location.country,
              city: result.location.city,
              srtreet: result.location.street,
              code: result.location.code,
              number: result.location.number,
            },
            capacity: result.capacity,
          },
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
  deleteWarehouse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      this.logger.info("Deleting warehouse by id", { id });
      const result: string = await this.warehouseService.deleteWarehouse(id);
      this.logger.info("Warehouse deleted by id", { result });
      res.status(200).json({
        success: true,
        data: {
          warehouse: result,
        },
      });
      return;
    } catch (error) {
      next(error);
    }
  };
}
