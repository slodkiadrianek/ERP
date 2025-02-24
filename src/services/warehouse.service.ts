import { RedisCacheService } from "../types/common.types.js";
import { Logger } from "../utils/logger.js";
import { AppError } from "../models/error.model.js";
import { newWarehouse } from "../api/v1/controllers/warehouse.controller.js";
import { IWarehouse } from "../models/warehouse.model.js";
import { Warehouse } from "../models/warehouse.model.js";
export class WarehouseService {
  constructor(
    private logger: Logger,
    private caching: RedisCacheService,
  ) {}
  createNewWarehouse = async (data: newWarehouse): Promise<IWarehouse> => {
    try {
      const warehouseExist: IWarehouse | null = await Warehouse.findOne({
        name: data.name,
      });

      if (warehouseExist) {
        this.logger.error("Warehouse already exists", { data });
        throw new AppError(400, "Warehouse", "Warehouse already exists");
      }

      const result: IWarehouse = await Warehouse.create(data);

      await this.caching.set(
        `Warehouse-${result._id}`,
        JSON.stringify(result),
        300,
      );

      return result;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      this.logger.error("Failed to register new warehouse", { error });
      throw new AppError(500, "Warehouse", "Failed to register new warehouse");
    }
  };
  getAllWarehouses = async (): Promise<IWarehouse[]> => {
    try {
      if (await this.caching.exists(`Warehouses`)) {
        const result: IWarehouse[] | null = JSON.parse(
          (await this.caching.get(`Warehouses`)) || "",
        );
        if (!result) {
          this.logger.error(
            `An error occurred while retrieving warehouses from the cache.`,
          );
          throw new AppError(
            404,
            "Warehouse",
            "An error occurred while retrieving warehouses from the cache.",
          );
        }
        return result;
      }
      const result: IWarehouse[] = await Warehouse.find();
      await this.caching.set(`Warehouses`, JSON.stringify(result), 300);
      return result;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      this.logger.error("Failed to register new warehouse", { error });
      throw new AppError(500, "Warehouse", "Failed to register new warehouse");
    }
  };
  getWarehouseById = async (id: string): Promise<IWarehouse> => {
    try {
      if (await this.caching.exists(`Warehouse-${id}`)) {
        const result: IWarehouse | null = JSON.parse(
          (await this.caching.get(`Warehouse-${id}`)) || "",
        );
        if (!result) {
          this.logger.error(
            `An error occurred while retrieving warehouse from the cache.`,
            { id },
          );
          throw new AppError(
            404,
            "Warehouse",
            "An error occurred while retrieving warehouse from the cache.",
          );
        }
        return result;
      }
      const result: IWarehouse | null = await Warehouse.findOne({ _id: id });
      if (!result) {
        this.logger.error("Warehouse with this ID does not exist", { id });
        throw new AppError(
          404,
          "Warehouse",
          "Warehouse with this ID does not exist",
        );
      }
      await this.caching.set(`Warehouse-${id}`, JSON.stringify(result), 300);
      return result;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      this.logger.error("Failed to retrieve warehouse by id", { error });
      throw new AppError(
        500,
        "Warehouse",
        "Failed to retrieve warehouse by id",
      );
    }
  };
}
