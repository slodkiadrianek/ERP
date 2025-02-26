import { RedisCacheService } from "../types/common.types.js";
import { Logger } from "../utils/logger.js";
import { AppError } from "../models/error.model.js";
import { newWarehouse } from "../api/v1/controllers/warehouse.controller.js";
import { IWarehouse } from "../models/warehouse.model.js";
import { Warehouse } from "../models/warehouse.model.js";
import { BaseService } from "./base.service.js";
export class WarehouseService extends BaseService {
  constructor(logger: Logger, caching: RedisCacheService) {
    super(logger, caching);
  }
  createNewWarehouse = async (
    data: Omit<IWarehouse, "_id">,
  ): Promise<IWarehouse> => {
    const warehouseExist = await Warehouse.findOne({ name: data.name });

    if (warehouseExist) {
      this.logger.error("Warehouse already exists", { data });
      throw new AppError(400, "Warehouse", "Warehouse already exists");
    }

    return this.insertToDatabaseAndCache<IWarehouse>(
      "Warehouse",
      data,
      Warehouse,
    );
  };
  getAllWarehouses = async (): Promise<IWarehouse[]> => {
    return this.getAllItems<IWarehouse>("warehouses", Warehouse);
  };
  getWarehouseById = async (id: string): Promise<IWarehouse> => {
    return this.getItemById<IWarehouse>("Warehouse", id, Warehouse);
  };
  updateWarehouse = async (
    id: string,
    data: newWarehouse,
  ): Promise<IWarehouse> => {
    return this.updateItem<IWarehouse>("Warehouse", id, data, Warehouse);
  };
  deleteWarehouse = async (id: string): Promise<string> => {
    return this.deleteItem<IWarehouse>("Warehouse", id, Warehouse);
  };
}
