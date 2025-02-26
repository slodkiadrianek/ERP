import { Document, Schema, model, Types, Model } from "mongoose";
import { IWarehouse } from "./warehouse.model.js";

export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  cost: number;
  quantity: number;
  minStockLevel: number;
  volume: number; // in m^3
  category: ICategory["_id"];
  warehouse: IWarehouse["_id"];
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    cost: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    minStockLevel: { type: Number, default: 10 },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    volume: { type: Number, required: true },
    warehouse: {
      type: Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
  },
  { timestamps: true },
);

export const Category: Model<ICategory> = model<ICategory>(
  "Category",
  categorySchema,
);
export const Product: Model<IProduct> = model<IProduct>(
  "Product",
  productSchema,
);
