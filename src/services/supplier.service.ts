import { ISupplier, Supplier } from "../models/purchase.model.js";
import { RedisCacheService } from "../types/common.types.js";
import { Logger } from "../utils/logger.js";
import { BaseService } from "./base.service.js";

export class SupplierService extends BaseService {
  constructor(logger: Logger, caching: RedisCacheService) {
    super(logger, caching);
  }
  addSupplier = async (data: Omit<ISupplier, "_id">): Promise<ISupplier> => {
    return this.insertToDatabaseAndCache("Supplier", data, Supplier);
  };
  getAllSupliers = async (): Promise<ISupplier[]> => {
    return this.getAllItems("Suppliers", Supplier);
  };
  getSupplierById = async (id: string): Promise<ISupplier> => {
    return this.getItemById("Supplier", id, Supplier);
  };
  updateSupplier = async (
    id: string,
    data: Omit<ISupplier, "_id">
  ): Promise<ISupplier> => {
    return this.updateItem("Supplier", id, data, Supplier);
  };
  // writeMessageToSupplier = async()
}
