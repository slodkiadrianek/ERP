import { IProduct, Product } from "../models/product.model.js";
import { RedisCacheService } from "../types/common.types.js";
import { Logger } from "../utils/logger.js";
import { BaseService } from "./base.service.js";
export class InventoryService extends BaseService {
  constructor(logger: Logger, caching: RedisCacheService) {
    super(logger, caching);
  }
  createProduct = async (data: Omit<IProduct, "_id">): Promise<IProduct> => {
    return await this.insertToDatabaseAndCache<IProduct>(
      "Product",
      data,
      Product,
    );
  };
  getAllProducts = async (): Promise<IProduct[]> => {
    return await this.getAllItems<IProduct>("Product", Product);
  };
  getProductById = async (id: string): Promise<IProduct> => {
    return await this.getItemById<IProduct>("Product", id, Product);
  };
  updateProduct = async (
    id: string,
    data: Omit<IProduct, "_id">,
  ): Promise<IProduct> => {
    return await this.updateItem<IProduct>("Product", id, data, Product);
  };
  deleteProduct = async (id: string): Promise<string> => {
    const item: IProduct | null = await Product.findOne({
      _id: id,
      quantity: 0,
    });
    if (!item) {
      return "Product is not empty, can not delete";
    }
    return await this.deleteItem<IProduct>("Product", id, Product);
  };
}
