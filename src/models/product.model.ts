import { Document, Schema, model, Types } from "mongoose";
import { IWarehouse } from "./inventory.model.js";

export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  sku: string;
  price: number;
  cost: number;
  quantity: number;
  minStockLevel: Number;
  category: ICategory["_id"];
  warehouse: IWarehouse["_id"];
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    cost: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    minStockLevel: { type: Number, default: 10 },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    warehouse: { type: Schema.Types.ObjectId, ref: "Warehouse" },
  },
  { timestamps: true }
);

export const Category = model("Category", categorySchema);
export const Product = model("Product", productSchema);
