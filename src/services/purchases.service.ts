import { IPurchaseOrder } from "../models/purchase.model.js";
import { RedisCacheService } from "../types/common.types.js";
import { Logger } from "../utils/logger.js";
import { BaseService } from "./base.service.js";
import { PurchaseOrder } from "../models/purchase.model.js";
import { IProduct, Product } from "../models/product.model.js";

export class PurchaseService extends BaseService {
  constructor(logger: Logger, caching: RedisCacheService) {
    super(logger, caching);
  }
  addPurchase = async (
    data: Omit<IPurchaseOrder, "_id">,
  ): Promise<IPurchaseOrder> => {
    const result = await Product.find({ warehouse: data.warehouse })
      .populate<{ warehouse: { capacity: number } }>("warehouse", "capacity")
      .lean();
    const capacity = result[0]?.warehouse.capacity;
    let usedCapacity = result.reduce((acc: number, curr) => {
      return acc + curr.quantity * curr.volume;
    }, 0);
    for (const item of data.items) {
      const product: IProduct | null = await Product.findById(item.product);
      if (!product) {
        this.logger.error(`Product with id ${item.product} not found`);
        throw new Error(`Product with id ${item.product} not found`);
      }
      usedCapacity += product.volume * item.quantity;
    }
    if (usedCapacity > capacity) {
      this.logger.error(`Warehouse capacity exceeded`);
      throw new Error(`Warehouse capacity exceeded`);
    }
    return this.insertToDatabaseAndCache("Purchase", data, PurchaseOrder);
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
  updatePurchaseStatus = async (
    id: string,
    status: string,
  ): Promise<IPurchaseOrder> => {
    if (status === "completed") {
      const resultPurchase: IPurchaseOrder = await this.updateItem(
        "Purchase",
        id,
        { status: status },
        PurchaseOrder,
      );
      for (const product of resultPurchase.items) {
        await Product.updateOne(
          {
            _id: product.product,
          },
          { $inc: { quantity: +product.quantity } },
        );
        this.logger.info(`Product ${product.product} updated successfully`);
      }
      return resultPurchase;
    }
    const result: IPurchaseOrder = await this.updateItem(
      "Purchase",
      id,
      { status: status },
      PurchaseOrder,
    );
    return result;
  };
  updatePurchasePaymentStatus = async (
    id: string,
    status: string,
  ): Promise<IPurchaseOrder> => {
    return this.updateItem(
      "Purchase",
      id,
      { paymentStatus: status },
      PurchaseOrder,
    );
  };
}
