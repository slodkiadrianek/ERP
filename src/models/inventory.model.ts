import mongoose from "mongoose";

export interface ICategory {
  _id: string;
  name: string;
  description: string;
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  cost: number;
  quantity: number;
  minStockLevel: Number;
  category: ICategory;
  warehouse: IWarehouse;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWarehouse {
  name: string;
  location: {
    country: string;
    city: string;
    street: string;
    code: number;
    number: string;
  };
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new mongoose.Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    cost: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    minStockLevel: { type: Number, default: 10 }, // Alert when stock is below this level
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" },
  },
  { timestamps: true }
);

const warehouseSchema = new mongoose.Schema<IWarehouse>(
  {
    name: { type: String, required: true },
    location: {
      country: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      code: {
        type: Number,
        required: true,
      },
      number: {
        type: String,
        required: true,
      },
    },
    capacity: { type: Number, required: true },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
const Product = mongoose.model("Product", productSchema);
const Warehouse = mongoose.model("Warehouse", warehouseSchema);
