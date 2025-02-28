import { IPurchaseOrder } from "../models/purchase.model.js";
import { RedisCacheService } from "../types/common.types.js";
import { Logger } from "../utils/logger.js";
import { BaseService } from "./base.service.js";
import { PurchaseOrder } from "../models/purchase.model.js";

export class PurchaseService extends BaseService {
  constructor(logger: Logger, caching: RedisCacheService) {
    super(logger, caching);
  }
  addPurchase = async (
    data: Omit<IPurchaseOrder, "_id">,
  ): Promise<IPurchaseOrder> => {
    return this.insertToDatabaseAndCache("purchase", data, PurchaseOrder);
  };
  getPurchases = async (): Promise<IPurchaseOrder[]> => {
    return this.getAllItems("Purchases", PurchaseOrder);
  };
  getPurchaseById = async (id: string): Promise<IPurchaseOrder> => {
    return this.getItemById("Purchase", id, PurchaseOrder);
  };
  updatePurchase = async (
    id: string,
    data: Omit<IPurchaseOrder, "_id">,
  ): Promise<IPurchaseOrder> => {
    return this.updateItem("Purchase", id, data, PurchaseOrder);
  };
  updatePurchaseStatus;
  updatePurchasePaymentStatus;
}
